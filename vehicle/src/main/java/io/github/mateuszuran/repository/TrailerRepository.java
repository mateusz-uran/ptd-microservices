package io.github.mateuszuran.repository;

import io.github.mateuszuran.model.Trailer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrailerRepository extends MongoRepository<Trailer, String> {
}
