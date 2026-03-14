package com.shopease.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    private String address;
    private double totalAmount;
    private String status;
    private LocalDateTime orderDate;

    @PrePersist
    public void prePersist() {
        orderDate = LocalDateTime.now();
        status = "PLACED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String n) { this.customerName = n; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String e) { this.customerEmail = e; }

    public String getAddress() { return address; }
    public void setAddress(String a) { this.address = a; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double t) { this.totalAmount = t; }

    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime d) { this.orderDate = d; }
}
