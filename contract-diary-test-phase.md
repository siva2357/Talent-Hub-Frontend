# Contract Diary Test Phase: Issues & API Test Results

## 1. Overview
This document tracks the issues faced during the Contract Diary Phase testing, along with the API test results.

---

## 2. Issues Encountered & UI Requirements

### 2.1. Contract Progress Page (Client Page)
- **Funding Workflow**: The page needs to show a placeholder UI message instructing the client: *"Please fund the contract before creating phases."* The main UI screens for creating/managing phases should only be visible *after* the client has paid the funds.

### 2.2. Create Phase Page (Client Page)
- **Financial Data Integration**: Add real-time financial data (spent, funded, balance) from the backend to the UI.
- **Form UI Redesign**: Completely redesign the page. Use `FormArray` for dynamic inputs like Acceptance Criteria and Deliverables.
- **Components**: Fix the whole page UI. Implement reusable **file upload** and **file preview** components for client attachments (requirements).

### 2.3. Contract Diary Page (Freelancer Page)
- **UI Redesign**: Needs a complete UI overhaul to look attractive and meet modern UX standards.

### 2.4. Phase Details Page (Freelancer & Client)
- **Status Enums**: We need to clearly display and track statuses for individual phases.
- **Freelancer UI**: Completely redesign the UI. Integrate reusable file upload and file preview components for submitting work. Add a **reusable timeline** component to visually track phase progress.
- **Client UI**: Completely fix the UI. Utilize the timeline component, reusable buttons, and file preview components for reviewing submissions.

---

## 3. API Test Results

### 3.1. Get Contract Diary (Client)
- **Endpoint**: `GET http://localhost:5000/api/contract-diary/contract/6a8c0691e94390436df0e874`
- **Status**: 200 OK
- **Response**: Contains contract details (budget, spent, funded) and diary details (overallStatus: `not-started`, empty phases array).

### 3.2. Add/Create Phase (Client)
- **Endpoint**: `POST http://localhost:5000/api/contract-diary/6a8c0fc8e94390436df0e9cb/phases`
- **Status**: 200 OK
- **Payload**:
  ```json
  {
    "name": "aadadadada",
    "description": "Phase details setup by client",
    "amount": 15000,
    "deadline": "2026-08-29",
    "deliverables": ["sfsdsefs", "sfsfsfs", "sfsfsf"],
    "acceptanceCriteria": ["fwwrw", "wrwrwrw", "rwrwrw"]
  }
  ```
- **Response**: 
  ```json
  {
      "success": true,
      "message": "Phase added and funded successfully",
      "phases": [ { /* New Phase Object with status 'pending' */ } ]
  }
  ```

### 3.3. Get My Contract Diary (Freelancer)
- **Endpoint**: `GET http://localhost:5000/api/contract-diary/my-diary/6a8c0691e94390436df0e874`
- **Status**: 200 OK
- **Response**: Contains contract details and diary object with `overallStatus: "in-progress"` and populated phases.

### 3.4. Start Phase (Freelancer)
- **Endpoint**: `PUT http://localhost:5000/api/contract-diary/6a8c0fc8e94390436df0e9cb/phases/6a8c10ede94390436df0e9fa/start`
- **Status**: 200 OK
- **Response**: 
  ```json
  {
      "success": true,
      "message": "Phase started",
      "phase": {
          "status": "in-progress"
          /* Other phase details */
      }
  }
  ```

### 3.5. Submit Phase Work (Freelancer)
- **Endpoint**: `PUT http://localhost:5000/api/contract-diary/6a8c0fc8e94390436df0e9cb/phases/6a8c10ede94390436df0e9fa/submit`
- **Status**: 200 OK
- **Response**:
  ```json
  {
      "success": true,
      "message": "Phase update submitted successfully",
      "phase": {
          "status": "submitted",
          "revisionCount": 1,
          "revisions": [
              {
                  "freelancerNote": "sfsfsfsfsf",
                  "attachments": [ /* Uploaded Files */ ],
                  "status": "submitted"
              }
          ]
      }
  }
  ```
