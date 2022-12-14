package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.request.VehicleRequest;
import io.github.mateuszuran.dto.response.UserResponse;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.dto.response.VehicleResponse;
import io.github.mateuszuran.filestore.CloudinaryManager;
import io.github.mateuszuran.mapper.VehicleMapper;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.model.Vehicle;
import io.github.mateuszuran.model.VehicleImage;
import io.github.mateuszuran.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository repository;
    private final CloudinaryManager cloudinary;
    private final WebClient.Builder webClientBuilder;
    private final VehicleMapper mapper;

    private UserResponse getUsername(String username) {
        return webClientBuilder.build().get()
                .uri("http://user-service/api/user",
                        uriBuilder -> uriBuilder.queryParam("username", username).build())
                .retrieve()
                .bodyToMono(UserResponse.class)
                .block();
    }

    public void addVehicle(VehicleRequest vehicleDto) {
        var username = getUsername(vehicleDto.getUserVehicleUsername());
        Vehicle vehicle = Vehicle.builder()
                .model(vehicleDto.getModel())
                .type(vehicleDto.getType())
                .licensePlate(vehicleDto.getLicensePlate())
                .leftTankFuelCapacity(vehicleDto.getLeftTankFuelCapacity())
                .rightTankFuelCapacity(vehicleDto.getRightTankFuelCapacity())
                .fullTankCapacity(vehicleDto.getLeftTankFuelCapacity() + vehicleDto.getRightTankFuelCapacity())
                .adBlueCapacity(vehicleDto.getAdBlueCapacity())
                .userId(username.getId())
                .build();
        repository.save(vehicle);
    }

    public void updateVehicleWithTrailer(Long id, Trailer trailer) {
        var vehicle = repository.findById(id).orElseThrow();
        vehicle.setTrailer(trailer);
        repository.save(vehicle);
    }

    public void updateVehicleWithImage(Long id, VehicleImage image) {
        var vehicle = repository.findById(id).orElseThrow();
        vehicle.setImage(image);
        repository.save(vehicle);
    }

    public Vehicle getVehicle(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    public Vehicle updateVehicle(Long id, VehicleRequest vehicleDto) {
        return repository.findById(id)
                .map(vehicle -> {
                    if(vehicleDto.getModel() != null) {
                        vehicle.setModel(vehicleDto.getModel());
                    } else if (vehicleDto.getType() != null) {
                        vehicle.setType(vehicleDto.getType());
                    } else if (vehicleDto.getLicensePlate() != null) {
                        vehicle.setLicensePlate(vehicleDto.getLicensePlate());
                    } else if (vehicleDto.getLeftTankFuelCapacity() != null) {
                        vehicle.setLeftTankFuelCapacity(vehicleDto.getLeftTankFuelCapacity());
                    } else if (vehicleDto.getRightTankFuelCapacity() != null) {
                        vehicle.setRightTankFuelCapacity(vehicleDto.getRightTankFuelCapacity());
                    } else if (vehicleDto.getAdBlueCapacity() != null) {
                        vehicle.setAdBlueCapacity(vehicleDto.getAdBlueCapacity());
                    }
                    return repository.save(vehicle);
                }).orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    public VehiclePDFResponse sendToPdf(Long id) {
        var vehicle = repository.findByUserId(id).orElseThrow();
        var mappedVehicle = mapper.mapToVehicleResponse(vehicle);
        var mappedTrailer = mapper.mapToTrailerResponse(vehicle.getTrailer());
        var mappedImage = mapper.mapToImageResponse(vehicle.getImage());
        return VehiclePDFResponse.builder()
                .vehicle(mappedVehicle)
                .trailer(mappedTrailer)
                .image(mappedImage)
                .build();
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(vehicle -> {
                    cloudinary.deleteImage(vehicle.getImage().getPublicImageId());
                    repository.deleteById(vehicle.getId());
                });
    }
}
