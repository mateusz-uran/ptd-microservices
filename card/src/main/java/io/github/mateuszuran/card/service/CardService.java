package io.github.mateuszuran.card.service;

import com.ctc.wstx.shaded.msv_core.util.Uri;
import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.response.*;
import io.github.mateuszuran.card.event.CardToggledEvent;
import io.github.mateuszuran.card.exception.card.CardEmptyException;
import io.github.mateuszuran.card.exception.card.CardExistsException;
import io.github.mateuszuran.card.exception.card.CardNotFoundException;
import io.github.mateuszuran.card.exception.card.UserNotReadyException;
import io.github.mateuszuran.card.mapper.CardMapper;
import io.github.mateuszuran.card.mapper.FuelMapper;
import io.github.mateuszuran.card.mapper.TripMapper;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.repository.CardProjections;
import io.github.mateuszuran.card.repository.CardRepository;
import io.github.mateuszuran.card.repository.UserProjections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@Slf4j
@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository repository;
    private final WebClient.Builder webClientBuilder;
    private final KafkaTemplate<String, CardToggledEvent> kafkaTemplate;
    private final TripMapper tripMapper;
    private final FuelMapper fuelMapper;
    private final CardMapper cardMapper;

    public UserProjectionsResponse getUserInformation(String username) {
        return webClientBuilder.build().get()
                .uri("http://user-service/api/user",
                        uriBuilder -> uriBuilder.path("/get/{username}").build(username))
                .retrieve()
                .bodyToMono(UserProjectionsResponse.class)
                .block();
    }

    public CardResponse saveCard(CardRequest cardDto, int year, int month, int dayOfMonth) {

        var user = getUserInformation(cardDto.getAuthorUsername());

        if (!user.isActive()) {
            throw new UserNotReadyException();
        }

        if (repository.existsByNumberAndUserId(cardDto.getNumber(), user.getId())) {
            throw new CardExistsException(cardDto.getNumber());
        }

        if (cardDto.getNumber().isEmpty()) {
            throw new CardEmptyException();
        }

        var now = LocalDateTime.now();
        var date = LocalDateTime.of(year, month, dayOfMonth, now.getHour(), now.getMinute(), now.getSecond());

        var card = Card.builder()
                .number(cardDto.getNumber())
                .userId(user.getId())
                .creationTime(date)
                .build();

        repository.save(card);

        return cardMapper.mapToCardResponseWithModelMapper(card);
    }

    public Card checkIfCardExists(Long id) {
        return repository.findById(id)
                .orElseThrow(CardNotFoundException::new);
    }

    public List<CardResponse> getAllCardByUserAndDate(String username, int year, int month) {
        var userInfo = getUserInformation(username);

        if (!userInfo.isActive()) {
            throw new UserNotReadyException();
        }

        var actualDate = LocalDate.of(year, month, 1);

        LocalDateTime startDate = actualDate.with(firstDayOfMonth()).atStartOfDay();
        LocalDateTime endDate = actualDate.with(lastDayOfMonth()).atStartOfDay();

        var result = repository.findAllByUserIdAndCreationTimeBetween(userInfo.getId(), startDate, endDate);
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

    public boolean toggleCard(Long cardId, String username) {
        var result = repository.findById(cardId).orElseThrow();

        if (result.getFuels().isEmpty() || result.getTrips().isEmpty()) {
            throw new CardEmptyException();
        }

        result.setDone(!result.isDone());
        repository.save(result);

        String message = result.isDone() ? "Card ready" : "Card not ready.";

        kafkaTemplate.send("notificationTopic", new CardToggledEvent(result.getNumber(), username, message));

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
