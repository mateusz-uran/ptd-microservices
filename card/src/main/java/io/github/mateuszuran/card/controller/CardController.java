package io.github.mateuszuran.card.controller;

import io.github.mateuszuran.card.dto.request.CardRequest;
import io.github.mateuszuran.card.dto.response.CardPDFResponse;
import io.github.mateuszuran.card.dto.response.CardResponse;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.service.CardService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<?> addCard(@RequestBody CardRequest cardDto, @RequestParam int year, @RequestParam int month, @RequestParam int dayOfMonth) {
        return ResponseEntity.ok().body(service.saveCard(cardDto, year, month, dayOfMonth));
    }

    @GetMapping("/all")
    @CircuitBreaker(name = "user")
    public ResponseEntity<List<CardResponse>> getCardsByMonth(
            @RequestParam String username, @RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok().body(service.getAllCardByUserAndDate(username, year, month));
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
    public ResponseEntity<Boolean> toggleCard(@RequestParam Long cardId, @RequestParam String username) {
        return ResponseEntity.ok(service.toggleCard(cardId, username));
    }

    @GetMapping
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
