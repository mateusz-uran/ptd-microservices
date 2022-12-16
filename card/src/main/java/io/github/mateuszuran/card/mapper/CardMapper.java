package io.github.mateuszuran.card.mapper;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.response.CardResponse;
import io.github.mateuszuran.card.model.Card;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@RequiredArgsConstructor
@Component
public class CardMapper {
    private final ModelMapperConfig mapper;

    public CardResponse mapToCardResponseWithModelMapper(Card card) {
        return mapper.modelMapper().map(card, CardResponse.class);
    }

    public CardResponse mapToCardResponseWithFormattedCreationTime(Card card) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = card.getCreationTime().format(formatter);
        CardResponse response = mapper.modelMapper().map(card, CardResponse.class);
        response.setCreationTime(formattedTime);
        return response;
    }
}
