package io.github.mateuszuran.user.service;

import io.github.mateuszuran.user.dto.UserInfoDto;
import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponseDto;
import io.github.mateuszuran.user.mapper.UserMapper;
import io.github.mateuszuran.user.model.User;
import io.github.mateuszuran.user.repository.UserProjections;
import io.github.mateuszuran.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final UserMapper mapper;

    public UserResponseDto addUserToDB(UserRequestDto userDto) {
        var user = mapper.mapToUser(userDto);
        repository.save(user);
        return mapper.mapToDto(user);
    }

    public Long getUserByUsernameFromDB(String username) {
        var user = repository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return user.getId();
    }

    public UserProjections getUserInfo(String username) {
        return repository.findUserInfo(username);
    }

    public UserResponseDto getUserInformation(String username) {
        var user = repository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return mapper.mapToDto(user);
    }

    public List<String> getAllUsersUsername() {
        return repository.getUsernameList();
    }

    public List<UserInfoDto> getUsernamesAndNames() {
        var userList = repository.findAll();
        List<UserInfoDto> userInfoDtoList = new ArrayList<>();
        for (User user : userList) {
            userInfoDtoList.add(UserInfoDto.builder()
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName()).build());
        }
        return userInfoDtoList;
    }

    public boolean toggleUserLock(Long userId) {
        var user = repository.findById(userId).orElseThrow();
        user.setActive(!user.isActive());
        repository.save(user);
        return user.isActive();
    }

    public UserResponseDto updateUser(UserRequestDto userDto) {
        var result = repository.findByUsername(userDto.getUsername()).orElseThrow();
        mapper.mapToUpdate(userDto, result);
        repository.save(result);
        return mapper.mapToDto(result);
    }
}
