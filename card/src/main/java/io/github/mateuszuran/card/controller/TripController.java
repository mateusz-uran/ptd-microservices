package io.github.mateuszuran.card.controller;

import io.github.mateuszuran.card.dto.request.TripListValues;
import io.github.mateuszuran.card.dto.request.TripValues;
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
    public ResponseEntity<?> addSingleTrip(@RequestBody TripValues tripDto, @RequestParam Long id) {
        service.addTrip(tripDto, id);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PostMapping(params = "param")
    public ResponseEntity<?> addTripsList(@RequestBody TripListValues tripListValues, @RequestParam Long id) {
        service.addManyTips(tripListValues, id);
        log.info("parametrized");
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }
}
