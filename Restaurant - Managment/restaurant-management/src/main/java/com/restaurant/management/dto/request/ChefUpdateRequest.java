package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChefUpdateRequest extends ChefRequest {

    @NotNull(message = "{chef.id.required}")
    private Long id;
}