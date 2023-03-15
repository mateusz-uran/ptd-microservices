package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.event.CardToggledEvent;
import io.github.mateuszuran.card.exception.card.CardEmptyException;
import io.github.mateuszuran.card.exception.card.CardNotFoundException;
import io.github.mateuszuran.card.mapper.FuelMapper;
import io.github.mateuszuran.card.mapper.TripMapper;
import io.github.mateuszuran.card.model.Card;
import io.github.mateuszuran.card.model.Fuel;
import io.github.mateuszuran.card.model.Trip;
import io.github.mateuszuran.card.repository.CardRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@Slf4j
@ExtendWith(MockitoExtension.class)
class CardServiceUnitTest {

    private CardService service;
    @Mock
    private CardRepository repository;
    @Mock
    private FuelMapper fuelMapper;
    @Mock
    private TripMapper tripMapper;
    @Mock
    private KafkaTemplate<String, CardToggledEvent> kafkaTemplate;

    @BeforeEach
    void setUp() {
        service = new CardService(repository, null, kafkaTemplate, tripMapper, fuelMapper, null);
    }

    @Test
    void givenCardId_whenFindById_thenReturnObject() {
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
    void givenCardId_whenFindById_thenReturnMappedSortedListOfFuels() {
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
    void givenCardId_whenFindById_thenReturnMappedSortedListOfTrips() {
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
    void givenCardIdWithEmptyFuelList_whenToggle_thenThrow() {
        Card card = Card.builder()
                .id(anyLong())
                .done(false)
                .trips(Collections.emptyList())
                .fuels(List.of(Fuel.builder()
                        .refuelingDate("15.12.2022")
                        .vehicleCounter(123500)
                        .refuelingAmount(500).build()))
                .build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));
        assertThatThrownBy(() -> service.toggleCard(card.getId(), "user123"))
                .isInstanceOf(CardEmptyException.class)
                .hasMessageContaining("Card is empty.");
    }

    @Test
    void givenCardId_whenToggle_thenReturnToggledValue() {
        Card card = Card.builder()
                .id(anyLong())
                .number("123456")
                .done(false)
                .trips(List.of(Trip.builder()
                        .dayStart("15.12")
                        .counterEnd(150500).build()))
                .fuels(List.of(Fuel.builder()
                        .refuelingDate("15.12.2022")
                        .vehicleCounter(123500)
                        .refuelingAmount(500).build()))
                .build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));
        var result = service.toggleCard(card.getId(), "user123");
        assertTrue(result);
    }

    @Test
    void givenCardId_whenToggle_thenSendNotification() {
        String username = "user123";
        Card card = Card.builder()
                .id(anyLong())
                .done(false)
                .number("123456")
                .done(false)
                .trips(List.of(Trip.builder()
                        .dayStart("15.12")
                        .counterEnd(150500).build()))
                .fuels(List.of(Fuel.builder()
                        .refuelingDate("15.12.2022")
                        .vehicleCounter(123500)
                        .refuelingAmount(500).build()))
                .build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));

        ArgumentCaptor<CardToggledEvent> argumentCaptor = ArgumentCaptor.forClass(CardToggledEvent.class);
        when(kafkaTemplate.send(eq("notificationTopic"), argumentCaptor.capture())).thenReturn(null);

        assertTrue(service.toggleCard(card.getId(), username));
        assertTrue(card.isDone());

        CardToggledEvent event = argumentCaptor.getValue();
        assertEquals("123456", event.getCardNumber());
        assertEquals("Card ready", event.getCardEvent());
    }

    @Test
    void givenCardIdWithEmptyTripList_whenToggle_thenThrow() {
        Card card = Card.builder()
                .id(anyLong())
                .done(false)
                .trips(List.of(Trip.builder()
                        .dayStart("15.12")
                        .counterEnd(150500).build()))
                .fuels(Collections.emptyList())
                .build();
        when(repository.findById(card.getId())).thenReturn(Optional.of(card));
        assertThatThrownBy(() -> service.toggleCard(card.getId(), "user123"))
                .isInstanceOf(CardEmptyException.class)
                .hasMessageContaining("Card is empty.");
    }

    @Test
    void givenCardId_whenFindById_thenDeleteCard() {
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