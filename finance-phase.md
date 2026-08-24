# Finance Phase Testing: Issues & API Test Results

## 1. Overview
This document tracks the issues faced during the Finance Phase testing, along with the API test results.

---

## 2. Issues Encountered & UI Requirements

### 2.1. Financial Summary Page (Client Page)
- **UI Components**: The page needs to be built using reusable tables, buttons, and stat cards.
- **Data Accuracy Issue**: The client page displays wrong data related to the budget. The underlying calculations are incorrect and need to be fixed in the backend logic.

### 2.2. Finance Overview Page (Freelancer Page)
- **UI Components**: Use reusable stat cards, tables, and action buttons.
- **State Management Issue**: Contract status is not being updated properly in the finance overview.
- **Financial Calculation Issues (Critical)**: 
  - Wrong financial data and platform fee calculations are being displayed.
  - The calculation workflow for the budget amount needs to be rewritten.
  - **Business Logic Fix**: Platform fees *must* be deducted *before* the freelancer can apply for a withdrawal request.

### 2.3. Financial Management Page (Admin Page)
- **UI Components**: Needs reusable tables, stat cards, and a filter card complete with input fields, buttons, and chips.
- **Data Accuracy Issue**: The wrong contract status is being sent/displayed. The backend needs to be checked thoroughly and the status updates must be written and structured correctly.

---

## 3. API Test Results

### 3.1. Get Invoices (Client)
- **Endpoint**: `GET http://localhost:5000/api/finance/invoices`
- **Status**: 200 OK
- **Response**: Array of invoices (e.g., `Escrow Funded`, `Payment Released`).
  - *Note*: Includes details like platform fee and reference IDs.

### 3.2. Get Financial Stats (Client)
- **Endpoint**: `GET http://localhost:5000/api/finance/stats`
- **Status**: 200 OK
- **Response**:
  ```json
  {
      "success": true,
      "stats": {
          "totalBalance": 0,
          "totalSpent": 16500,
          "upcomingPayments": 49500.0,
          "platformFeesPaid": 1500
      }
  }
  ```

### 3.3. Get Transactions (Client)
- **Endpoint**: `GET http://localhost:5000/api/finance/transactions`
- **Status**: 200 OK
- **Response**: Array of detailed transactions similar to invoices.

### 3.4. Freelancer Finance Report (Freelancer)
- **Endpoint**: `GET http://localhost:5000/api/finance/freelancer-report`
- **Status**: 200 OK
- **Response**:
  ```json
  {
      "success": true,
      "report": [
          {
              "contractId": "6a8c0691e94390436df0e874",
              "title": "dadada",
              "budget": 60000,
              "earned": 60000,
              "balance": 60000,
              "grossWithdrawnAmount": 0,
              "netWithdrawnAmount": 0,
              "platformFeesDeducted": 0,
              "phases": [ /* List of paid phases */ ]
          }
      ]
  }
  ```

### 3.5. Admin Financial Transactions (Admin)
- **Endpoint**: `GET http://localhost:5000/api/admin/finances/transactions`
- **Status**: 200 OK
- **Response**:
  ```json
  [
      {
          "freelancerPayment": 55500,
          "amount": 60000,
          "platformFee": 4500,
          "status": "Pending",
          "type": "Payout"
      }
  ]
  ```

### 3.6. Admin Financial Stats (Admin)
- **Endpoint**: `GET http://localhost:5000/api/admin/finances/stats`
- **Status**: 200 OK
- **Response**:
  ```json
  {
      "platformCommissions": 4500,
      "pendingWithdrawals": 60000,
      "successfulPayouts": 0,
      "growthPercent": 18.5
  }
  ```
