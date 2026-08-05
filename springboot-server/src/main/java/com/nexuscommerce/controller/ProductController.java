package com.nexuscommerce.controller;

import com.nexuscommerce.model.Product;
import com.nexuscommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getProducts() {
        List<Product> products = productRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", products.size());
        response.put("data", products);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", productOpt.get());
            return ResponseEntity.ok(response);
        }

        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "Product not found");
        return ResponseEntity.status(404).body(error);
    }
}
