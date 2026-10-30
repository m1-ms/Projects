package com.restaurant.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfoRequest {

    private static final String EMAIL_REGEX = "^$|^(?=.{1,150}$)[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$";

    @NotBlank(message = "{contact.name.required}")
    @Size(max = 100, message = "{contact.name.size}")
    private String name;

    @NotBlank(message = "{contact.email.required}")
    @Pattern(regexp = EMAIL_REGEX, message = "{contact.email.invalid}")
    private String email;

    @NotBlank(message = "{contact.subject.required}")
    @Size(max = 200, message = "{contact.subject.size}")
    private String subject;

    @NotBlank(message = "{contact.message.required}")
    @Size(max = 1000, message = "{contact.message.size}")
    private String message;
}