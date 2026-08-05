package com.nexuscommerce.config;

import com.nexuscommerce.model.Product;
import com.nexuscommerce.model.User;
import com.nexuscommerce.repository.ProductRepository;
import com.nexuscommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("[Spring Boot] Syncing B2B catalog items and admin user to MongoDB Atlas...");

        // 1. Seed Admin User
        if (!userRepository.existsByEmail("admin@nexuscommerce.com")) {
            User admin = new User("admin@nexuscommerce.com", passwordEncoder.encode("Password123"));
            userRepository.save(admin);
            System.out.println("[Spring Boot] Primary Admin user seeded: admin@nexuscommerce.com");
        }

        // 2. Seed 8 B2B Catalog Items
        seedCatalogItem("backpack", "Aegis Minimalist Waterproof Travel Backpack", 
            "The ultimate streamlined companion for urban commuters and daily travelers.", 
            "Apparel > Backpacks & Bags", 1800, "AEGIS-BKPK-GRY");

        seedCatalogItem("chair", "Vortex Mesh Ergonomic Office Chair", 
            "Experience elite ergonomic support during long work hours.", 
            "Furniture > Office Chairs", 3600, "VORTEX-CHAIR-BLK");

        seedCatalogItem("watch", "Aura Pro Smart Health & Active Watch", 
            "A premium wearable device tracking real-time heart rate and SpO2 telemetry.", 
            "Electronics > Wearable Technology", 2900, "AURA-WATCH-PRO");

        seedCatalogItem("desk", "Ascend Dual-Motor Standing Desk Workspace", 
            "Upgrade your productivity with a high-performance standing desk.", 
            "Furniture > Office Desks", 12000, "ASCEND-DESK-OAK");

        seedCatalogItem("headphones", "Hyperion ANC Wireless Studio Headphones", 
            "Immerse yourself in high-fidelity sound with hybrid active noise cancellation.", 
            "Electronics > Audio", 4500, "HYPERION-ANC-BLK");

        seedCatalogItem("ringlight", "Lumina Studio 18\" Bi-Color Ring Light & Stand", 
            "Professional bi-color lighting for live streaming and product photography.", 
            "Electronics > Photography", 2200, "LUMINA-RING-18");

        seedCatalogItem("waterbottle", "ZenHydro 1L Vacuum Insulated Steel Flask", 
            "Keep your beverages icy cold or piping hot all day long.", 
            "Home > Drinkware", 850, "ZENHYDRO-1L-SLT");

        seedCatalogItem("drone", "Titan X 4K HDR Camera Aerial Drone", 
            "Capture breathtaking aerial cinematography with 4K HDR video and 3-axis gimbal.", 
            "Electronics > Drones", 24500, "TITANX-DRONE-4K");

        System.out.println("[Spring Boot] Catalog sync complete (8 items ready).");
    }

    private void seedCatalogItem(String id, String title, String shortDesc, String category, double cost, String sku) {
        Product p = productRepository.findById(id).orElse(new Product());
        p.setId(id);
        p.setTitle(title);
        p.setShortDesc(shortDesc);
        p.setCategory(category);
        p.setCost(cost);
        p.setSku(sku);
        p.setSpecs(List.of(new Product.Spec("Standard", "Commercial Grade Spec")));
        p.setTags(List.of("b2b", "nexuscommerce"));
        productRepository.save(p);
    }
}
