package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.config.ModelMapperConfig;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository repository;
    private final CardService cardService;
    private final ModelMapperConfig mapper;

    public void addManyTips(List<TripValues> trips, Long id) {
        Card card = cardService.checkIfCardExists(id);
        List<Trip> tripsToSave = new ArrayList<>();
        trips.forEach(
                tripValues -> {
                    var trip = mapToTripValuesWithModelMapper(tripValues);
                    trip.setCarMileage(calculateCarMileage(tripValues.getCounterStart(), tripValues.getCounterEnd()));
                    trip.setCard(card);
                    tripsToSave.add(trip);
                }
        );
        repository.saveAll(tripsToSave);
    }

    public TripResponse loadTrip(Long id) {
        return repository.findById(id)
                .stream()
                .findFirst()
                .map(this::mapToTripResponseWithModelMapper)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    public TripResponse updateTrip(Long id, TripValues tripValues) {
        return repository.findById(id)
                .map(trip -> {
                            mapper.modelMapper().map(tripValues, trip);
                            trip.setCarMileage(calculateCarMileage(trip.getCounterStart(), trip.getCounterEnd()));
                            return repository.save(trip);
                        }
                ).stream()
                .findFirst()
                .map(this::mapToTripResponseWithModelMapper)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(trip -> {
                    repository.deleteById(trip.getId());
                });
    }

    private TripResponse mapToTripResponseWithModelMapper(Trip trip) {
        return mapper.modelMapper().map(trip, TripResponse.class);
    }

    private Trip mapToTripValuesWithModelMapper(TripValues tripValues) {
        return mapper.modelMapper().map(tripValues, Trip.class);
    }

    private Integer calculateCarMileage(Integer min, Integer max) {
        return max - min;
    }
}
