package com.nexuscommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "settings")
public class Settings {
    @Id
    private String id;
    private String user; // UserId reference
    private double defaultMargin = 60.0;
    private double defaultShipping = 500.0;
    private double defaultFee = 2.5;
    private String defaultCurrency = "INR";
    private String shopifyDomain = "";
    private String shopifyAccessToken = "";
    private String activePlan = "Full Access Unlocked";

    public Settings() {}

    public Settings(String user) {
        this.user = user;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public double getDefaultMargin() { return defaultMargin; }
    public void setDefaultMargin(double defaultMargin) { this.defaultMargin = defaultMargin; }

    public double getDefaultShipping() { return defaultShipping; }
    public void setDefaultShipping(double defaultShipping) { this.defaultShipping = defaultShipping; }

    public double getDefaultFee() { return defaultFee; }
    public void setDefaultFee(double defaultFee) { this.defaultFee = defaultFee; }

    public String getDefaultCurrency() { return defaultCurrency; }
    public void setDefaultCurrency(String defaultCurrency) { this.defaultCurrency = defaultCurrency; }

    public String getShopifyDomain() { return shopifyDomain; }
    public void setShopifyDomain(String shopifyDomain) { this.shopifyDomain = shopifyDomain; }

    public String getShopifyAccessToken() { return shopifyAccessToken; }
    public void setShopifyAccessToken(String shopifyAccessToken) { this.shopifyAccessToken = shopifyAccessToken; }

    public String getActivePlan() { return activePlan; }
    public void setActivePlan(String activePlan) { this.activePlan = activePlan; }
}
