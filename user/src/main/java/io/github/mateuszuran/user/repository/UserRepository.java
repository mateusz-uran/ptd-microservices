package io.github.mateuszuran.user.repository;

import io.github.mateuszuran.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query("SELECT id AS id, username AS username, active AS active FROM User u WHERE u.username=:username")
    UserProjections findUserInfo(@Param("username") String username);
}
