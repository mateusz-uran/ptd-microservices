package io.github.mateuszuran.user.service;

import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponseDto;
import io.github.mateuszuran.user.model.User;
import io.github.mateuszuran.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public UserResponseDto addUserToDB(UserRequestDto userDto) {
        User user = User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .active(true)
                .build();
        repository.save(user);
        return mapToUserResponse(user);
    }

    public Long getUserByUsernameFromDB(String username) {
        var user = repository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return user.getId();
    }

    public UserResponseDto getUserInformation(String username) {
        var user = repository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return mapToUserResponse(user);
    }

    public List<String> getAllUsersUsername() {
        return repository.getUsernameList();
    }

    public boolean toggleUserLock(Long userId) {
        var user = repository.findById(userId).orElseThrow();
        user.setActive(!user.isActive());
        repository.save(user);
        return user.isActive();
    }

    private UserResponseDto mapToUserResponse(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .active(user.isActive())
                .build();
    }
}
