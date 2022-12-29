package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.response.*;
import io.github.mateuszuran.card.event.CardToggledEvent;
import io.github.mateuszuran.card.exception.card.CardEmptyException;
import io.github.mateuszuran.card.exception.card.CardExistsException;
import io.github.mateuszuran.card.exception.card.CardNotFoundException;
import io.github.mateuszuran.card.mapper.CardMapper;
import io.github.mateuszuran.card.mapper.FuelMapper;
import io.github.mateuszuran.card.mapper.TripMapper;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@Slf4j
@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository repository;
    private final WebClient webClient;
    private final KafkaTemplate<String, CardToggledEvent> kafkaTemplate;
    private final TripMapper tripMapper;
    private final FuelMapper fuelMapper;
    private final CardMapper cardMapper;

    public UserResponse getUsername(String username) {
        return webClient.get()
                .uri("http://user-service/api/user",
                        uriBuilder -> uriBuilder.queryParam("username", username).build())
                .retrieve()
                .bodyToMono(UserResponse.class)
                .block();
    }

    public CardResponse saveCard(CardRequest cardDto, int year, int month, int dayOfMonth) {
        if (repository.existsByNumber(cardDto.getNumber())) {
            throw new CardExistsException(cardDto.getNumber());
        } else {
            var username = getUsername(cardDto.getAuthorUsername());
            var actualDate = LocalDateTime.now();
            var date = LocalDateTime.of(year, month, dayOfMonth, actualDate.getHour(), actualDate.getMinute(), actualDate.getSecond());
            Card card = Card.builder()
                    .number(cardDto.getNumber())
                    .userId(username.getId())
                    .creationTime(date)
                    .build();
            repository.save(card);
            return cardMapper.mapToCardResponseWithModelMapper(card);
        }
    }

    public Card checkIfCardExists(Long id) {
        return repository.findById(id)
                .orElseThrow(CardNotFoundException::new);
    }

    public List<CardResponse> getAllCardByUserAndDate(String username, int year, int month) {
        var user = getUsername(username);
        var actualDate = LocalDate.of(year, month, 1);

        LocalDateTime startDate = actualDate.with(firstDayOfMonth()).atStartOfDay();
        LocalDateTime endDate = actualDate.with(lastDayOfMonth()).atStartOfDay();

        var result = repository.findAllByUserIdAndCreationTimeBetween(user.getId(), startDate, endDate);
        return result.stream().map(cardMapper::mapToCardResponseWithFormattedCreationTime)
                .sorted(Comparator.comparing(CardResponse::getCreationTime).reversed())
                .toList();
    }

    public List<FuelResponse> getFuelsFromCard(Long id) {
        return repository.findById(id)
                .orElseThrow(CardNotFoundException::new)
                .getFuels().stream()
                .map(fuelMapper::mapToFuelResponseWithModelMapper)
                .sorted(Comparator.comparing(FuelResponse::getVehicleCounter))
                .collect(Collectors.toList());
    }

    public List<TripResponse> getTripsFromCard(Long id) {
        return repository.findById(id)
                .orElseThrow(CardNotFoundException::new)
                .getTrips().stream()
                .map(tripMapper::mapToTripResponseWithModelMapper)
                .sorted(Comparator.comparing(TripResponse::getCounterEnd))
                .collect(Collectors.toList());
    }

    public boolean toggleCard(Long id) {
        var result = repository.findById(id).orElseThrow();

        if (result.getFuels().isEmpty()) {
            throw new CardEmptyException();
        } else if (result.getTrips().isEmpty()) {
            throw new CardEmptyException();
        } else {
            result.setDone(!result.isDone());
            repository.save(result);
            if (result.isDone()) {
                kafkaTemplate.send("notificationTopic", new CardToggledEvent(result.getNumber(), "Card is ready."));
            } else {
                kafkaTemplate.send("notificationTopic", new CardToggledEvent(result.getNumber(), "Card is not ready yet."));
            }
        }
        return result.isDone();
    }

    public CardPDFResponse sendCardToPDF(Long id) {
        var card = checkIfCardExists(id);
        return mapCardToPdf(card);
    }

    public void deleteCard(Long id) {
        repository.findById(id).ifPresentOrElse(
                (card) -> repository.deleteById(card.getId()),
                () -> {
                    throw new CardNotFoundException();
                });
    }

    private CardPDFResponse mapCardToPdf(Card card) {
        var cardValues = CardResponse.builder()
                .id(card.getId())
                .number(card.getNumber())
                .done(card.isDone()).build();
        var trips = card.getTrips().stream()
                .map(tripMapper::mapToTripResponseWithModelMapper)
                .sorted(Comparator.comparing(TripResponse::getCounterEnd))
                .toList();
        var fuels = card.getFuels().stream()
                .map(fuelMapper::mapToFuelResponseWithModelMapper)
                .sorted(Comparator.comparing(FuelResponse::getVehicleCounter))
                .toList();
        return CardPDFResponse.builder()
                .cardInfo(cardValues)
                .trips(trips)
                .fuels(fuels)
                .build();

    }
}
