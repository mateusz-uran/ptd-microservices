package io.github.mateuszuran.card.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TripListValues {
    private List<TripValues> tripValuesList;
}
