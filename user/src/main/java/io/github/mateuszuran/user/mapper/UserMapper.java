package io.github.mateuszuran.user.mapper;

import io.github.mateuszuran.user.config.ModelMapperConfig;
import io.github.mateuszuran.user.dto.UserRequestDto;
import io.github.mateuszuran.user.dto.UserResponseDto;
import io.github.mateuszuran.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserMapper {
    private final ModelMapperConfig mapper;

    public UserResponseDto mapToDto(User user) {
        return mapper.modelMapper().map(user, UserResponseDto.class);
    }

    public User mapToUser(UserRequestDto userDto) {
        return mapper.modelMapper().map(userDto, User.class);
    }

    public void mapToUpdate(UserRequestDto userRequestDto, User user) {
        mapper.modelMapper().map(userRequestDto, user);
    }
}
