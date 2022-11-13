package io.github.mateuszuran.card.controller;

import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.response.CardResponse;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.service.CardService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/card")
@RequiredArgsConstructor
public class CardController {
    private final CardService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @CircuitBreaker(name="user", fallbackMethod = "fallbackMethod")
    public String addCard(@RequestBody CardRequest cardDto) {
        service.saveCard(cardDto);
        return "Card added";
    }

    @GetMapping
    @CircuitBreaker(name="user", fallbackMethod = "fallBackMethodForList")
    public ResponseEntity<List<CardResponse>> getCards(@RequestBody CardRequest cardDto) {
        return ResponseEntity.ok().body(service.getAllCardsByUser(cardDto));
    }

    @GetMapping("/fuel")
    public ResponseEntity<List<FuelResponse>> getFuelsFromCard(@RequestParam Long id) {
        return ResponseEntity.ok()
                .body(service.getFuelsFromCard(id));
    }

    @PutMapping
    public ResponseEntity<?> toggleCard(@RequestParam Long id) {
        service.toggleCard(id);
        return ResponseEntity.ok().body("Card toggled");
    }

    public ResponseEntity<List<FailureResponse>> fallBackMethodForList(CardRequest cardDto, RuntimeException exception) {
        FailureResponse resp = FailureResponse.builder()
                .response("No data")
                .build();
        return ResponseEntity.ok().body(List.of(resp));
    }

    public String fallbackMethod(CardRequest cardDto, RuntimeException exception) {
        log.info("User service is down");
        return "Something went wrong, please try again later!";
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    static class FailureResponse {
        private String response;
    }
}
