package com.restaurant.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "chef")
public class Chef extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "specialization", nullable = false, length = 100)
    private String specialization;

    @Column(name = "logo_path", length = 255)
    private String logoPath;

    @Column(name = "facebook_link", length = 255)
    private String facebookLink;

    @Column(name = "twitter_link", length = 255)
    private String twitterLink;

    @Column(name = "instagram_link", length = 255)
    private String instagramLink;
}