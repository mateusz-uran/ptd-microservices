package io.github.mateuszuran.card.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProjectionsResponse {
    private Long id;
    private String username;
    private boolean active;
}
