package io.github.mateuszuran.card.repository;

import io.github.mateuszuran.card.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
