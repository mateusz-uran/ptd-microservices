package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.dto.request.FuelRequest;
import io.github.mateuszuran.card.dto.response.FuelResponse;
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

    public void updateFuel(Long id, FuelRequest fuelDto) {
        repository.findById(id)
                .map(fuel -> {
                    if(fuelDto.getCurrentDate() != null) {
                        fuel.setRefuelingDate(fuel.getRefuelingDate());
                    } else if (fuelDto.getRefuelingLocation() != null) {
                        fuel.setRefuelingLocation(fuelDto.getRefuelingLocation());
                    } else if (fuelDto.getVehicleCounter() != null) {
                        fuel.setVehicleCounter(fuelDto.getVehicleCounter());
                    } else if (fuelDto.getRefuelingAmount() != null) {
                        fuel.setRefuelingAmount(fuelDto.getRefuelingAmount());
                    }
                    return repository.save(fuel);
                }).orElseThrow(() -> new IllegalArgumentException("Fuel not found"));
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(fuel -> {
                    repository.deleteById(fuel.getId());
                });
    }
}
