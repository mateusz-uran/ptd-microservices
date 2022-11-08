package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.response.CardResponse;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.dto.response.UserResponse;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Fuel;
import io.github.mateuszuran.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository repository;
    private final WebClient.Builder webClientBuilder;

    private UserResponse getUsername(String username) {
        return webClientBuilder.build().get()
                .uri("http://localhost:8080/api/user",
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

    public List<CardResponse> getAllCardsByUser(CardRequest cardDto) {
        var username = getUsername(cardDto.getAuthorUsername());
        var cards = repository.findAllByUserId(username.getId());
        log.info("card service get all");
        return cards.stream()
                .map(this::mapToCardResponse)
                .collect(Collectors.toList());
    }

    public List<FuelResponse> getFuelsFromCard(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"))
                .getFuels().stream()
                .map(this::mapToFuelResponse)
                .collect(Collectors.toList());

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
