package io.github.mateuszuran.mapper;

import io.github.mateuszuran.config.ModelMapperConfig;
import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.dto.VehicleDTO;
import io.github.mateuszuran.dto.VehicleImageDTO;
import io.github.mateuszuran.dto.response.TrailerResponse;
import io.github.mateuszuran.dto.response.VehicleImageResponse;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.dto.response.VehicleResponse;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.model.Vehicle;
import io.github.mateuszuran.model.VehicleImage;
import lombok.RequiredArgsConstructor;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;

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

    public VehicleDTO mapToVehicleDTO(Vehicle vehicle) {
        return mapper.modelMapper().map(vehicle, VehicleDTO.class);
    }

    public Vehicle mapToVehicle(VehicleDTO vehicleDTO) {
        return mapper.modelMapper().map(vehicleDTO, Vehicle.class);
    }

    public <T, V> T mapToDto(V object, T objectToMap) {
        mapper.modelMapper().map(object, objectToMap);
        return objectToMap;
    }

    public VehicleImageDTO mapToVehicleImageDTO(VehicleImage vehicleImage) {
        return mapper.modelMapper().map(vehicleImage, VehicleImageDTO.class);
    }
}
