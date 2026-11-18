
package com.restaurant.management.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "restaurant_carts",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_restaurant_cart_user",
                columnNames = "user_id"
        )
)
public class RestaurantCart extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private RestaurantUser user;

    @OneToMany(
            mappedBy = "cart",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RestaurantCartItem> items = new ArrayList<>();

    public void addItem(RestaurantCartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(RestaurantCartItem item) {
        items.remove(item);
        item.setCart(null);
    }
}
