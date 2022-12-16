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

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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

    private UserResponse getUsername(String username) {
        return webClientBuilder.build().get()
                .uri("http://user-service/api/user",
                        uriBuilder -> uriBuilder.queryParam("username", username).build())
                .retrieve()
                .bodyToMono(UserResponse.class)
                .block();
    }

    public void saveCard(CardRequest cardDto) {
        if (repository.existsByNumber(cardDto.getNumber())) {
            throw new CardExistsException(cardDto.getNumber());
        } else {
            var username = getUsername(cardDto.getAuthorUsername());
            Card card = Card.builder()
                    .number(cardDto.getNumber())
                    .userId(username.getId())
                    .creationTime(LocalDateTime.now())
                    .build();
            repository.save(card);
        }
    }

    public Card checkIfCardExists(Long id) {
        return repository.findById(id)
                .orElseThrow(CardNotFoundException::new);
    }

    public List<CardResponse> getAllCardsByUser(String username) {
        var user = getUsername(username);
        var cards = repository.findAllByUserId(user.getId());
        return cards.stream()
                .map(cardMapper::mapToCardResponseWithModelMapper)
                .collect(Collectors.toList());
    }

    public List<CardResponse> getAllCardByUserAndDate(String username, String month) {
        var user = getUsername(username);
        var cards = repository.findAllByUserId(user.getId());
        return cards.stream()
                .filter(card -> card.getCreationTime().getMonth().toString().equals(month))
                .toList()
                .stream().map(cardMapper::mapToCardResponseWithFormattedCreationTime)
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
        if (result.getTrips().isEmpty() && result.getFuels().isEmpty()) {
            throw new CardEmptyException();
        } else {
            result.setDone(!result.isDone());
            repository.save(result);
            if (result.isDone()) {
                kafkaTemplate.send("notificationTopic", new CardToggledEvent(result.getNumber(), "Card is ready."));
            } else {
                kafkaTemplate.send("notificationTopic", new CardToggledEvent(result.getNumber(), "Card is not ready yet."));
            }
            return result.isDone();
        }
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
