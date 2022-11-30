package io.github.mateuszuran.card.controller;

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
    public ResponseEntity<?> addTripsList(@RequestBody List<TripValues> trips, @RequestParam Long id) {
        log.info(String.valueOf(trips.get(0)));
        service.addManyTips(trips, id);
        log.info("parametrized");
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> edit(@RequestParam Long id, @RequestBody TripValues tripDto) {
        service.updateTrip(id, tripDto);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@RequestParam Long id) {
        service.delete(id);
        return ResponseEntity.ok().body(HttpStatus.NO_CONTENT);
    }
}
