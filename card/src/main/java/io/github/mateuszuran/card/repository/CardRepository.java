package io.github.mateuszuran.card.repository;

import io.github.mateuszuran.card.model.Card;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    boolean existsByNumber(String number);

    Optional<Card> findById(Long id);

    List<Card> findAllByUserId(Long userId);
}
