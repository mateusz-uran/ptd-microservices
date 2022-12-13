package io.github.mateuszuran.card.mapper;

import io.github.mateuszuran.card.config.ModelMapperConfig;
import io.github.mateuszuran.card.dto.response.CardResponse;
import io.github.mateuszuran.card.model.Card;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CardMapper {
    private final ModelMapperConfig mapper;

    public CardResponse mapToCardResponseWithModelMapper(Card card) {
        return mapper.modelMapper().map(card, CardResponse.class);
    }
}
