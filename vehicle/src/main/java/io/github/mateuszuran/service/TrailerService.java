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

    public void addTrailer(Long id, TrailerRequest trailerDto) {
        var vehicle = service.getVehicle(id);
        Trailer trailer = Trailer.builder()
                .type(trailerDto.getType())
                .licensePlate(trailerDto.getLicensePlate())
                .fuelCapacity(trailerDto.getFuelCapacity())
                .vehicle(vehicle)
                .build();
        repository.save(trailer);
        service.updateVehicleWithTrailer(id, trailer);
    }

    public void updateTrailer(Long id, TrailerRequest trailerDto) {
        repository.findById(id)
                .map(trailer -> {
                    if(trailerDto.getType() != null) {
                        trailer.setType(trailerDto.getType());
                    } else if (trailerDto.getLicensePlate() != null) {
                        trailer.setLicensePlate(trailerDto.getLicensePlate());
                    } else if (trailerDto.getFuelCapacity() != null) {
                        trailer.setFuelCapacity(trailerDto.getFuelCapacity());
                    }
                    return repository.save(trailer);
                }).orElseThrow(() -> new IllegalArgumentException("Trailer not found"));
    }
}
