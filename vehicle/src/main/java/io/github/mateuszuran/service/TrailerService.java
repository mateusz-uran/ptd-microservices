package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.dto.request.TrailerRequest;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.repository.TrailerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrailerService {
    private final TrailerRepository repository;
    private final VehicleService service;

    public TrailerDTO addTrailerToVehicle(TrailerDTO trailerDTO, String vehicleId) {
        Trailer trailer = Trailer.builder()
                .type(trailerDTO.getType())
                .licensePlate(trailerDTO.getLicensePlate())
                .fuelCapacity(trailerDTO.getFuelCapacity())
                .build();
        repository.save(trailer);
        service.updateVehicleWithTrailerData(trailer, vehicleId);
        return TrailerDTO.builder()
                .type(trailer.getType())
                .licensePlate(trailer.getLicensePlate())
                .fuelCapacity(trailer.getFuelCapacity())
                .build();
    }
}
