package io.github.mateuszuran.card.repository;

import io.github.mateuszuran.card.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    boolean existsByNumber(String number);

    List<Card> findAllByUserId(Long userId);
}
