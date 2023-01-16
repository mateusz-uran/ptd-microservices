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

    public VehicleResponse addVehicle(VehicleRequest vehicleDto) {
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
        var result = repository.save(vehicle);
        return mapper.mapToVehicleResponse(result);
    }

    public void updateVehicleWithTrailer(String id, Trailer trailer) {
        var vehicle = repository.findById(id).orElseThrow();
        vehicle.setTrailer(trailer);
        repository.save(vehicle);
    }

    public void updateVehicleWithImage(String id, VehicleImage image) {
        var vehicle = repository.findById(id).orElseThrow();
        vehicle.setImage(image);
        repository.save(vehicle);
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

    public void delete(String id) {
        repository.findById(id)
                .ifPresent(vehicle -> {
                    cloudinary.deleteImage(vehicle.getImage().getPublicImageId());
                    repository.deleteById(vehicle.getId());
                });
    }
}
