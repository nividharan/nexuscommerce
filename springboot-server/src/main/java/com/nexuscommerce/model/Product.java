package com.nexuscommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "products")
public class Product {
    @Id
    private String mongoId;
    private String id;
    private String title;
    private String shortDesc;
    private String category;
    private double cost;
    private List<Spec> specs;
    private List<String> tags;
    private String sku;
    private String rawNotes;
    private String rawImg;
    private String studioImg;

    public static class Spec {
        private String label;
        private String value;

        public Spec() {}
        public Spec(String label, String value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    public Product() {}

    public Product(String id, String title, String shortDesc, String category, double cost, List<Spec> specs, List<String> tags, String sku, String rawImg, String studioImg) {
        this.id = id;
        this.title = title;
        this.shortDesc = shortDesc;
        this.category = category;
        this.cost = cost;
        this.specs = specs;
        this.tags = tags;
        this.sku = sku;
        this.rawImg = rawImg;
        this.studioImg = studioImg;
    }

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getShortDesc() { return shortDesc; }
    public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }

    public List<Spec> getSpecs() { return specs; }
    public void setSpecs(List<Spec> specs) { this.specs = specs; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getRawNotes() { return rawNotes; }
    public void setRawNotes(String rawNotes) { this.rawNotes = rawNotes; }

    public String getRawImg() { return rawImg; }
    public void setRawImg(String rawImg) { this.rawImg = rawImg; }

    public String getStudioImg() { return studioImg; }
    public void setStudioImg(String studioImg) { this.studioImg = studioImg; }
}
