package com.example.crm.controller;

import com.example.crm.model.Customer;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.security.TenantContext;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // 1. List only records belonging to the current tenant's context
    @GetMapping
    public List<Customer> getAllCustomers() {
        String tenantId = TenantContext.getTenantId();
        return customerRepository.findByTenantId(tenantId);
    }

    // 2. Get single record (strictly bounded by tenantId)
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        String tenantId = TenantContext.getTenantId();
        return customerRepository.findByIdAndTenantId(id, tenantId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Create a record (automatically stamp with the current tenantId from JWT)
    @PostMapping
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        String tenantId = TenantContext.getTenantId();
        customer.setTenantId(tenantId); // Enforce tenant isolation on write
        customer.setId(null); // Ensure a new record is created
        return customerRepository.save(customer);
    }

    // 4. Update a record (ensuring it belongs to the tenant)
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customerDetails) {
        String tenantId = TenantContext.getTenantId();
        return customerRepository.findByIdAndTenantId(id, tenantId)
                .map(existingCustomer -> {
                    existingCustomer.setName(customerDetails.getName());
                    existingCustomer.setEmail(customerDetails.getEmail());
                    existingCustomer.setPhone(customerDetails.getPhone());
                    existingCustomer.setCompany(customerDetails.getCompany());
                    return ResponseEntity.ok(customerRepository.save(existingCustomer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Role-gated delete endpoint (Only ADMIN role can delete records within their tenant)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        String tenantId = TenantContext.getTenantId();
        return customerRepository.findByIdAndTenantId(id, tenantId)
                .map(customer -> {
                    customerRepository.delete(customer);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}