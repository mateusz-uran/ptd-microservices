package io.github.mateuszuran.repository;

import io.github.mateuszuran.model.VehicleImage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VehicleImageRepository extends MongoRepository<VehicleImage, String> {
}
