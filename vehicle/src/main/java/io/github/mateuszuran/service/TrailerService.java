package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.model.Trailer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrailerService {
    private final VehicleService service;

    public TrailerDTO addTrailerToVehicle(TrailerDTO trailerDTO, String vehicleId) {
        Trailer trailer = Trailer.builder()
                .trailerType(trailerDTO.getTrailerType())
                .trailerLicensePlate(trailerDTO.getTrailerLicensePlate())
                .trailerFuelCapacity(trailerDTO.getTrailerFuelCapacity())
                .build();
        service.updateVehicleWithTrailerData(trailer, vehicleId);
        return TrailerDTO.builder()
                .trailerType(trailer.getTrailerType())
                .trailerLicensePlate(trailer.getTrailerLicensePlate())
                .trailerFuelCapacity(trailer.getTrailerFuelCapacity())
                .build();
    }
}
