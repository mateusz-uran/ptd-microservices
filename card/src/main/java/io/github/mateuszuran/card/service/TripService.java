package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.TripListValues;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
                            .card(card)
                            .build();
                    trips.add(trip);
                }
        );
        repository.saveAll(trips);
    }
}
