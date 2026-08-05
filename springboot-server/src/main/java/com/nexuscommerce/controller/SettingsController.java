package com.nexuscommerce.controller;

import com.nexuscommerce.model.Settings;
import com.nexuscommerce.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SettingsRepository settingsRepository;

    @GetMapping
    public ResponseEntity<?> getSettings() {
        Optional<Settings> settingsOpt = settingsRepository.findAll().stream().findFirst();
        Settings settings = settingsOpt.orElseGet(Settings::new);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", settings);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> updateSettings(@RequestBody Settings newSettings) {
        Optional<Settings> settingsOpt = settingsRepository.findAll().stream().findFirst();
        Settings settings = settingsOpt.orElseGet(Settings::new);

        if (newSettings.getDefaultMargin() > 0) settings.setDefaultMargin(newSettings.getDefaultMargin());
        if (newSettings.getDefaultShipping() >= 0) settings.setDefaultShipping(newSettings.getDefaultShipping());
        if (newSettings.getDefaultFee() >= 0) settings.setDefaultFee(newSettings.getDefaultFee());
        if (newSettings.getDefaultCurrency() != null) settings.setDefaultCurrency(newSettings.getDefaultCurrency());
        if (newSettings.getShopifyDomain() != null) settings.setShopifyDomain(newSettings.getShopifyDomain());
        if (newSettings.getShopifyAccessToken() != null) settings.setShopifyAccessToken(newSettings.getShopifyAccessToken());

        Settings saved = settingsRepository.save(settings);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }
}
