
package com.restaurant.management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
public class PopularCategoryResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String name;
    private final String logo;
    private final String flag;
    private final String imagePath;
    private final Long productCount;
}
