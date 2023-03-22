package io.github.mateuszuran.card.controller;

import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.service.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/trip")
@RequiredArgsConstructor
public class TripController {
    private final TripService service;

    @PostMapping
    public ResponseEntity<?> addTripsList(@RequestBody List<TripValues> trips, @RequestParam Long cardId) {
        service.addManyTips(trips, cardId);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @DeleteMapping("/list")
    public ResponseEntity<?> deleteAll(@RequestBody List<Long> selectedTripId) {
        service.deleteSelected(selectedTripId);
        return ResponseEntity.ok().body(HttpStatus.NO_CONTENT);
    }
}
