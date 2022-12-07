package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.config.ModelMapperConfig;
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
    private final ModelMapperConfig mapper;

    public void addRefuelling(FuelRequest fuelDto, Long id) {
        var card = service.checkIfCardExists(id);
        var fuel = mapToFuelRequest(fuelDto);
        fuel.setCard(card);
        repository.save(fuel);
    }

    private Fuel mapToFuelRequest(FuelRequest fuelRequest) {
        return mapper.modelMapper().map(fuelRequest, Fuel.class);
    }

    public FuelResponse getSingleFuel(Long id) {
        return repository.findById(id)
                .stream()
                .findFirst()
                .map(this::mapToFuelResponse)
                .orElseThrow(() -> new IllegalArgumentException("Fuel not found"));
    }

    public FuelResponse update(Long id, FuelRequest fuelRequest) {
        return repository.findById(id).map(
                fuel -> {
                    mapper.modelMapper().map(fuelRequest, fuel);
                    return repository.save(fuel);
                }
        ).stream()
                .findFirst()
                .map(this::mapToFuelResponse)
                .orElseThrow(() -> new IllegalArgumentException("Fuel not found"));
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(fuel -> {
                    repository.deleteById(fuel.getId());
                });
    }

    private FuelResponse mapToFuelResponse(Fuel fuel) {
        return mapper.modelMapper().map(fuel, FuelResponse.class);
    }
}
