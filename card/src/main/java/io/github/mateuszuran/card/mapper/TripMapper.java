package io.github.mateuszuran.card.mapper;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.model.Trip;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TripMapper {
    private final ModelMapperConfig mapper;

    public TripResponse mapToTripResponseWithModelMapper(Trip trip) {
        return mapper.modelMapper().map(trip, TripResponse.class);
    }

    public Trip mapToTripValuesWithModelMapper(TripValues tripValues) {
        return mapper.modelMapper().map(tripValues, Trip.class);
    }
}
