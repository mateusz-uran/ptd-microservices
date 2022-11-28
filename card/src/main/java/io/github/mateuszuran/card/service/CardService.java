package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.response.*;
import io.github.mateuszuran.card.event.CardToggledEvent;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Fuel;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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
            log.info("Card {} with given number already exists.", cardDto.getNumber());
            throw new IllegalArgumentException("Card with given number already exists.");
        } else {
            var username = getUsername(cardDto.getAuthorUsername());
            Card card = Card.builder()
                    .number(cardDto.getNumber())
                    .userId(username.getId())
                    .build();
            repository.save(card);
            log.info("Card {} added successfully", card.getNumber());
        }
    }

    public Card checkIfCardExists(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
    }

    public List<CardResponse> getAllCardsByUser(String username) {
        var user = getUsername(username);
        var cards = repository.findAllByUserId(user.getId());
        return cards.stream()
                .map(this::mapToCardResponse)
                .collect(Collectors.toList());
    }

    public List<FuelResponse> getFuelsFromCard(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"))
                .getFuels().stream()
                .map(this::mapToFuelResponse)
                .sorted(Comparator.comparing(FuelResponse::getVehicleCounter))
                .collect(Collectors.toList());
    }

    public List<TripResponse> getTripsFromCard(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"))
                .getTrips().stream()
                .map(this::mapToTripResponse)
                .sorted(Comparator.comparing(TripResponse::getCounterEnd))
                .collect(Collectors.toList());
    }

    public void toggleCard(Long id) {
        var result = repository.findById(id).orElseThrow();
        result.setDone(true);
        repository.save(result);
        kafkaTemplate.send("notificationTopic", new CardToggledEvent(result.getNumber()));
    }

    public CardPDFResponse sendCardToPDF(Long id) {
        var card = checkIfCardExists(id);
        return mapCardToPdf(card);
    }

    private CardPDFResponse mapCardToPdf(Card card) {
        var cardValues = CardResponse.builder()
                .id(card.getId())
                .number(card.getNumber())
                .done(card.isDone()).build();
        var trips = card.getTrips().stream()
                .map(this::mapToTripResponse)
                .sorted(Comparator.comparing(TripResponse::getCounterEnd))
                .toList();
        var fuels = card.getFuels().stream()
                .map(this::mapToFuelResponse)
                .sorted(Comparator.comparing(FuelResponse::getVehicleCounter))
                .toList();
        return CardPDFResponse.builder()
                .cardInfo(cardValues)
                .trips(trips)
                .fuels(fuels)
                .build();

    }

    private TripResponse mapToTripResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .dayStart(trip.getDayStart())
                .dayEnd(trip.getDayEnd())
                .hourStart(trip.getHourStart())
                .hourEnd(trip.getHourEnd())
                .locationStart(trip.getLocationStart())
                .locationEnd(trip.getLocationEnd())
                .countryStart(trip.getCountryStart())
                .countryEnd(trip.getCountryEnd())
                .counterStart(trip.getCounterStart())
                .counterEnd(trip.getCounterEnd())
                .carMileage(trip.getCarMileage())
                .build();
    }

    private FuelResponse mapToFuelResponse(Fuel fuel) {
        return FuelResponse.builder()
                .id(fuel.getId())
                .currentDate(fuel.getRefuelingDate())
                .refuelingLocation(fuel.getRefuelingLocation())
                .vehicleCounter(fuel.getVehicleCounter())
                .refuelingAmount(fuel.getRefuelingAmount())
                .build();
    }

    private CardResponse mapToCardResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .number(card.getNumber())
                .done(card.isDone())
                .build();
    }
}
