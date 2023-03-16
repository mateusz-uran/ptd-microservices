package io.github.mateuszuran.card.repository;

import io.github.mateuszuran.card.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    boolean existsByNumberAndUserId(String number, Long userId);

    Optional<Card> findById(Long id);

    List<Card> findAllByUserIdAndCreationTimeBetween(Long id, LocalDateTime start, LocalDateTime end);

    @Query("SELECT id AS id, number AS number " +
            "FROM Card c " +
            "WHERE c.userId=:userId " +
            "AND c.creationTime " +
            "BETWEEN :start AND :end")
    List<CardProjections> findCardsInfo(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
