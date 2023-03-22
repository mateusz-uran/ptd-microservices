package io.github.mateuszuran.card.service;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.request.FuelRequest;
import io.github.mateuszuran.card.dto.response.FuelResponse;
import io.github.mateuszuran.card.mapper.FuelMapper;
import io.github.mateuszuran.card.repository.FuelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FuelService {
    private final FuelRepository repository;
    private final CardService service;
    private final ModelMapperConfig mapper;
    private final FuelMapper fuelMapper;

    public void addRefuelling(FuelRequest fuelDto, Long id) {
        var card = service.checkIfCardExists(id);
        var fuel = fuelMapper.mapToFuelRequest(fuelDto);
        fuel.setCard(card);
        repository.save(fuel);
    }

    public void delete(Long id) {
        repository.findById(id)
                .ifPresent(fuel -> {
                    repository.deleteById(fuel.getId());
                });
    }
}
