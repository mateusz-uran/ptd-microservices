package io.github.mateuszuran.repository;

import io.github.mateuszuran.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByUserId(Long id);
}
