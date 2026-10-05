# Salamat Innovation - Data Flow & Architecture

## 1. Route Map
- `/(auth)/*`: Login, Sign Up, Forgot Password, Reset Password, OTP (Mocked)
- `/admin/*`: Admin Dashboard and subpages
- `/admin/coming-soon`: Reusable placeholder for undeveloped sidebar links

## 2. State Machine (Redux)
- **`uiSlice`**: Global UI state
  - `sidebarOpen`: boolean
  - `activeModal`: string | null
- **`authSlice`**: Session state (Mocked)
  - `user`: User | null
  - `token`: string | null

## 3. URL Parameters
- `?search`: Search queries in admin tables or sidebar
- `?page` / `?limit`: Pagination configuration

## 4. Component Hierarchy (Sidebar)
- `AdminSidebar` -> Reads `NAVIGATION_DATA`
  - Includes `input` for instant text search
  - Maps to `SidebarAccordion` (animates via CSS `grid-template-rows`)
    - Maps to `SidebarLink`

## 5. Auth Flow (Mocked)
1. User enters credentials (admin@email.com / Admin1234@!)
2. `react-hook-form` + `zod` validates format locally.
3. Form submits, `isLoading` state set to true, buttons disabled.
4. Mock API service delays 1s, returns success token.
5. Toast success displayed, Redux state updated, redirect to `/admin`.


## 6. Layout & Sidebar Architecture
- **`AdminLayout`**: Master responsive wrapper (`min-w-[320px] max-w-[1920px]`). Centers content on ultra-wide screens and flexes child routes.
- **`AdminSidebar`**: Client-side state manager for navigation.
  - Controls active accordion (`openSection`).
  - Manages instant search filtering (`search` state). Overrides accordion state to open all matching sections when a user types.
- **`SidebarSection`**: Renders the section title and the white, rounded card wrapper. Uses `data-state` to trigger the `grid-template-rows` CSS animation.
- **`SidebarLink`**: Pure presentational leaf component. Handles active route styling and injects SVG icons.

## 7. Auth Flow UI Components
- **`LoginPage`**: Routes to `/admin` on success. Interacts with `authService.login`.
- **`SignupPage`**: Captures name/email/pass. Routes to `/otp`.
- **`ForgotPasswordPage`**: Captures email to request OTP. Routes to `/otp`.
- **`OtpPage`**: Validates 6-digit code. Routes to `/reset-password`.
- **`ResetPasswordPage`**: Client-side validation for password match. Routes back to `/login`.
- All forms use `react-hook-form` + `zod` and integrate with the global `ToastContext`.