package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.CardRequest;
import io.github.mateuszuran.card.dto.CardResponse;
import io.github.mateuszuran.card.dto.UserResponse;
import io.github.mateuszuran.card.model.Card;
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
        return  webClientBuilder.build().get()
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

    public List<CardResponse> getAllCardsByUser(CardRequest cardDto) {
        var username = getUsername(cardDto.getAuthorUsername());
        var cards = repository.findAllByUserId(username.getId());
        log.info("card service get all");
        return cards.stream()
                .map(this::mapToCardResponse)
                .collect(Collectors.toList());
    }

    private CardResponse mapToCardResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .number(card.getNumber())
                .done(card.isDone())
                .build();
    }
}
