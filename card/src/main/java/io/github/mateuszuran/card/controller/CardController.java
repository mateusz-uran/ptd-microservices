package io.github.mateuszuran.card.controller;

import io.github.mateuszuran.card.dto.CardRequest;
import io.github.mateuszuran.card.dto.CardResponse;
import io.github.mateuszuran.card.service.CardService;
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
    public ResponseEntity<?> addCard(@RequestBody CardRequest cardDto) {
        service.saveCard(cardDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CardResponse>> getCards(@RequestBody CardRequest cardDto) {
        log.info("card controller get");
        return ResponseEntity.ok().body(service.getAllCardsByUser(cardDto));
    }
}
