# Premium Strategic Brand Brief

A sophisticated, multi-step branding questionnaire designed for high-end design inquiries. Featuring dynamic pricing, interactive logo/color selection, and integrated GCash payment generation.

## 🛠️ Customization Guide

All questionnaire content, pricing, and logic can be managed via the `config.json` file. No coding knowledge (HTML/JS) is required for most updates.

### 1. Pricing & Deliverables
To update your packages, locate the `pricingTiers` array in `config.json`:
- **`title`**: The name of the package (e.g., "Essential Start").
- **`priceDisplay`**: The text shown on the pricing card (e.g., "₱1,000" or "Custom").
- **`priceValue`**: The numeric value used for downpayment calculations (set to `null` for "Price upon request" packages).
- **`revisions`**: Number of revision rounds.
- **`deliverables`**: A list of what the client receives.

### 2. Add-ons (Upsells)
Add-ons are currently linked to the **Essential Start** tier. You can modify these in the `addons` array within the `essential` tier object:
- **`label`**: Name of the service.
- **`price`**: Display price (e.g., "₱500").

### 3. Availability Status
Toggle your project capacity on the "Contact Details" (Step 1) page:
- Modify `availabilityStatus.text` to change the message.
- Modify `availabilityStatus.badgeColor` to change the indicator (e.g., `bg-indigo-500`, `bg-emerald-500`, or `bg-rose-500`).

### 4. Visual Preferences
- **Logo Styles (Step 7)**:
    - **Local Assets**: We have transitioned from Unsplash placeholders to local assets for better performance and customization. Store your logo examples in the `/assets` directory.
    - **Naming Convention**: By default, the system looks for `assets/wordmark.png`, `assets/brandmarks.png`, etc. If you use a different format (like `.jpg`), ensure you update the `image` field for each style in `config.json`.
    - **Enhanced UI**: Logo cards now use an `aspect-square` ratio for larger previews. On hover, the images **enlarge by 25%** (`scale-125`) and the dark gradient overlay fades out, providing a clear, unobstructed view of the design.
- **Color Psychology (Step 8)**: Update the `colorPsychology` array to modify the keywords, meanings, and CSS background classes. Descriptions are now permanently visible for better accessibility.

### 6. Hidden Navigation Toggle
For administrative or debugging purposes, the quick step navigation (1-10) is hidden by default.
- **How to Show/Hide**: Click the "Strategic Brief" logo or header area at the top 10 times in rapid succession (within 5 seconds).
- **Auto-Reset**: The click counter resets after 5 seconds of inactivity to prevent accidental triggers.

### 7. Project Structure
- `index.html`: The main entry point and UI structure.
- `app.js`: Core logic for multi-step navigation, dynamic rendering, and price calculations.
- `config.json`: **The Source of Truth.** All content, pricing, and image paths live here.
- `form-submission.js`: Handles AJAX submission to Formspree and GCash QR code generation.
- `assets/`: Directory for your custom logo style examples.

### 8. Payment Information
Update the `paymentInfo` section to ensure the generated QR code directs to your account:
- **`number`**: Your GCash mobile number.
- **`name`**: Your full name (as it appears on GCash).

## 🚀 Technical Features
- **EMVCo QR Ph**: Automatically generates a dynamic GCash QR code for a 50% downpayment based on the selected package and add-ons.
- **Structured Submissions**: Formspree payloads are formatted for clarity, providing separate, readable fields in your inbox:
    - **Client Full Name**: Extracted from Step 1.
    - **Client Email Address**: Extracted from Step 1.
    - **Project Timeline**: The requested due date.
    - **Investment Details**: A combined string of the selected package, total cost, and any add-ons.
    - **Brief Summary**: A full, human-readable breakdown of the entire strategy brief.
- **Responsive Design**: Built with Tailwind CSS, optimized for both desktop and mobile high-end experiences.

## 📦 Deployment
This project is ready for **GitHub Pages**. Simply push your changes to the `main` branch, and the site will be live at `https://[username].github.io/[repo-name]/`.
