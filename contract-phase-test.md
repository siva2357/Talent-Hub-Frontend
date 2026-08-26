# [DONE] Contract Phase Testing: Issues & API Test Results

> **Status**: All issues in this phase have been successfully resolved and implemented.

## 1. Overview
This document tracks the issues faced during the Contract Phase testing, along with the API test results.

---

## 2. Issues Encountered & UI Requirements

### 2.1. Create Contract Flow
- **Form UI**: The contract creation is a 3-step process. Needs to use the reusable stepper component.
- **Inputs & Validation**: Requires reusable input fields, dropdowns, form validation errors, and Regexp patterns.
- **Data Lists**: Need predefined dynamic lists for `contract type`, `contract-category`, `contract subject`, and `contract-status`.

### 2.2. Manage Contract Page (Client)
- **UI Components**: Needs a filter card utilizing reusable input fields, buttons, and chips. The main view requires a table and pagination components.
- **Table Columns**: Need to add new columns to display `spent`, `funded`, and `balance` data.

### 2.3. Find Contract Page (Freelancer)
- **UI Components**: Requires newly designed, reusable contract cards. Also needs a filter card with reusable input fields, buttons, and chips.

### 2.4. Contract Details Page (Freelancer)
- **UI Design**: The page needs a complete UI redesign for neat alignment, spacing, and consistent themes.
- **Components**: Incorporate reusable stat cards.

### 2.5. Apply & Withdraw Functionality
- **Backend Logic Issue**: The withdraw functionality must enforce a **24-hour cooling period**. Currently, it fails with a generic "already processed" error or doesn't account for the cooldown correctly. This backend logic needs to be fixed.

### 2.6. Applicants Page (Client)
- **UI Components**: Needs reusable stat cards, a filter card (reusable inputs, buttons, chips), a data table, and pagination.
- **Code Refactor**: Need to create frontend enums for the various application statuses.

### 2.7. Proposal and Offers Page (Freelancer)
- **UI Components**: Redesign the applied contract card to include a reusable timeline component. Add a filter card with reusable input fields and buttons.
- **Code Refactor**: Create status enums for application states.

---

## 3. API Test Results

### 3.1. Create Contract
- **Endpoint**: `POST http://localhost:5000/api/contracts`
- **Status**: 201 Created
- **Payload**:
  ```json
  {
    "contractTitle": "dadada",
    "contractType": "Fixed Price",
    "contractCategory": "Web Development",
    "contractSubject": "Backend",
    "contractDescription": "adadadadadad",
    "contractStartDate": "2026-08-22T00:00:00.000Z",
    "contractEndDate": "2026-08-28T00:00:00.000Z",
    "status": "draft",
    "estimatedBudget": 60000,
    "currency": "INR"
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "message": "Contract created successfully",
      "contract": { /* Contract details */ }
  }
  ```

### 3.2. Get My Contracts (Client)
- **Endpoint**: `GET http://localhost:5000/api/contracts/my-contracts`
- **Status**: 200 OK
- **Response**: Contains `totalContracts` and an array of `contracts`.

### 3.3. Get All Contracts (Freelancer Search)
- **Endpoint**: `GET http://localhost:5000/api/contracts`
- **Status**: 200 OK
- **Response**: Contains `totalContracts` and detailed contract list including client info.

### 3.4. Get Contract Details (Freelancer)
- **Endpoint**: `GET http://localhost:5000/api/contracts/6a8c0691e94390436df0e874`
- **Status**: 200 OK
- **Response**: Full details of the specific contract.

### 3.5. Apply to Contract
- **Endpoint**: `POST http://localhost:5000/api/contracts/apply/6a8c0691e94390436df0e874`
- **Status**: 200 OK
- **Payload**: `{}`
- **Response**: 
  ```json
  {
      "success": true,
      "message": "Applied successfully",
      "application": { /* Application details */ }
  }
  ```

### 3.6. Withdraw Application (Fails - Needs Backend Fix)
- **Endpoint**: `DELETE http://localhost:5000/api/contracts/withdraw/6a8c0691e94390436df0e874`
- **Status**: 400 Bad Request
- **Response**:
  ```json
  {
      "success": false,
      "message": "You cannot withdraw an application that has already been processed."
  }
  ```

### 3.7. Get Contract Applicants (Client)
- **Endpoint**: `GET http://localhost:5000/api/contracts/my-contracts/applicants?contractId=6a8c0691e94390436df0e874`
- **Status**: 200 OK
- **Response**: Contains `totalApplicants` and an array of freelancer applicant details.

### 3.8. Get Applied Contracts / Proposals (Freelancer)
- **Endpoint**: `GET http://localhost:5000/api/contracts/applied-contracts`
- **Status**: 200 OK
- **Response**: Contains `totalApplications` and array of application details along with nested contract data.
