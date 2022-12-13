package io.github.mateuszuran.card.mapper;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.request.FuelRequest;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.model.Fuel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FuelMapper {
    private final ModelMapperConfig mapper;

    public FuelResponse mapToFuelResponseWithModelMapper(Fuel fuel) {
        return mapper.modelMapper().map(fuel, FuelResponse.class);
    }

    public Fuel mapToFuelRequest(FuelRequest fuelRequest) {
        return mapper.modelMapper().map(fuelRequest, Fuel.class);
    }
}
