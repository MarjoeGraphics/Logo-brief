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

                // Populate payment details
                const paymentDetails = document.getElementById('payment-success-details');
                if (paymentDetails && window.app) {
                    const investment = window.app.calculateTotalInvestment();
                    const config = window.app.config;

                    if (investment && config && config.paymentInfo) {
                        const dpAmount = typeof investment.value === 'number' ? investment.value * 0.5 : 0;
                        const qrData = generateGCashQR(config.paymentInfo.number, config.paymentInfo.name, dpAmount);
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200&margin=10`;

                        let html = `
                            <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-left animate-zoom-in" style="animation-delay: 200ms">
                                <div class="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Investment</span>
                                    <span class="text-xl font-black text-white">${investment.display}</span>
                                </div>
                        `;

                        if (dpAmount > 0) {
                            html += `
                                <div class="space-y-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">50% Downpayment</span>
                                        <span class="text-2xl font-black text-white">₱${dpAmount.toLocaleString()}</span>
                                    </div>
                                    <p class="text-[11px] text-slate-400 leading-relaxed text-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                                        To begin the design process, please settle the downpayment via GCash. Your brief will be prioritized upon confirmation.
                                    </p>
                                    <div class="flex flex-col items-center gap-3 pt-2">
                                        <div class="w-48 h-48 bg-white p-1 rounded-2xl shadow-2xl overflow-hidden">
                                            <img src="${qrUrl}" alt="GCash QR Code" class="w-full h-full object-contain">
                                        </div>
                                        <div class="text-center">
                                            <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">${config.paymentInfo.name}</p>
                                            <p class="text-[9px] font-medium text-slate-500 mt-0.5 tracking-widest">${config.paymentInfo.number}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        } else {
                            html += `
                                <p class="text-xs text-slate-400 leading-relaxed text-center bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                                    A 50% downpayment of the final agreed price is required to start the project. We will contact you with the specific amount after reviewing your requirements.
                                </p>
                            `;
                        }

                        html += `</div>`;
                        paymentDetails.innerHTML = html;
                    }
                }

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

/**
 * Generates an EMVCo compliant QR Ph string for GCash
 */
function generateGCashQR(phone, name, amount) {
    const crc16 = (data) => {
        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };

    const pad = (id, value) => {
        const len = value.toString().length.toString().padStart(2, '0');
        return id + len + value;
    };

    // 00: Payload Format Indicator
    let payload = pad('00', '01');
    // 01: Point of Initiation Method (12 for Dynamic/Amount included)
    payload += pad('01', '12');

    // 26: Merchant Account Information (QR Ph)
    const guid = pad('00', 'PH.CASH.01');
    const mobile = pad('01', phone);
    payload += pad('26', guid + mobile);

    // 52: Merchant Category Code
    payload += pad('52', '0000');
    // 53: Transaction Currency (608 for PHP)
    payload += pad('53', '608');
    // 54: Transaction Amount
    payload += pad('54', amount.toFixed(2));
    // 58: Country Code
    payload += pad('58', 'PH');
    // 59: Merchant Name
    payload += pad('59', name);
    // 60: Merchant City
    payload += pad('60', 'Manila');

    // 63: CRC
    payload += '6304';
    payload += crc16(payload);

    return payload;
}
