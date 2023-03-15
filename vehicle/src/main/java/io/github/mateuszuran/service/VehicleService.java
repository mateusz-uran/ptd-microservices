package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.dto.VehicleDTO;
import io.github.mateuszuran.dto.VehicleImageDTO;
import io.github.mateuszuran.dto.VehicleResponseDTO;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.dto.response.VehicleResponse;
import io.github.mateuszuran.filestore.CloudinaryManager;
import io.github.mateuszuran.mapper.VehicleMapper;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.model.Vehicle;
import io.github.mateuszuran.model.VehicleImage;
import io.github.mateuszuran.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository repository;
    private final CloudinaryManager cloudinary;
    private final VehicleMapper mapper;

    public VehicleResponse addVehicleInformation(VehicleDTO vehicleDTO, Long userId) {
        Vehicle vehicle = Vehicle.builder()
                .model(vehicleDTO.getModel())
                .truckType(vehicleDTO.getTruckType())
                .truckLicensePlate(vehicleDTO.getTruckLicensePlate())
                .leftTankFuelCapacity(vehicleDTO.getLeftTankFuelCapacity())
                .rightTankFuelCapacity(vehicleDTO.getRightTankFuelCapacity())
                .fullTankCapacity(vehicleDTO.getLeftTankFuelCapacity() + vehicleDTO.getRightTankFuelCapacity())
                .adBlueCapacity(vehicleDTO.getAdBlueCapacity())
                .userId(userId)
                .build();
        repository.save(vehicle);
        return mapper.mapToVehicleResponse(vehicle);
    }

    public void updateVehicleWithTrailerData(Trailer trailer, String vehicleId) {
        var vehicleToUpdate = getVehicleById(vehicleId);
        vehicleToUpdate.setTrailer(trailer);
        repository.save(vehicleToUpdate);
    }

    public void updateVehicleWithImageData(VehicleImage vehicleImage, String vehicleId) {
        var vehicleToUpdate = getVehicleById(vehicleId);
        vehicleToUpdate.setImage(vehicleImage);
        repository.save(vehicleToUpdate);
    }

    public VehicleResponseDTO retrieveVehicleInformation(Long userId) {
        var vehicle = repository.findByUserId(userId).orElseThrow();

        var optionalTrailer = validate(vehicle.getTrailer(), new TrailerDTO(), mapper)
                .orElse(TrailerDTO.builder().build());
        var optionalImage = validate(vehicle.getImage(), new VehicleImageDTO(), mapper)
                .orElse(VehicleImageDTO.builder().build());

        return VehicleResponseDTO.builder()
                .truck(mapper.mapToVehicleDTO(vehicle))
                .trailer(optionalTrailer)
                .image(optionalImage)
                .build();
    }

    private <T, V> Optional<T> validate(V vehicleElement, T vehicleElementDto, VehicleMapper vehicleMapper) {
        if (vehicleElement != null) {
            return Optional.of(vehicleMapper.mapToDto(vehicleElement, vehicleElementDto));
        } else return Optional.empty();
    }

    public <T> T editVehicleInfo(T objectDto, String vehicleId) {
        var vehicleInfoToUpdate = getVehicleById(vehicleId);
        mapper.mapToDto(objectDto, vehicleInfoToUpdate);
        repository.save(vehicleInfoToUpdate);
        return mapper.mapToDto(vehicleInfoToUpdate, objectDto);
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

    public void delete(String vehicleId) {
        repository.findById(vehicleId)
                .ifPresent(vehicle -> {
                    if (vehicle.getImage() != null) {
                        cloudinary.deleteImage(vehicle.getImage().getVehicleImagePublicId());
                    }
                    repository.deleteById(vehicle.getId());
                });
    }

    public Vehicle getVehicleById(String vehicleId) {
        return repository.findById(vehicleId)
                .orElseThrow();
    }
}
