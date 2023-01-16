package io.github.mateuszuran.service;

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

    public void addTrailer(String id, TrailerRequest trailerDto) {
        Trailer trailer = Trailer.builder()
                .type(trailerDto.getType())
                .licensePlate(trailerDto.getLicensePlate())
                .fuelCapacity(trailerDto.getFuelCapacity())
                .build();
        repository.save(trailer);
        service.updateVehicleWithTrailer(id, trailer);
    }
}
