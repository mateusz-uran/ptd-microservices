package io.github.mateuszuran.user.service;

import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponse;
import io.github.mateuszuran.user.model.User;
import io.github.mateuszuran.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public void addUserToDB(UserRequestDto userDto) {
        if(repository.existsByUsername(userDto.getUsername())) {
            log.info("User {} with given name already exists.", userDto.getUsername());
            throw new IllegalArgumentException("User with given name already exists.");
        } else if (userDto.getUsername() == null && userDto.getPassword() == null) {
            log.info("User or password is empty.");
            throw new IllegalArgumentException("User or password is empty.");
        } else {
            User user = User.builder()
                    .username(userDto.getUsername())
                    .password(userDto.getPassword())
                    .active(true)
                    .build();
            repository.save(user);
            log.info("User {} added successfully", user.getUsername());
        }
    }

    public UserResponse getUserByIdFromDB(String username) {
        var user = repository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .active(user.isActive())
                .build();
    }

    public List<UserResponse> getAllUsersFromDB() {
        var users = repository.findAll();
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .active(user.isActive())
                .build();
    }
}
