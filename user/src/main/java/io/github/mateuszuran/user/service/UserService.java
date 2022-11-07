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

    public void addUser(UserRequestDto userDto) {
        if(repository.existsByUsername(userDto.getUsername())) {
            log.info("User {} with given name already exists.", userDto.getUsername());
            throw new IllegalArgumentException("User with given name already exists.");
        } else {
            User user = User.builder()
                    .username(userDto.getUsername())
                    .password(userDto.getPassword())
                    .build();
            repository.save(user);
            log.info("User {} added successfully", user.getUsername());
        }
    }

    public List<UserResponse> getAllUsers() {
        var users = repository.findAll();
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .active(true)
                .build();
    }
}
