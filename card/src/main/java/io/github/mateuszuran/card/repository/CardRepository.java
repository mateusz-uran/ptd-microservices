package io.github.mateuszuran.card.repository;

import io.github.mateuszuran.card.model.Card;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    boolean existsByNumber(String number);

    Optional<Card> findById(Long id);

    List<Card> findAllByUserIdAndCreationTimeBetween(Long id, LocalDateTime start, LocalDateTime end);
}
