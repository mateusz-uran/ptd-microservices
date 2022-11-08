package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.FuelRequest;
import io.github.mateuszuran.card.model.Fuel;
import io.github.mateuszuran.card.repository.FuelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FuelService {
    private final FuelRepository repository;
    private final CardService service;

    public void addRefuelling(FuelRequest fuelDto, Long id) {
        var card = service.checkIfCardExists(id);
        Fuel fuel = Fuel.builder()
                .refuelingDate(fuelDto.getCurrentDate())
                .refuelingLocation(fuelDto.getRefuelingLocation())
                .vehicleCounter(fuelDto.getVehicleCounter())
                .refuelingAmount(fuelDto.getRefuelingAmount())
                .card(card)
                .build();
        repository.save(fuel);
    }
}
