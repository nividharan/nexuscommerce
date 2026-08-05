package com.nexuscommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final List<Map<String, Object>> cartQueue = new ArrayList<>();

    @GetMapping
    public ResponseEntity<?> getCart() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", cartQueue);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> item) {
        cartQueue.add(item);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", cartQueue);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable String id) {
        cartQueue.removeIf(item -> id.equals(item.get("id")));
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", cartQueue);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/export-shopify")
    public ResponseEntity<?> exportToShopify(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("liveExported", false);
        response.put("message", "1-Click Shopify Exporter Active (Spring Boot Backend)! Add your Shopify Store credentials in Settings to publish directly.");

        Map<String, String> payload = new HashMap<>();
        payload.put("endpoint", "POST /admin/api/2024-01/products.json");
        payload.put("status", "active");
        response.put("samplePayload", payload);

        return ResponseEntity.ok(response);
    }
}
