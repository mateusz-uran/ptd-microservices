package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.TripListValues;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository repository;
    private final CardService cardService;

    public void addTrip(TripValues tripDto, Long id) {
        Card card = cardService.checkIfCardExists(id);

        Trip trip = Trip.builder()
                .dayStart(tripDto.getDayStart())
                .dayEnd(tripDto.getDayEnd())
                .hourStart(tripDto.getHourStart())
                .hourEnd(tripDto.getHourEnd())
                .locationStart(tripDto.getLocationStart())
                .locationEnd(tripDto.getLocationEnd())
                .counterStart(tripDto.getCounterStart())
                .counterEnd(tripDto.getCounterEnd())
                .countryStart(tripDto.getCountryStart())
                .countryEnd(tripDto.getCountryEnd())
                .carMileage(calculateCarMileage(tripDto.getCounterStart(), tripDto.getCounterEnd()))
                .card(card)
                .build();
        repository.save(trip);
    }

    public void addManyTips(List<TripValues> trips, Long id) {
        Card card = cardService.checkIfCardExists(id);
        List<Trip> tripsToSave = new ArrayList<>();
        trips.forEach(
                tripValues -> {
                    Trip trip = Trip.builder()
                            .dayStart(tripValues.getDayStart())
                            .dayEnd(tripValues.getDayEnd())
                            .hourStart(tripValues.getHourStart())
                            .hourEnd(tripValues.getHourEnd())
                            .locationStart(tripValues.getLocationStart())
                            .locationEnd(tripValues.getLocationEnd())
                            .counterStart(tripValues.getCounterStart())
                            .counterEnd(tripValues.getCounterEnd())
                            .countryStart(tripValues.getCountryStart())
                            .countryEnd(tripValues.getCountryEnd())
                            .carMileage(calculateCarMileage(tripValues.getCounterStart(), tripValues.getCounterEnd()))
                            .card(card)
                            .build();
                    tripsToSave.add(trip);
                }
        );
        repository.saveAll(tripsToSave);
    }

    public TripResponse loadTrip(Long id) {
        return repository.findById(id)
                .stream()
                .findFirst()
                .map(this::mapToTripResponse)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    public TripResponse update(Long id, TripValues tripDto) {
        var result = repository.findById(id).orElseThrow();
        //TODO replace with object mapper to avoid boilerplate code
        result.setDayStart(tripDto.getDayStart());
        result.setHourStart(tripDto.getHourStart());
        result.setLocationStart(tripDto.getLocationStart());
        result.setCountryStart(tripDto.getCountryStart());
        result.setCounterStart(tripDto.getCounterStart());

        result.setDayEnd(tripDto.getDayEnd());
        result.setHourEnd(tripDto.getHourEnd());
        result.setLocationEnd(tripDto.getLocationEnd());
        result.setCountryEnd(tripDto.getCountryEnd());
        result.setCounterEnd(tripDto.getCounterEnd());
        repository.save(result);
        return Optional.of(result)
                .stream()
                .findFirst()
                .map(this::mapToTripResponse)
                .orElseThrow();
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(trip -> {
                    repository.deleteById(trip.getId());
                });
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
                .build();
    }

    private Integer calculateCarMileage (Integer min, Integer max) {
        return max - min;
    }
}
