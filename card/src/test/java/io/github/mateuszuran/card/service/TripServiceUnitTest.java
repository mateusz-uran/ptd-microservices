package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.request.TripValues;
import io.github.mateuszuran.card.dto.response.TripResponse;
import io.github.mateuszuran.card.mapper.TripMapper;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceUnitTest {
    private TripService service;
    @Mock
    private TripRepository repository;
    @Mock
    private CardService cardService;
    @Mock
    private TripMapper tripMapper;
    @Mock
    private ModelMapperConfig modelMapper;
    @Mock
    private ModelMapper mapper;

    @BeforeEach
    void setUp() {
        service = new TripService(repository, cardService, modelMapper, tripMapper);
    }

    @Test
    void addManyTips() {
        Card card = Card.builder().id(anyLong()).number("XYZ").build();
        when(cardService.checkIfCardExists(card.getId())).thenReturn(card);
        var trip = TripValues.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        var mappedTrip = Trip.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        when(tripMapper.mapToTripValuesWithModelMapper(trip)).thenReturn(mappedTrip);
        service.addManyTips(List.of(trip), card.getId());
        verify(repository).saveAll(anyCollection());
    }

    @Test
    void loadTrip() {
        Trip trip = Trip.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        when(repository.findById(trip.getId())).thenReturn(Optional.of(trip));
        TripResponse tripResponse = TripResponse.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        when(tripMapper.mapToTripResponseWithModelMapper(trip)).thenReturn(tripResponse);
        var result = service.loadTrip(trip.getId());
        assertThat(result.getCounterEnd()).isEqualTo(100);
    }

    @Test
    void updateTrip() {
        Trip trip = Trip.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        TripValues tripToUpdate = TripValues.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        TripResponse tripUpdated = TripResponse.builder().dayStart("15.01").counterStart(600).counterEnd(100).build();
        when(repository.findById(trip.getId())).thenReturn(Optional.of(trip));
        when(modelMapper.modelMapper()).thenReturn(mapper);
        when(tripMapper.mapToTripResponseWithModelMapper(trip)).thenReturn(tripUpdated);
        var result = service.updateTrip(trip.getId(), tripToUpdate);
        assertThat(result.getCounterStart()).isEqualTo(600);
    }

    @Test
    void delete() {
        Trip trip = Trip.builder().dayStart("15.01").counterStart(500).counterEnd(100).build();
        when(repository.findById(trip.getId())).thenReturn(Optional.of(trip));
        service.delete(trip.getId());
        verify(repository, times(1)).deleteById(trip.getId());
    }
}