package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.model.Trailer;
import io.github.mateuszuran.model.Vehicle;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrailerServiceTest {
    @InjectMocks
    private TrailerService trailerService;
    @Mock
    private VehicleService vehicleService;

    @Test
    void addTrailerToVehicle() {
        //given
        Trailer trailer = Trailer.builder().trailerType("Fridge").build();
        TrailerDTO trailerDTO = TrailerDTO.builder().trailerType("Fridge").build();
        Vehicle vehicle = Vehicle.builder().id("ABC").trailer(trailer).build();
        //when
        when(vehicleService.updateVehicleWithTrailer(trailer, "ABC")).thenReturn(vehicle);
        var result = trailerService.addTrailerToVehicle(trailerDTO, "ABC");
        //then
        assertThat(result).isEqualTo(trailerDTO);
    }
}