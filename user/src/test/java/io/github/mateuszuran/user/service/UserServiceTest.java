package io.github.mateuszuran.user.service;

import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponseDto;
import io.github.mateuszuran.user.mapper.UserMapper;
import io.github.mateuszuran.user.model.User;
import io.github.mateuszuran.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    private UserService service;
    @Mock
    private UserRepository repository;
    @Mock
    private UserMapper mapper;

    @BeforeEach
    void setUp() {
        service = new UserService(repository, mapper);
    }

    @Test
    void addUserToDB() {
        //given
        UserRequestDto userDto = UserRequestDto.builder().firstName("John").lastName("Woo").build();
        User user = User.builder().firstName("John").lastName("Woo").build();
        UserResponseDto userResponseDto = UserResponseDto.builder().firstName("John").lastName("Woo").build();
        when(mapper.mapToUser(userDto)).thenReturn(user);
        when(repository.save(user)).thenReturn(user);
        when(mapper.mapToDto(user)).thenReturn(userResponseDto);
        //when
        var result = service.addUserToDB(userDto);
        //then
        verify(repository, times(1)).save(user);
        assertThat(result.getFirstName()).isEqualTo(userDto.getFirstName());

    }

    @Test
    void getUserByUsernameFromDB() {
        //given
        String username = "john123";
        User user = User.builder().id(99L).firstName("John").lastName("Woo").username("john123").build();
        //when
        when(repository.findByUsername(username)).thenReturn(Optional.of(user));
        var result = service.getUserByUsernameFromDB(username);
        //then
        assertThat(result).isEqualTo(99L);
    }

    @Test
    void getUserInformation() {
        //given
        String username = "john123";
        User user = User.builder().firstName("John").lastName("Woo").username("john123").build();
        UserResponseDto userDto = UserResponseDto.builder().firstName("John").lastName("Woo").username("john123").build();
        //when
        when(repository.findByUsername(username)).thenReturn(Optional.of(user));
        when(mapper.mapToDto(user)).thenReturn(userDto);
        var result = service.getUserInformation(username);
        //then
        assertThat(result.getFirstName()).isEqualTo(user.getFirstName());
    }

    @Test
    void toggleUserLock() {
        //given
        User user = User.builder().id(10L).firstName("John").lastName("Woo").username("john123").active(true).build();
        //when
        when(repository.findById(10L)).thenReturn(Optional.of(user));
        var result = service.toggleUserLock(user.getId());
        //then
        assertThat(result).isFalse();
    }

    @Test
    void editUser() {
        //given
        UserRequestDto userDto = UserRequestDto.builder().firstName("John").lastName("Woo").build();
        User user = User.builder().firstName("John").lastName("Woo").build();
        UserResponseDto updatedUser = UserResponseDto.builder().firstName("Adam").lastName("Woo").build();
        //when
        when(repository.findByUsername(userDto.getUsername())).thenReturn(Optional.of(user));
        when(repository.save(user)).thenReturn(user);
        when(mapper.mapToDto(user)).thenReturn(updatedUser);
        var result = service.updateUser(userDto);
        //then
        assertThat(result.getFirstName()).isEqualTo(updatedUser.getFirstName());
    }
}