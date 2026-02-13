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
- **Logo Styles**: Update the `logoStyles` array to change the categories, descriptions, or Unsplash images.
- **Color Psychology**: Update the `colorPsychology` array to modify the keywords and meanings associated with each color.

### 5. Payment Information
Update the `paymentInfo` section to ensure the generated QR code directs to your account:
- **`number`**: Your GCash mobile number.
- **`name`**: Your full name (as it appears on GCash).

## 🚀 Technical Features
- **EMVCo QR Ph**: Automatically generates a dynamic GCash QR code for a 50% downpayment based on the selected package and add-ons.
- **Aggregated Submissions**: Formspree payloads are cleaned to remove technical redundancy, sending you a concise summary of the client's strategy.
- **Responsive Design**: Built with Tailwind CSS, optimized for both desktop and mobile high-end experiences.

## 📦 Deployment
This project is ready for **GitHub Pages**. Simply push your changes to the `main` branch, and the site will be live at `https://[username].github.io/[repo-name]/`.
