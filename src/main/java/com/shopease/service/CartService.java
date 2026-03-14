package com.shopease.service;

import com.shopease.model.CartItem;
import com.shopease.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    public CartItem addToCart(CartItem item) {
        return cartItemRepository.save(item);
    }

    public void removeFromCart(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearCart() {
        cartItemRepository.deleteAll();
    }
}
