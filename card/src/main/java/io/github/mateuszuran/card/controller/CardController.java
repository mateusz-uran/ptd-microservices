package io.github.mateuszuran.card.controller;

import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.dto.response.CardPDFResponse;
import io.github.mateuszuran.card.dto.response.CardResponse;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.service.CardService;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
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
    @CircuitBreaker(name = "user")
    public ResponseEntity<?> addCard(@RequestBody CardRequest cardDto) {
        service.saveCard(cardDto);
        return ResponseEntity.ok().body("Card added");
    }

    @GetMapping
    @CircuitBreaker(name = "user")
    public ResponseEntity<List<CardResponse>> getCards(@RequestParam String username) {
        return ResponseEntity.ok().body(service.getAllCardsByUser(username));
    }

    @GetMapping("/fuel")
    public ResponseEntity<List<FuelResponse>> getFuelsFromCard(@RequestParam Long id) {
        return ResponseEntity.ok()
                .body(service.getFuelsFromCard(id));
    }

    @GetMapping("/trip")
    public ResponseEntity<List<TripResponse>> getTripsFromCard(@RequestParam Long id) {
        return ResponseEntity.ok()
                .body(service.getTripsFromCard(id));
    }

    @GetMapping("/toggle")
    public ResponseEntity<?> toggleCard(@RequestParam Long id) {
        service.toggleCard(id);
        return ResponseEntity.ok().body("Card toggled");
    }

    @GetMapping("/single")
    public ResponseEntity<?> getSingleCard(@RequestParam Long id) {
        return ResponseEntity.ok().body("single card" + id);
    }

    @GetMapping(params = "id")
    public ResponseEntity<CardPDFResponse> sendCard(@RequestParam Long id) {
        return ResponseEntity.ok()
                .body(service.sendCardToPDF(id));
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@RequestParam Long id) {
        service.deleteCard(id);
        return ResponseEntity.ok().body(HttpStatus.NO_CONTENT);
    }
}
