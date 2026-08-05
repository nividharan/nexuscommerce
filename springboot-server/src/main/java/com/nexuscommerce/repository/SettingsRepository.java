package com.nexuscommerce.repository;

import com.nexuscommerce.model.Settings;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SettingsRepository extends MongoRepository<Settings, String> {
    Optional<Settings> findByUser(String user);
}
