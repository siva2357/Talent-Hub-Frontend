# Auth Phase Testing: Issues & API Test Results

## 1. Auth Flow Issues & API Test Results

### 1.0. Role Handling
- **Invalid User Role Handling**: If there is no valid user role, the app must redirect back to the login page. Need to check `AuthGuard`, `RoleGuard`, the routes file, and ensure local storage is cleared appropriately.

### 2.1. Signup Page
- **UI Update**: Use the reusable button component.

### 2.2. Register Page
- **UI Updates**: Use the reusable button and input fields with icons.
- **Functionality**: Write function for password hide and unhide.
- **Validation**: Add validation errors and Regexp for validation.
- **API Results**:
  - **Endpoint**: `POST http://localhost:5000/api/auth/register`
  - **Status**: 201 Created
  - **Payload**:
    ```json
    {
      "fullName": "Siva Prasad",
      "email": "sivakurra.ksp2357@gmail.com",
      "password": "Siva@2357",
      "role": "client"
    }
    ```
  - **Response**:
    ```json
    {
        "success": true,
        "message": "Registration successful. Please verify the OTP sent to your email.",
        "email": "sivakurra.ksp2357@gmail.com"
    }
    ```

### 2.3. OTP Verification Page
- **Functionality**: Needs to have a "reset OTP" option that appears after 45 seconds.
- **API Results**:
  - **Endpoint**: `POST http://localhost:5000/api/auth/verify-otp`
  - **Status**: 200 OK
  - **Payload**:
    ```json
    {
      "email": "sivakurra.ksp2357@gmail.com",
      "otp": "214837"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "your account is created and verified"
    }
    ```

### 2.4. Login Page
- **UI Updates**: Needs to have reusable buttons and icon-based input fields.
- **Functionality**: Password hide and unhide.
- **Validation**: Add validation errors and Regexp for validation.
- **API Results**:
  - **Endpoint**: `POST http://localhost:5000/api/auth/login`
  - **Status**: 200 OK
  - **Payload**:
    ```json
    {
      "email": "sivakurra.ksp2357@gmail.com",
      "password": "Siva@2357"
    }
    ```
  - **Response**:
    ```json
    {
        "success": true,
        "token": "eyJhbGciOiJIUzI1NiIsIn...",
        "role": "client",
        "profileCompleted": false
    }
    ```

---

## 3. Profile & Account Settings Issues & API Test Results

### 3.1. Profile Form (Complete Profile)
- **UI Updates**: Needs reusable file upload, file preview, reusable input fields with icon buttons, profile stepper, and dropdown lists.
- **Functionality**: 
  - Dynamic dropdown list for industry.
  - Company type to be a dropdown with real-time values from the backend.
  - Dependent relationship for City -> State -> Country.
  - Unique phone number validation.
  - Website to have proper URL validations.
  - Social media profiles to have URL validation matching the platform, and use correct logos for the platform list.
- **Validation**: The complete profile form needs validation errors for all input fields and Regexp patterns.
- **API Results**:
  - **Endpoint**: `POST http://localhost:5000/api/profile/complete`
  - **Status**: 200 OK
  - **Payload**:
    ```json
    {
      "basicInformation": {
        "profilePhoto": "https://storage.googleapis.com/...-logo.png",
        "fullName": "Siva Prasad",
        "email": "sivakurra.ksp2357@gmail.com",
        "phoneNumber": "9876543210",
        "gender": "Male",
        "shortBio": "vscscscscscscscscscscsc"
      },
      "professionalDetails": {
        "companyType": "edewdwdw",
        "website": "https://www.linkedin.com/feed/",
        "industry": "efrfwf",
        "companyDescription": "wedwedwdw"
      },
      "location": {
        "country": "ewewewe",
        "state": "wewewew",
        "city": "wwww",
        "timezone": ""
      },
      "socialLinks": [
        {
          "platform": "LinkedIn",
          "profileUrl": "https://www.linkedin.com/feed/"
        }
      ],
      "languages": [
        {
          "language": "English",
          "proficiency": "Fluent"
        }
      ]
    }
    ```
  - **Response**:
    ```json
    {
        "success": true,
        "message": "your profile is completed and verified",
        "profile": { /* Profile details omitted for brevity */ }
    }
    ```

### 3.2. Forgot Password Page
- **UI Updates**: Needs to have reusable button and input field with icons.
- **Validation**: Validation error and Regexp pattern required.
- **API Results**:
  - **Endpoint**: `POST http://localhost:5000/api/auth/forgot-password`
  - **Status**: 200 OK
  - **Payload**: `{"email": "sivakurra.ksp2357@gmail.com"}`
  - **Response**:
    ```json
    {
        "success": true,
        "message": "Password reset OTP sent to your email",
        "email": "sivakurra.ksp2357@gmail.com"
    }
    ```

### 3.3. Reset Password Page
- **UI Updates**: Needs to have reusable input fields with icons and buttons.
- **API Results**:
  - **Endpoint**: `POST http://localhost:5000/api/auth/reset-password`
  - **Status**: 200 OK
  - **Payload**: `{"email":"sivakurra.ksp2357@gmail.com","otp":"812397","newPassword":"Siva@2767"}`
  - **Response**:
    ```json
    {
        "success": true,
        "message": "Password reset successfully. You can now login with your new password."
    }
    ```

### 3.4. Account Settings Page
- **UI Updates**: All tabs need to have validation errors, Regexp patterns, reusable input fields (with/without icons), buttons, and list dropdowns.
- **Functionality**: 
  - Fix the issues of adding new social profile and language to be FormArray correctly. They need to be new empty form fields rather than prefilled forms.
  - Add real-time dynamic list items for languages and social media profiles.
  - Remove the notifications tab completely (not needed).
- **API Results**:
  - **Endpoint**: `PUT http://localhost:5000/api/profile/update`
  - **Status**: 200 OK
  - **Payload**:
    ```json
    { /* Similar to profile complete payload */ }
    ```
  - **Response**:
    ```json
    {
        "success": true,
        "message": "Profile updated successfully",
        "profile": { /* Updated profile object */ }
    }
    ```

### 3.5. Change Password Tab (Account Settings)
- **Status**: Functionality not implemented.
- **Requirements**: Need to use reusable input fields with icons and add validation errors, Regexp pattern.

### 3.6. Manage Account Tab (Account Settings)
- **Status**: Delete account functionality not implemented at all.
- **Requirements**: Need to fix it and add a confirmation modal dialogue before deletion.

---

## 4. Proposed Solutions & Action Plan

### 4.1. Routing & Security Fixes
- **Role Handling**: Update `AuthGuard` and `RoleGuard` logic to explicitly check for a valid role token. If missing or invalid, trigger `localStorage.clear()` and redirect to the `/login` route.

### 4.2. UI Components & UX
- **Reusable Form Elements**: Abstract the input fields and buttons into shared Angular components. Ensure the password inputs include a toggle function to change the input `type` between `text` and `password`.
- **Form Validation**: Implement robust RegExp patterns (Emails, Strong Passwords, Phone Numbers, valid URLs) in Angular Reactive Forms. Display standardized error messages below inputs when they are invalid and touched.

### 4.3. Profile Form Enhancements
- **Dynamic Dropdowns & Dependencies**: Implement dependent dropdown logic for Country -> State -> City. Fetch industry and company type lists dynamically from backend APIs.
- **FormArrays**: Refactor the `socialLinks` and `languages` FormArrays to ensure that clicking "Add" pushes a clean, empty `FormGroup` rather than a pre-filled one.

### 4.4. Account Settings Features
- **Clean Up**: Remove the Notifications tab completely from the UI and routing.
- **Change Password**: Build the UI using reusable components, apply validation, and wire it to the backend `change-password` endpoint.
- **Delete Account**: Create a reusable `ConfirmationModalComponent`. When deleting an account, trigger the modal, and upon confirmation, make the DELETE API call, clear local storage, and redirect to the home page.
