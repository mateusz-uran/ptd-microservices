package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.TripListValues;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    public void addManyTips(TripListValues tripListValues, Long id) {
        Card card = cardService.checkIfCardExists(id);
        List<Trip> trips = new ArrayList<>();
        tripListValues.getTripValuesList().forEach(
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
                    trips.add(trip);
                }
        );
        repository.saveAll(trips);
    }

    public void updateTrip(Long id, TripValues tripDto) {
        repository.findById(id)
                .map(trip -> {
                    if(tripDto.getDayStart() != null) {
                        trip.setDayStart(tripDto.getDayStart());
                    } else if (tripDto.getDayEnd() != null) {
                        trip.setDayEnd(tripDto.getDayEnd());
                    } else if (tripDto.getHourStart() != null) {
                        trip.setHourStart(tripDto.getHourStart());
                    } else if (tripDto.getHourEnd() != null) {
                        trip.setHourEnd(tripDto.getHourEnd());
                    } else if (tripDto.getLocationStart() != null) {
                        trip.setLocationStart(tripDto.getLocationStart());
                    } else if (tripDto.getLocationEnd() != null) {
                        trip.setLocationEnd(tripDto.getLocationEnd());
                    } else if (tripDto.getCounterStart() != null) {
                        trip.setCounterStart(tripDto.getCounterStart());
                    } else if (tripDto.getCounterEnd() != null) {
                        trip.setCounterEnd(tripDto.getCounterEnd());
                    } else if (tripDto.getCountryStart() != null) {
                        trip.setCountryStart(tripDto.getCountryStart());
                    } else if (tripDto.getCountryEnd() != null) {
                        trip.setCountryEnd(tripDto.getCountryEnd());
                    }
                    trip.setCarMileage(calculateCarMileage(trip.getCounterStart(), trip.getCounterEnd()));
                    return repository.save(trip);
                }).orElseThrow();
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(trip -> {
                    repository.deleteById(trip.getId());
                });
    }

    private Integer calculateCarMileage (Integer min, Integer max) {
        return max - min;
    }
}
