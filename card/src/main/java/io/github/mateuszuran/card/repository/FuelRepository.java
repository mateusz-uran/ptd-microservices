package io.github.mateuszuran.card.repository;

import io.github.mateuszuran.card.model.Fuel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuelRepository extends JpaRepository<Fuel, Long> {
}
