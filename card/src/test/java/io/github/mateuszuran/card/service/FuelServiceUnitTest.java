package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.request.FuelRequest;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.mapper.FuelMapper;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Fuel;
import io.github.mateuszuran.card.repository.FuelRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Slf4j
@ExtendWith(MockitoExtension.class)
class FuelServiceUnitTest {
    private FuelService service;
    @Mock
    private CardService cardService;
    @Mock
    private FuelMapper fuelMapper;
    @Mock
    private ModelMapperConfig mapper;
    @Mock
    private ModelMapper modelMapper;
    @Mock
    private FuelRepository repository;
    private Fuel fuel;

    @BeforeEach
    void setUp() {
        service = new FuelService(repository, cardService, mapper, fuelMapper);
        fuel = Fuel.builder()
                .id(5L)
                .refuelingDate("15.12.2022")
                .vehicleCounter(123500)
                .refuelingAmount(500).build();
    }

    @Test
    void addRefuelling() {
        Card card = Card.builder().number("XYZ")
                .build();
        FuelRequest fuelDto = FuelRequest.builder()
                .refuelingDate("15.12.2022").build();
        when(fuelMapper.mapToFuelRequest(fuelDto)).thenReturn(fuel);
        when(cardService.checkIfCardExists(card.getId())).thenReturn(card);
        service.addRefuelling(fuelDto, card.getId());
        verify(repository, times(1)).save(fuel);
        verify(repository).save(any(Fuel.class));
    }

    @Test
    void getSingleFuel() {
        FuelResponse fuelResponse = FuelResponse.builder()
                .id(anyLong())
                .refuelingDate("15.12.2022")
                .vehicleCounter(123500)
                .refuelingAmount(500).build();
        when(repository.findById(fuel.getId())).thenReturn(Optional.of(fuel));
        when(fuelMapper.mapToFuelResponseWithModelMapper(fuel)).thenReturn(fuelResponse);
        var result = service.getSingleFuel(fuel.getId());
        assertThat(result.getVehicleCounter()).isEqualTo(fuel.getVehicleCounter());
    }

    @Test
    void update() {
        FuelRequest updateFuel = FuelRequest.builder()
                .refuelingDate("15.12.2022")
                .vehicleCounter(135500)
                .refuelingAmount(500).build();
        FuelResponse fuelResponseUpdated = FuelResponse.builder()
                .id(anyLong())
                .refuelingDate("15.12.2022")
                .vehicleCounter(135500)
                .refuelingAmount(500).build();
        when(repository.findById(fuel.getId())).thenReturn(Optional.of(fuel));
        when(mapper.modelMapper()).thenReturn(modelMapper);
        when(fuelMapper.mapToFuelResponseWithModelMapper(fuel)).thenReturn(fuelResponseUpdated);
        var result = service.update(fuel.getId(), updateFuel);
        assertThat(result.getVehicleCounter()).isEqualTo(updateFuel.getVehicleCounter());
    }

    @Test
    void delete() {
        when(repository.findById(fuel.getId())).thenReturn(Optional.of(fuel));
        service.delete(fuel.getId());
        verify(repository, times(1)).deleteById(fuel.getId());
    }
}