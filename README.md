# Premium Strategic Brand Brief

A sophisticated, multi-step branding questionnaire designed for high-end design inquiries. Features dynamic pricing, interactive logo/color selection, bespoke add-ons, structured brief summaries, and integrated GCash payment instructions.

---

## 🌟 Overview & Workflow

The questionnaire guides clients through an intuitive 10-step strategic onboarding process:

1. **Step 1: Brand Foundations (Contact Details)**
   Captures client contact info (Full Name, Email Address), target launch date (with native calendar picker), and dynamic studio commission availability status.
2. **Step 2: Investment Strategy**
   Presents package tiers with concepts, revisions, turnaround times, and deliverables. Dynamically renders 13 optional add-on services for the *Essential Start* tier.
3. **Step 3: Business Profile**
   Collects company entity name, core products/services, unique value proposition, and target demographic.
4. **Step 4: Brand Vision**
   Uncovers emotional goals and audience perception requirements.
5. **Step 5: Brand Identity**
   Defines non-negotiable core values and the overarching brand mission statement.
6. **Step 6: Brand Personality**
   Interactive 5-point spectrum sliders across 12 contrasting brand trait pairs (e.g., *Greyscale vs. Colorful*, *Minimalistic vs. Complex*, *Luxurious vs. Natural*).
7. **Step 7: Logo Style & Direction**
   Showcases a visual grid of 9 logo styles with high-resolution image cards, hover magnification, and capture fields for ideas, must-have elements, and taglines.
8. **Step 8: Brand Color Psychology**
   Interactive selection grid of color psychology cards (requiring between 2 to 4 colors selected) with visible meanings, keywords, and color swatches.
9. **Step 9: Review & Submit**
   Comprehensive, dynamic summary of the entire brief (contact, business profile, brand vision, visual direction, selected colors, investment package + bespoke add-ons, and personality scales). Includes an explicit review confirmation checkbox before brief submission.
10. **Step 10: Thank You & Investment Downpayment**
    Post-submission confirmation screen with dynamic 50% downpayment calculation, merchant account details, and GCash QR payment presentation.

---

## 🌐 Third-Party Services & Libraries

This application relies on the following external services, CDNs, and libraries:

| Service / Library | Purpose / Integration | Details & Configuration |
| :--- | :--- | :--- |
| **[Formspree](https://formspree.io/)** | Form backend & AJAX email delivery | Form submissions are dispatched asynchronously via `fetch` to `https://formspree.io/f/xzdabljr`. Formspree formats and delivers structured email briefs with clean aggregated labels (`Client Full Name`, `Client Email Address`, `Project Timeline`, `Investment Details`, `Brief Summary`). |
| **[Tailwind CSS (Play CDN)](https://tailwindcss.com/)** | Utility-first CSS styling & dark mode | Loaded via `https://cdn.tailwindcss.com`. Configured for dark-mode aesthetic with custom slate-900 background (`#0f172a`), indigo accent colors (`#6366f1` / `#4f46e5`), and responsive grid layouts. |
| **[Lucide Icons](https://lucide.dev/)** | Vector UI iconography | Loaded via `https://unpkg.com/lucide@latest`. Dynamically rendered across UI cards, navigation buttons, and deliverables using `lucide.createIcons()`. |
| **[Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)** | Typography | Embedded via `fonts.googleapis.com` and `fonts.gstatic.com` preconnects for weights 300 through 700. |
| **[GCash](https://www.gcash.com/)** | Mobile payment processing | Presents merchant account holder name, phone number, and static payment QR code (`assets/gcash-qr.png`) alongside the calculated 50% downpayment requirement on Step 10. |
| **[GitHub Pages](https://pages.github.com/)** | Static site hosting & deployment | Hosted directly from the repository's default branch. Zero server build steps required. |

---

## 🛠️ Customization Guide

All questionnaire content, pricing tiers, availability, visual choices, and payment details are managed in `config.json`. No changes to HTML or JavaScript are required for typical updates.

### 1. Studio Availability Status
Toggle your project commission capacity displayed on Step 1:
```json
"availabilityStatus": {
    "text": "Limited Capacity: Accepting only 2 project commissions per month.",
    "badgeColor": "bg-indigo-500"
}
```
* **`text`**: The status announcement string shown in the badge.
* **`badgeColor`**: Tailwind color class for the indicator dot (e.g., `bg-indigo-500`, `bg-emerald-500`, `bg-rose-500`).

### 2. Pricing Tiers & Deliverables
Pricing options are configured under the `pricingTiers` array in `config.json`:
- **`id`**: Unique identifier for the tier (`essential`, `professional`, `enterprise`).
- **`title`**: Display name of the package (e.g., `"Essential Start"`, `"Professional Growth"`, `"Business Scale"`).
- **`priceDisplay`**: Formatted price label (e.g., `"₱1,000"`, `"₱4,000"`, `"₱10,000+"`).
- **`priceValue`**: Numeric value used for the automatic 50% downpayment calculation (e.g., `1000`, `4000`, `10000`). Set to `null` if the tier is price-upon-request.
- **`concepts`**: Concepts badge description (e.g., `"1 Original Logo Concept"`).
- **`revisions`**: Revision round limit (e.g., `"5 Revision Rounds"` or `"8 Revision Rounds"`).
- **`turnaround`**: Estimated turnaround time (e.g., `"1-Week Turnaround"`).
- **`deliverables`**: Array of string deliverables included with the package.
- **`recommended`**: Set to `true` to display the "Recommended" ribbon on the tier card.

### 3. Add-ons (Upsells)
Optional add-ons are attached to the `essential` tier under the `addons` array:
```json
{
    "id": "extra_logo_concept",
    "label": "Extra Logo Concept",
    "price": "₱200"
}
```
* **`label`**: Name of the add-on service.
* **`price`**: Display price formatted with currency (e.g., `"₱200"`). Checked add-on prices are automatically parsed and added to the total investment.

### 4. Personality Scales (Step 6)
The 12 brand personality sliders are defined in the `personalityScales` array:
```json
{
    "id": "greyscale_colorful",
    "left": "Greyscale",
    "right": "Colorful",
    "name": "Personality_Scale_Greyscale_vs_Colorful"
}
```
Each slider represents a 5-point balance scale from 1 (Strongly Left) to 5 (Strongly Right), with 3 representing Balanced.

### 5. Logo Style Preferences (Step 7)
Configured under the `logoStyles` array:
- **`id`**: Unique identifier for the style (e.g., `"wordmark"`, `"brandmarks"`).
- **`title`**: Display title (e.g., `"Wordmark (Logotype)"`).
- **`description`**: Brief description explaining the logo type.
- **`value`**: Value captured in the form submission payload.
- **`image`**: Relative path to the image asset in the `assets/` directory (e.g., `"assets/wordmark.png"`).

#### 📐 Logo Asset Specifications:
- **Directory**: `assets/`
- **Recommended Dimensions**: 1000 × 1000 pixels (1:1 square aspect ratio; minimum 800 × 800 px).
- **Format**: PNG or high-resolution JPG.
- **Naming Notice**: Asset filenames must match physical filenames exactly (e.g., `assets/lettermarks.png` vs. `assets/letterforms.png`).

### 6. Color Psychology (Step 8)
Defined in the `colorPsychology` array:
- **`id`**: Unique identifier (e.g., `"blue"`).
- **`name`**: Color title (e.g., `"Blue"`).
- **`keywords`**: Association tags (e.g., `"Trust, Stability, Intelligence, Peace"`).
- **`description`**: Meaning and psychology summary (permanently visible on card).
- **`colorClass`**: Tailwind background class for the preview tile (e.g., `"bg-blue-500"`).

*Validation rule:* Clients must select between **2 and 4** colors before advancing.

### 7. Merchant Payment Information (Step 10)
Set your GCash details under `paymentInfo`:
```json
"paymentInfo": {
    "number": "09667659307",
    "name": "Mar*** M. Sa***"
}
```
- **`number`**: Merchant mobile number displayed on the payment card.
- **`name`**: Verified account holder name.
- **QR Code Asset**: Save your static payment QR code at `assets/gcash-qr.png`.

---

## 🔒 Hidden Navigation Toggle (Developer / Client Review)

A hidden quick-step navigation bar (`#step-nav`) is integrated for rapid jumping between steps 1 through 10 during review or testing:

- **How to Activate**: Click the header logo container (`#logo-trigger`) **10 times** within a 5-second window.
- **Auto-Reset**: If fewer than 10 clicks are made, the click counter automatically resets after 5 seconds of inactivity.
- **Toggle Action**: The navigation bar toggles between hidden and flex view with numbered buttons for each step.

---

## 📂 Project Structure

```text
├── assets/                  # Static image assets (logo styles & GCash QR code)
│   ├── abstract.png
│   ├── brandmarks.png
│   ├── combination.png
│   ├── dynamic.png
│   ├── emblem.png
│   ├── gcash-qr.png
│   ├── letterforms.png
│   ├── lettermarks.png
│   ├── mascots.png
│   └── wordmark.png
├── app.js                   # Application state machine, dynamic step rendering & calculations
├── config.json              # Single source of truth: pricing, add-ons, styles, colors & payment info
├── form-submission.js       # AJAX form handler, payload transformation & Formspree submission
├── index.html               # Main application layout, multi-step structure & CDN dependencies
├── styles.css               # Animations (slide-in, zoom), custom scrollbars & slider styles
└── README.md                # Project documentation and customization guide
```

---

## 🚀 Technical Highlights

- **Dynamic Investment Calculation**: Automatically tallies tier base price with checked add-ons and updates the Step 9 confirmation summary and Step 10 downpayment calculation (50%).
- **Structured Submissions**: `form-submission.js` aggregates complex form inputs into human-readable fields for your Formspree inbox:
  - `Client Full Name`: Primary contact name.
  - `Client Email Address`: Direct reply email.
  - `Project Timeline`: Desired delivery date.
  - `Investment Details`: Package selection, total estimated price, and selected add-ons.
  - `Brief Summary`: Complete, formatted markdown-style transcript covering all 9 strategic inquiry steps.
- **Full-View Review**: Step 9 expands cleanly within the viewport without awkward inner scrollbars.
- **Native Datepicker**: The Step 1 launch date field triggers the native browser datepicker using `showPicker()`.
- **Responsive Dark Mode UI**: Engineered with an Apple-esque, minimalist slate dark-mode palette, glassmorphism containers, and subtle micro-animations.

---

## 📦 Deployment

This repository is ready for deployment on **GitHub Pages**:

1. Push your changes to your repository's `main` branch.
2. In your GitHub repository, navigate to **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** and choose `main` / `/(root)`.
4. Your brief questionnaire will be live at `https://<username>.github.io/<repo-name>/`.
