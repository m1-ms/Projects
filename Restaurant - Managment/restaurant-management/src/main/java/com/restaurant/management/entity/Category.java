
package com.restaurant.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "category")
public class Category extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "logo", length = 100)
    private String logo;

    @Column(name = "flag", length = 50)
    private String flag;

    @Column(name = "image_path", length = 255)
    private String imagePath;

    @Column(name = "is_popular", nullable = false)
    private boolean popular = false;

    @OneToMany(mappedBy = "category")
    private List<Product> products = new ArrayList<>();
}
