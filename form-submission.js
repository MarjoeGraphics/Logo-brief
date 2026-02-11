document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('questionnaire-form');
    const submitBtn = document.getElementById('submit-btn');
    const successScreen = document.getElementById('success-screen');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
            Sending...
        `;

        const formData = new FormData(form);
        const transformedData = {};

        // Helper to get descriptors for scales
        const getScaleDescription = (value, left, right) => {
            const val = parseInt(value);
            if (val === 1) return `1 (Strongly ${left})`;
            if (val === 2) return `2 (Leaning ${left})`;
            if (val === 3) return `3 (Neutral / Balanced)`;
            if (val === 4) return `4 (Leaning ${right})`;
            if (val === 5) return `5 (Strongly ${right})`;
            return value;
        };

        // Transform Data
        for (let [key, value] of formData.entries()) {
            // Handle Personality Scales
            if (key.startsWith('Personality_Scale_')) {
                const input = form.querySelector(`input[name="${key}"]`);
                if (input) {
                    const left = input.getAttribute('data-left');
                    const right = input.getAttribute('data-right');
                    transformedData[key] = getScaleDescription(value, left, right);
                } else {
                    transformedData[key] = value;
                }
            }
            // Handle Colors
            else if (key.includes('Selected_Color_Psychology')) {
                const checkbox = form.querySelector(`input[name="${key}"][value="${value}"]`);
                const keywords = checkbox ? checkbox.getAttribute('data-keywords') : '';
                const formattedColor = `${value} (${keywords})`;

                if (!transformedData['Selected_Color_Psychology']) {
                    transformedData['Selected_Color_Psychology'] = formattedColor;
                } else {
                    if (!transformedData['Selected_Color_Psychology'].includes(formattedColor)) {
                        transformedData['Selected_Color_Psychology'] += `, ${formattedColor}`;
                    }
                }
            }
            // Handle Logo Styles
            else if (key === 'Logo_Style_Preference') {
                transformedData['Logo_Style_Preference'] = value;
            }
            // Handle Add-ons
            else if (key.includes('Essential_Addons')) {
                const cleanKey = 'Selected_Addons';
                if (!transformedData[cleanKey]) {
                    transformedData[cleanKey] = value;
                } else {
                    if (!transformedData[cleanKey].includes(value)) {
                        transformedData[cleanKey] += `, ${value}`;
                    }
                }
            }
            // Handle Pricing Tier
            else if (key === 'Selected_Investment_Strategy') {
                transformedData['Package_Selected'] = value;
            }
            // Pass through others
            else {
                transformedData[key] = value;
            }
        }

        // Get Investment info from App logic if available
        const investment = window.app ? window.app.calculateTotalInvestment() : null;
        const totalInvestmentDisplay = investment ? investment.display : "Not specified";

        // Generate a formatted summary for Formspree
        let summary = "--- STRATEGY BRIEF SUMMARY ---\n\n";

        const summarySections = [
            { title: "CONTACT DETAILS", keys: ["Client_Full_Name", "Client_Email_Address", "Project_Timeline"] },
            { title: "BUSINESS PROFILE", keys: ["Business_Organization_Name", "Products_and_Services", "Business_Value_Proposition", "Target_Audience"] },
            { title: "BRAND VISION", keys: ["Audience_Perception_Goal", "Brand_Core_Values", "Brand_Mission_Statement"] },
            { title: "VISUAL DIRECTION", keys: ["Logo_Style_Preference", "Brand_Tagline_Slogan", "New_Logo_Ideas", "Must_Include_Elements", "Visual_Preferences_Constraints", "Current_Brand_Assets_References"] }
        ];

        summarySections.forEach(section => {
            summary += `[ ${section.title} ]\n`;
            section.keys.forEach(k => {
                const val = transformedData[k] || "Not specified";
                const label = k.replace(/_/g, " ");
                summary += `• ${label}: ${val}\n`;
            });
            summary += "\n";
        });

        summary += "[ SELECTED COLORS ]\n";
        summary += transformedData['Selected_Color_Psychology'] ? `• ${transformedData['Selected_Color_Psychology']}` : "• Not specified";
        summary += "\n\n";

        summary += "[ INVESTMENT ]\n";
        summary += `• Package: ${transformedData['Package_Selected'] || "Not specified"}\n`;
        if (transformedData['Selected_Addons']) {
            summary += `• Add-ons: ${transformedData['Selected_Addons']}\n`;
        }
        summary += `• Total Investment: ${totalInvestmentDisplay}\n`;
        summary += "\n";

        summary += "[ PERSONALITY SCALES ]\n";
        let hasScales = false;
        for (let k in transformedData) {
            if (k.startsWith('Personality_Scale_')) {
                summary += `• ${k.replace('Personality_Scale_', '').replace(/_/g, ' ')}: ${transformedData[k]}\n`;
                hasScales = true;
            }
        }
        if (!hasScales) summary += "• Not specified\n";
        summary += "\n";

        if (transformedData['Additional_Notes_Comments']) {
            summary += `[ ADDITIONAL NOTES ]\n${transformedData['Additional_Notes_Comments']}\n`;
        }

        // Aggregating into Simple Labels as requested
        const simplifiedData = {
            "Client Details": `${transformedData['Client_Full_Name']} <${transformedData['Client_Email_Address']}> | Due: ${transformedData['Project_Timeline']}`,
            "Investment Details": `${transformedData['Package_Selected'] || 'Not selected'} (Total: ${totalInvestmentDisplay})${transformedData['Selected_Addons'] ? ' | Add-ons: ' + transformedData['Selected_Addons'] : ''}`,
            "Brief Summary": summary,
            "_subject": transformedData['_subject'] || "New Brand Strategy Brief"
        };

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: JSON.stringify(simplifiedData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                form.classList.add('hidden');
                const header = document.querySelector('.pt-8.px-8.pb-4');
                if (header) header.classList.add('hidden');

                successScreen.classList.remove('hidden');
                successScreen.classList.add('flex');

                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } else {
                const data = await response.json();
                alert(data.errors ? data.errors[0].message : 'Oops! There was a problem submitting your form');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Oops! There was a problem submitting your form');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    });
});
