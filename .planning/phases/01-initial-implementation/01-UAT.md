---
status: testing
phase: 01-initial-implementation
source: [01-SUMMARY.md]
started: 2026-04-20T14:30:00Z
updated: 2026-04-20T14:30:00Z
---

## Current Test
number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state. Start the application from scratch. Server boots without errors, database migrations complete, and basic API call returns data.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state. Start the application from scratch. Server boots without errors, database migrations complete, and basic API call returns data.
result: [pending]

### 2. User Registration
expected: POST /auth/register with email and password creates a new user and returns 201.
result: [pending]

### 3. User Login
expected: POST /auth/login with valid credentials returns a JWT token containing userId and role.
result: [pending]

### 4. Property Creation (USER)
expected: POST /properties as a USER creates a property with status 'PENDING'.
result: [pending]

### 5. Property Creation (ADMIN)
expected: POST /properties as an ADMIN creates a property with status 'APPROVED'.
result: [pending]

### 6. Public Property List
expected: GET /properties returns only properties with status 'APPROVED' and that have not expired.
result: [pending]

### 7. Nearby Property Search
expected: GET /properties/nearby with lat, lng, and radius returns properties within the specified distance using PostGIS.
result: [pending]

### 8. Property Ownership Check
expected: PUT or DELETE /properties/:id returns 403 or 401 if a non-admin user tries to modify someone else's property.
result: [pending]

### 9. Admin Property Approval
expected: PUT /properties/:id/approve as an ADMIN changes status from 'PENDING' to 'APPROVED'.
result: [pending]

### 10. Admin Property Rejection
expected: PUT /properties/:id/reject as an ADMIN changes status to 'REJECTED' and stores 'rejectReason'.
result: [pending]

## Summary

total: 10
passed: 0
issues: 0
pending: 10
skipped: 0

## Gaps

[none yet]
