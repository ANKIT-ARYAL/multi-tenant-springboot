package com.example.crm.repository;

import com.example.crm.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Always enforce finding by both id AND tenantId to prevent cross-tenant enumeration leaks
    List<Customer> findByTenantId(String tenantId);

    Optional<Customer> findByIdAndTenantId(Long id, String tenantId);

    void deleteByIdAndTenantId(Long id, String tenantId);
}