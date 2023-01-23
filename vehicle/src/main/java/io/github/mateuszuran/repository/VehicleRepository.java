package io.github.mateuszuran.repository;

import io.github.mateuszuran.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    Optional<Vehicle> findByUserId(Long id);
}
