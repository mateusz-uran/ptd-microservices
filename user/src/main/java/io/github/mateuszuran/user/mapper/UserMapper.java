package io.github.mateuszuran.user.mapper;

import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponseDto;
import io.github.mateuszuran.user.model.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserMapper {
    private ModelMapper mapper;

    public UserResponseDto mapToDto(User user) {
        return mapper.map(user, UserResponseDto.class);
    }

    public User mapToUser(UserRequestDto userDto) {
        return mapper.map(userDto, User.class);
    }

    public void mapToUpdate(UserRequestDto userRequestDto, User user) {
        mapper.map(userRequestDto, user);
    }
}
