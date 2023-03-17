package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.mapper.TripMapper;
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
    private final TripMapper tripMapper;

    public void addManyTips(List<TripValues> trips, Long id) {
        Card card = cardService.checkIfCardExists(id);
        List<Trip> tripsToSave = new ArrayList<>();
        trips.forEach(
                tripValues -> {
                    var trip = tripMapper.mapToTripValuesWithModelMapper(tripValues);
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
                .map(tripMapper::mapToTripResponseWithModelMapper)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    public TripResponse updateTrip(Long id, TripValues tripValues) {
        var tripToUpdate = repository.findById(id).orElseThrow();
        mapper.modelMapper().map(tripValues, tripToUpdate);
        tripToUpdate.setCarMileage(calculateCarMileage(tripToUpdate.getCounterStart(), tripToUpdate.getCounterEnd()));
        repository.save(tripToUpdate);
        return tripMapper.mapToTripResponseWithModelMapper(tripToUpdate);
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(trip -> {
                    repository.deleteById(trip.getId());
                });
    }

    public void deleteSelected(List<Long> selectedTrips) {
        var result = repository.findAllById(selectedTrips);
        repository.deleteAll(result);
    }

    private Integer calculateCarMileage(Integer min, Integer max) {
        return max - min;
    }
}
