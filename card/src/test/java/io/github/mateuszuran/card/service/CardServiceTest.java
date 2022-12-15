package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.exception.card.CardNotFoundException;
import io.github.mateuszuran.card.mapper.FuelMapper;
import io.github.mateuszuran.card.mapper.TripMapper;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Fuel;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.CardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    private CardService service;
    @Mock
    private CardRepository repository;
    @Mock
    private FuelMapper fuelMapper;
    @Mock
    private TripMapper tripMapper;

    @BeforeEach
    void setUp() {
        service = new CardService(repository, null, null, tripMapper, fuelMapper, null);
    }

    @Test
    void checkIfCardExists() {
        //given
        Card card = Card.builder().id(anyLong()).build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));
        //when
        var result = service.checkIfCardExists(card.getId());
        //then
        assertThat(result).isEqualTo(card);
    }

    @Test
    void givenCardId_whenCheckIfExists_thenThrowException() {
        //given
        Card card = Card.builder().id(anyLong()).build();
        when(repository.findById(card.getId())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.checkIfCardExists(card.getId()))
                .isInstanceOf(CardNotFoundException.class)
                .hasMessageContaining("Card not found.");
    }

    @Test
    void getFuelsFromCard() {
        Card card = Card.builder()
                .id(anyLong())
                .fuels(List.of(Fuel.builder()
                        .refuelingDate("15.12.2022")
                        .vehicleCounter(123500)
                        .refuelingAmount(500).build()))
                .build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));
        var result = service.getFuelsFromCard(card.getId());
        assertThat(result.size()).isEqualTo(1);
    }

    @Test
    void getTripsFromCard() {
        Card card = Card.builder()
                .id(anyLong())
                .trips(List.of(Trip.builder()
                        .dayStart("15.12")
                        .counterEnd(150500).build()))
                .build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));
        var result = service.getTripsFromCard(card.getId());
        assertThat(result.size()).isEqualTo(1);
    }

    @Test
    void deleteCard() {
        Card card = Card.builder().number("XYZ").build();
        given(repository.findById(card.getId())).willReturn(Optional.of(card));
        service.deleteCard(card.getId());
        verify(repository, times(1)).deleteById(card.getId());
    }

    @Test
    void givenCardId_whenDelete_thenThrowException() {
        when(repository.findById(anyLong())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.deleteCard(anyLong()))
                .isInstanceOf(CardNotFoundException.class)
                .hasMessageContaining("Card not found.");
    }
}