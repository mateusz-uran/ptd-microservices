package io.github.mateuszuran.user.controller;

import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponseDto;
import io.github.mateuszuran.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping
    public ResponseEntity<UserResponseDto> addUser(@RequestBody UserRequestDto userDto) {
        return ResponseEntity.ok().body(
                service.addUserToDB(userDto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        log.info("Exposing all users");
        return ResponseEntity.ok().body(service.getAllUsersFromDB());
    }

    @GetMapping
    public ResponseEntity<UserResponseDto> getSingleUser(@RequestParam String username) {
        return ResponseEntity.ok().body(service.getUserByUsernameFromDB(username));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDto> getUserInformation(@PathVariable String username) {
        return ResponseEntity.ok().body(service.getUserInformation(username));
    }
}
