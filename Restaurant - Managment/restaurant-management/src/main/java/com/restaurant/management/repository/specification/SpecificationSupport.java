package com.restaurant.management.repository.specification;

import java.util.Locale;

public final class SpecificationSupport {

    public static final char LIKE_ESCAPE = '\\';

    private SpecificationSupport() {
    }

    public static String containsPattern(String value) {
        String escaped = value.toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return "%" + escaped + "%";
    }
}