# Frontend Development Standards

## Technology Stack

- Framework: Angular 20
- Language: TypeScript
- Styling Framework: Bootstrap 5
- Architecture Pattern: Standalone Component Architecture
- State Management: Angular Signals + RxJS
- API Communication: Angular HttpClient
- Form Handling: Reactive Forms
- Routing: Angular Router
- UI Principles: Responsive, Accessible, Scalable

---

# Angular 20 Standards

## Standalone Component Architecture

- Use standalone components across the application.
- Avoid unnecessary NgModules.
- Keep components modular and reusable.
- Use feature-based architecture structure.
- Maintain isolated and scalable component design.

## Modern Angular Features

- Use Angular Signals for reactive local state.
- Use Computed Signals for derived state calculations.
- Use Effects for controlled reactive side effects.
- Prefer signal-based state management over unnecessary RxJS complexity.
- Use model-based architecture for scalable UI development.

## State Management Standards

### Signals

- Use signals for component state handling.
- Maintain predictable reactive state updates.
- Avoid excessive mutable state patterns.

### Computed Signals

- Use computed signals for filtered, mapped, and derived values.
- Prevent duplicated calculations inside templates.

### Effects

- Use effects for API triggers, synchronization, and controlled reactive workflows.
- Avoid unnecessary nested effects.

### RxJS Usage

- Use RxJS for asynchronous streams and API workflows.
- Use operators efficiently and avoid memory leaks.
- Handle subscriptions properly.

---

# Component Standards

## Component Structure

- Keep components focused on a single responsibility.
- Separate UI logic from business logic.
- Maintain clean component hierarchy.
- Reuse shared UI components whenever possible.

## Smart & Presentational Components

### Smart Components

- Handle API calls and business logic.
- Manage application workflows and state.

### Presentational Components

- Handle UI rendering only.
- Receive data through inputs and outputs.
- Remain reusable and stateless where possible.

---

# Model-Based Development Standards

- Use strongly typed interfaces and models.
- Maintain strict TypeScript typing across the project.
- Create reusable API response models.
- Avoid using any type unless absolutely necessary.
- Align frontend models with backend schemas.

---

# UI & Styling Standards

## Bootstrap 5 Standards

- Use Bootstrap 5 utility classes consistently.
- Follow responsive grid system properly.
- Maintain reusable spacing and layout standards.
- Avoid unnecessary custom CSS where utilities are sufficient.

## Responsive Design

- Mobile-first development approach.
- Support desktop, tablet, and mobile responsiveness.
- Prevent UI breaking across resolutions.
- Maintain consistent spacing and typography.

## Design Consistency

- Use centralized color variables.
- Use typography variables and semantic tokens.
- Maintain consistent shadows, radius, spacing, and layout structure.

---

# Form Standards

- Use Angular Reactive Forms.
- Implement dynamic form validation.
- Maintain reusable form control patterns.
- Show accessible and user-friendly validation messages.
- Avoid unnecessary template-driven forms.

---

# API & Service Standards

- Handle API communication only through services.
- Use centralized API configuration.
- Maintain reusable HTTP interceptors.
- Implement proper error handling and loading states.
- **Global Error Handling**: Implement the `ErrorHandler` interface to capture and log both HTTP and non-HTTP runtime errors globally.
- Use typed request and response models.

---

# Testing Standards

## Unit Testing
- Framework: Jasmine + Karma (Default) or Vitest.
- Aim for high coverage on core services and business logic (80%+).
- Mock external dependencies and API calls.
- Test both success and error paths in Signals and RxJS streams.

## E2E Testing
- Framework: Cypress or Playwright.
- Focus on critical user flows: Login, Contract Creation, Attendance Logging, and Payments.
- Verify UI consistency across different breakpoints.

---

# Performance Standards

- Use trackBy in loops for optimized rendering.
- Avoid unnecessary re-renders.
- Lazy load feature routes and heavy modules.
- Optimize image loading and API requests.
- Maintain scalable rendering performance.

---

# Security Standards

- Prevent sensitive data exposure on frontend.
- Use JWT authentication securely.
- Sanitize and validate all user inputs.
- Protect routes using guards and middleware.
- Avoid insecure local storage practices.

---

# Accessibility Standards

- Maintain semantic HTML structure.
- Ensure keyboard accessibility.
- Support screen readers where required.
- Maintain proper color contrast and focus states.
- Follow accessibility best practices.

---

# Folder Structure Standards

## Recommended Structure

src/
│
├── app/
│
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   ├── layouts/
│   │   ├── utilities/
│   │   ├── constants/
│   │   ├── config/
│   │   └── state/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── enums/
│   │   ├── models/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── validators/
│   │   ├── ui/
│   │   └── shared-services/
│   │
│   ├── features/
│   │   ├── public/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── client/
│   │   ├── freelancer/
│   │   └── ai/
│   │
│   ├── routes/
│   │   ├── app.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── client.routes.ts
│   │   ├── freelancer.routes.ts
│   │   └── public.routes.ts
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   ├── animations/
│   └── mock-data/
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── styles/
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layouts/
│   ├── themes/
│   ├── utilities/
│   └── main.scss
│
├── index.html
├── main.ts
└── styles.scss
---

# Git & Collaboration Standards

- Use meaningful commit messages.
- Maintain clean branch naming conventions.
- Follow sprint-based workflow.
- Keep pull requests focused and organized.

---

# Development Goals

- Build scalable enterprise-grade frontend systems.
- Create reusable standalone component architecture.
- Deliver responsive and accessible UI experiences.
- Maintain modern Angular 20 development standards.
- Build maintainable, future-proof frontend applications.