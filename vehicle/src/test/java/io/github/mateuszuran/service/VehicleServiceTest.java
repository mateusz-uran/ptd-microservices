package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.dto.VehicleDTO;
import io.github.mateuszuran.dto.VehicleImageDTO;
import io.github.mateuszuran.dto.VehicleResponseDTO;
import io.github.mateuszuran.dto.response.TrailerResponse;
import io.github.mateuszuran.dto.response.VehicleImageResponse;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.dto.response.VehicleResponse;
import io.github.mateuszuran.filestore.CloudinaryManager;
import io.github.mateuszuran.mapper.VehicleMapper;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.model.Vehicle;
import io.github.mateuszuran.model.VehicleImage;
import io.github.mateuszuran.repository.VehicleRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;


@Slf4j
@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {
    @InjectMocks
    private VehicleService vehicleService;
    @Mock
    private VehicleRepository vehicleRepository;
    @Mock
    private VehicleMapper mapper;
    @Mock
    private CloudinaryManager cloudinaryManager;

    @Test
    void addVehicleInformation() {
        //given
        var vehicleDTO = VehicleDTO.builder().model("SCANIA").build();
        var vehicle = Vehicle.builder().model("SCANIA").build();
        //when
        when(mapper.mapToVehicle(vehicleDTO)).thenReturn(vehicle);
        when(vehicleService.addVehicleInformation(VehicleDTO.builder().model("SCANIA").build(), 1L))
                .thenReturn(vehicleDTO);
        //then
        assertThat(vehicleService.addVehicleInformation(VehicleDTO.builder().model("SCANIA").build(), 1L))
                .isEqualTo(vehicleDTO);
    }

    @Test
    void updateVehicleWithTrailer() {
        //given
        Trailer trailer = Trailer.builder().trailerType("lorry").build();
        Vehicle vehicle = Vehicle.builder().id("ABC").trailer(Trailer.builder().trailerType("lorry").build()).build();
        //when
        when(vehicleRepository.findById(vehicle.getId())).thenReturn(Optional.of(vehicle));
        when(vehicleService.updateVehicleWithTrailer(trailer, "ABC")).thenReturn(vehicle);
        //then
        assertThat(vehicleService.updateVehicleWithTrailer(trailer, "ABC")).isEqualTo(vehicle);
    }

    @Test
    void updateVehicleWithImageData() {
        //given
        VehicleImage vehicleImage = VehicleImage.builder().vehicleImageName("SCANIA 500").build();
        Vehicle vehicle = Vehicle.builder().id("ABC").image(VehicleImage.builder().vehicleImageName("SCANIA 500").build()).build();
        //when
        when(vehicleRepository.findById(vehicle.getId())).thenReturn(Optional.of(vehicle));
        when(vehicleService.updateVehicleWithImageData(vehicleImage, "ABC")).thenReturn(vehicle);
        //then
        assertThat(vehicleService.updateVehicleWithImageData(vehicleImage, "ABC")).isEqualTo(vehicle);
    }

    @Test
    void editVehicleInfo() {
        //given
        Vehicle vehicle = Vehicle.builder().id("ABC").build();
        TrailerDTO trailerDTO = TrailerDTO.builder().trailerType("lorry").build();
        //when
        when(vehicleRepository.findById("ABC")).thenReturn(Optional.of(vehicle));
        when(vehicleService.editVehicleInfo(trailerDTO, "ABC")).thenReturn(trailerDTO);
        //then
        assertThat(vehicleService.editVehicleInfo(trailerDTO, "ABC")).isEqualTo(trailerDTO);
    }

    @Test
    void sendToPdf() {
        //given
        Vehicle vehicle = Vehicle.builder().id("ABC").build();
        when(vehicleRepository.findByUserId(1L)).thenReturn(Optional.of(vehicle));

        VehicleResponse vehicleResponse = VehicleResponse.builder().model("SCANIA").build();
        when(mapper.mapToVehicleResponse(vehicle)).thenReturn(vehicleResponse);

        TrailerResponse trailerResponse = TrailerResponse.builder().type("fridge").build();
        when(mapper.mapToTrailerResponse(vehicle.getTrailer())).thenReturn(trailerResponse);

        VehicleImageResponse vehicleImageResponse = VehicleImageResponse.builder().name("scania 500").build();
        when(mapper.mapToImageResponse(vehicle.getImage())).thenReturn(vehicleImageResponse);

        VehiclePDFResponse vehiclePDFResponse = VehiclePDFResponse.builder()
                .vehicle(vehicleResponse)
                .trailer(trailerResponse)
                .image(vehicleImageResponse)
                .build();
        //when
        var result = vehicleService.sendToPdf(1L);
        //then
        assertThat(result).isEqualTo(vehiclePDFResponse);
        assertThat(result.getVehicle()).isEqualTo(vehiclePDFResponse.getVehicle());
    }

    @Test
    void delete() {
        //given
        Vehicle vehicle = Vehicle.builder().id("ABC").model("SCANIA").build();
        //when
        when(vehicleRepository.findById("ABC")).thenReturn(Optional.of(vehicle));
        vehicleService.delete(vehicle.getId());
        //then
        verify(vehicleRepository).deleteById(vehicle.getId());
    }

    @Test
    void deleteWithImage() {
        //given
        VehicleImage vehicleImage = VehicleImage.builder().vehicleImagePublicId("url").build();
        Vehicle vehicle = Vehicle.builder().id("ABC").model("SCANIA").image(vehicleImage).build();
        //when
        when(vehicleRepository.findById("ABC")).thenReturn(Optional.of(vehicle));
        vehicleService.delete(vehicle.getId());
        //then
        verify(vehicleRepository).deleteById(vehicle.getId());
        verify(cloudinaryManager).deleteImage(vehicleImage.getVehicleImagePublicId());
    }

    @Test
    void getVehicleById() {
        //given
        Vehicle vehicle = Vehicle.builder().id("ABC").model("SCANIA").build();
        //given
        when(vehicleRepository.findById(vehicle.getId())).thenReturn(Optional.of(vehicle));
        //when
        var result = vehicleService.getVehicleById(vehicle.getId());
        //then
        assertThat(result).isEqualTo(vehicle);
    }
}