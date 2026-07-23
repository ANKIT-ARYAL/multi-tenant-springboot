# Multi-Tenant CRM Platform

A multi-tenant CRM backend (Spring Boot) and frontend (Next.js) supporting absolute tenant data isolation and role-based security.

## 1. Tenancy Model Justification
We chose **Shared database, shared schema with a `tenant_id` column (row-level isolation)**.
- **Why:** It offers optimal resource utilization and easy maintenance compared to database-per-tenant, while avoiding connection pooling explosion or complex schema-switching runtime overhead.
- **Enforcement:** Tenant scoping is centrally enforced. Every incoming request passes through a JWT filter that extracts the `tenant_id` into a thread-local `TenantContext`, which is automatically applied to repository queries.

## 2. Running Locally via Docker
Ensure Docker is running, then run a single command from the project root:
```bash
docker compose up --build
Frontend Dashboard: http://localhost:3000

Backend API: http://localhost:4200

3. Production Readiness Considerations
Before promoting this service to production, the following updates are required:

Migrations: Integrate Flyway or Liquibase for robust schema version control instead of relying on Hibernate auto-DDL (update).

Secrets Management: Externalize database credentials and JWT signing keys using secure vaults (e.g., AWS Secrets Manager, HashiCorp Vault) rather than environment variables or hardcoded values.

Database Indexing: Ensure composite indexes are added on (tenant_id, id) and foreign key lookups to optimize query latency under high tenancy loads.

Audit Logging & Tracing: Implement structured JSON logging with distributed tracing (e.g., OpenTelemetry) to track cross-tenant boundaries and administrative delete actions for compliance.