package io.github.mateuszuran.mapper;

import io.github.mateuszuran.config.ModelMapperConfig;
import io.github.mateuszuran.dto.response.TrailerResponse;
import io.github.mateuszuran.dto.response.VehicleImageResponse;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.dto.response.VehicleResponse;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.model.Vehicle;
import io.github.mateuszuran.model.VehicleImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class VehicleMapper {
    private final ModelMapperConfig mapper;

    public VehicleResponse mapToVehicleResponse(Vehicle vehicle) {
        return mapper.modelMapper().map(vehicle, VehicleResponse.class);
    }

    public TrailerResponse mapToTrailerResponse(Trailer trailer) {
        return mapper.modelMapper().map(trailer, TrailerResponse.class);
    }

    public VehicleImageResponse mapToImageResponse(VehicleImage image) {
        return mapper.modelMapper().map(image, VehicleImageResponse.class);
    }
}
