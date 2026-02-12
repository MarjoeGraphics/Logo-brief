class QuestionnaireApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 9;
        this.stepTitles = [
            "Contact Details",
            "Investment Strategy",
            "Business Profile",
            "Brand Vision",
            "Brand Identity",
            "Brand Personality",
            "Logo Style",
            "Color Psychology",
            "Review & Submit"
        ];
        this.config = null;

        // DOM Elements
        this.form = document.getElementById('questionnaire-form');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.stepIndicator = document.getElementById('step-indicator');

        this.step1Inputs = {
            name: document.getElementById('full_name'),
            email: document.getElementById('email'),
            timeline: document.getElementById('timeline')
        };

        this.init();
    }

    async init() {
        await this.loadConfig();
        this.renderDynamicContent();
        this.setupEventListeners();
        this.updateStepUI();
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.config = await response.json();
        } catch (error) {
            console.error('Failed to load config:', error);
        }
    }

    renderDynamicContent() {
        if (!this.config) return;

        // Render Step 5: Personality Scales
        const scalesContainer = document.getElementById('personality-scales-container');
        if (scalesContainer) {
            scalesContainer.innerHTML = this.config.personalityScales.map(scale => `
                <div class="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30 transition-all hover:bg-slate-800/50">
                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                        <span class="text-indigo-400/70">${scale.left}</span>
                        <span class="text-indigo-400/70">${scale.right}</span>
                    </div>
                    <input type="range" name="${scale.name}" min="1" max="5" step="1" value="3" class="w-full personality-scale" data-left="${scale.left}" data-right="${scale.right}">
                    <div class="flex justify-between px-1">
                        ${[1, 2, 3, 4, 5].map(i => `<div class="w-1 h-1 rounded-full bg-slate-700"></div>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Render Step 6: Logo Styles
        const logoGrid = document.getElementById('logo-selection-grid');
        if (logoGrid) {
            logoGrid.innerHTML = this.config.logoStyles.map(style => `
                <label class="cursor-pointer group relative block h-full">
                    <input type="radio" name="Logo_Style_Preference" value="${style.value}" class="peer hidden">
                    <div class="h-full bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/5 group-hover:border-slate-600 group-hover:bg-slate-800/60 shadow-lg">
                        <div class="aspect-video w-full overflow-hidden relative">
                            <img src="${style.image}" alt="${style.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                        </div>
                        <div class="p-4 relative">
                            <span class="block font-bold text-white text-xs mb-1 uppercase tracking-wider">${style.title}</span>
                            <p class="text-[10px] text-slate-500 leading-relaxed">${style.description}</p>
                        </div>
                    </div>
                </label>
            `).join('');
        }

        // Render Step 7: Color Psychology
        const colorGrid = document.getElementById('color-selection-grid');
        if (colorGrid) {
            colorGrid.innerHTML = this.config.colorPsychology.map(color => `
                <label class="cursor-pointer group relative">
                    <input type="checkbox" name="Selected_Color_Psychology[]" value="${color.name}" data-keywords="${color.keywords}" class="peer hidden color-checkbox">
                    <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 h-full transition-all duration-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/5 group-hover:border-slate-600 shadow-lg">
                        <div class="w-full h-16 ${color.colorClass} rounded-xl mb-4 shadow-inner ${color.id === 'black' ? 'border border-slate-700' : ''} ${color.id === 'white' ? 'border border-slate-200/10' : ''}"></div>
                        <span class="block font-bold text-white text-[11px] mb-1.5 uppercase tracking-widest text-center">${color.name}</span>
                        <p class="text-[9px] text-slate-500 leading-tight text-center uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">${color.keywords.split(',')[0]}</p>
                    </div>
                </label>
            `).join('');

            this.setupColorLogic();
        }

        // Render Step 2: Pricing
        const pricingGrid = document.getElementById('pricing-selection-grid');
        if (pricingGrid) {
            pricingGrid.innerHTML = this.config.pricingTiers.map(tier => `
                <label class="cursor-pointer group relative block h-full">
                    <input type="radio" name="Selected_Investment_Strategy" value="${tier.title}" data-id="${tier.id}" class="peer hidden" required>
                    <div class="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 h-full transition-all duration-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/5 group-hover:border-slate-600 relative overflow-hidden flex flex-col shadow-xl">
                        ${tier.recommended ? '<div class="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em]">Recommended</div>' : ''}
                        <div class="mb-6">
                            <h3 class="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">${tier.title}</h3>
                            <div class="text-3xl font-black text-white tracking-tight">${tier.priceDisplay}</div>
                        </div>

                        <div class="space-y-3 mb-8">
                            <div class="flex items-center gap-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-900/80 py-2 px-3 rounded-xl border border-slate-700/50 w-full">
                                <i data-lucide="layers" class="w-3.5 h-3.5 text-indigo-400"></i>
                                ${tier.concepts}
                            </div>
                            <div class="flex items-center gap-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-900/80 py-2 px-3 rounded-xl border border-slate-700/50 w-full">
                                <i data-lucide="refresh-ccw" class="w-3.5 h-3.5 text-indigo-400"></i>
                                ${tier.revisions}
                            </div>
                            <div class="flex items-center gap-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-900/80 py-2 px-3 rounded-xl border border-slate-700/50 w-full">
                                <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-400"></i>
                                ${tier.turnaround}
                            </div>
                        </div>

                        <div class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Deliverables</div>
                        <ul class="space-y-3 flex-grow">
                            ${tier.deliverables.map(d => `
                                <li class="flex items-start gap-3 text-[11px] text-slate-400 leading-relaxed">
                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-indigo-500 mt-0.5"></i>
                                    <span>${d}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </label>
            `).join('');

            // Render Add-ons for Essential Start
            const addonsGrid = document.getElementById('addons-grid');
            const essentialTier = this.config.pricingTiers.find(t => t.id === 'essential');
            if (addonsGrid && essentialTier && essentialTier.addons) {
                addonsGrid.innerHTML = essentialTier.addons.map(addon => `
                    <label class="cursor-pointer group relative">
                        <input type="checkbox" name="Essential_Addons[]" value="${addon.label} (${addon.price})" class="peer hidden">
                    <div class="flex items-center justify-between p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl transition-all duration-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/5 group-hover:border-slate-600 peer-checked:[&_.checkmark-box]:bg-indigo-500 peer-checked:[&_.checkmark-box]:border-indigo-500 peer-checked:[&_svg]:opacity-100 shadow-md">
                        <div class="flex flex-col gap-1">
                            <span class="text-[11px] font-bold text-white uppercase tracking-widest">${addon.label}</span>
                            <span class="text-[10px] font-black text-indigo-400/80 tracking-widest">${addon.price}</span>
                            </div>
                        <div class="w-6 h-6 rounded-lg border border-slate-600 flex items-center justify-center transition-all duration-300 checkmark-box bg-slate-900/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white opacity-0 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                    </label>
                `).join('');
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    setupColorLogic() {
        const checkboxes = document.querySelectorAll('.color-checkbox');
        const countDisplay = document.getElementById('color-count');

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const selected = Array.from(checkboxes).filter(c => c.checked);
                if (countDisplay) countDisplay.textContent = `${selected.length} / 4 selected`;

                if (selected.length > 4) {
                    cb.checked = false;
                    if (countDisplay) countDisplay.textContent = `4 / 4 selected`;
                }
                this.validateCurrentStep();
            });
        });
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        this.prevBtn.addEventListener('click', () => this.navigate(-1));

        Object.values(this.step1Inputs).forEach(input => {
            input.addEventListener('input', () => this.validateCurrentStep());
        });

        if (this.step1Inputs.timeline) {
            this.step1Inputs.timeline.addEventListener('click', (e) => {
                try {
                    e.target.showPicker();
                } catch (err) {
                    // Fallback for browsers that don't support showPicker()
                }
            });
        }

        document.addEventListener('change', (e) => {
            if (e.target.name === 'Selected_Investment_Strategy' || e.target.name === 'Logo_Style_Preference' || e.target.name === 'Essential_Addons[]' || e.target.id === 'confirm-review') {
                this.validateCurrentStep();
                if (this.currentStep === 2) {
                    if (e.target.name === 'Selected_Investment_Strategy') {
                        this.toggleEssentialAddons();
                    }
                    this.updatePriceDisplay();
                }
            }
        });
    }

    calculateTotalInvestment() {
        const selectedTierInput = document.querySelector('input[name="Selected_Investment_Strategy"]:checked');
        if (!selectedTierInput) return null;

        const tierId = selectedTierInput.dataset.id;
        const tier = this.config.pricingTiers.find(t => t.id === tierId);

        if (tier.priceValue !== null) {
            let total = tier.priceValue;

            const addons = document.querySelectorAll('input[name="Essential_Addons[]"]:checked');
            addons.forEach(addon => {
                const priceMatch = addon.value.match(/₱([\d,]+)/);
                if (priceMatch) {
                    total += parseInt(priceMatch[1].replace(/,/g, ''));
                }
            });
            return { value: total, display: `₱${total.toLocaleString()}`, basePrice: tier.priceDisplay };
        } else {
            return { value: tier.priceDisplay, display: tier.priceDisplay, basePrice: tier.priceDisplay };
        }
    }

    updatePriceDisplay() {
        // We no longer have the price display bar in Step 8,
        // but we might want to keep the logic for other purposes
        // or just rely on calculateTotalInvestment when moving to Step 9.
    }

    navigate(direction) {
        const nextStep = this.currentStep + direction;
        if (nextStep < 1 || nextStep > this.totalSteps) return;

        const currentStepEl = document.getElementById(`step-${this.currentStep}`);
        const animationClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';

        currentStepEl.classList.add(animationClass);

        setTimeout(() => {
            this.currentStep = nextStep;
            this.updateStepUI();
        }, 400);
    }

    toggleEssentialAddons() {
        const selectedTier = document.querySelector('input[name="Selected_Investment_Strategy"]:checked');
        const addonsContainer = document.getElementById('essential-addons-container');
        if (!addonsContainer) return;

        if (selectedTier && selectedTier.dataset.id === 'essential') {
            addonsContainer.classList.remove('hidden');
            // Reset addons if switching back to essential? No, let them keep selections if they want
        } else {
            addonsContainer.classList.add('hidden');
            // Uncheck all addons when hidden to avoid sending data for non-essential tiers
            const addons = addonsContainer.querySelectorAll('input[type="checkbox"]');
            addons.forEach(cb => cb.checked = false);
        }
    }

    updateStepUI() {
        for (let i = 1; i <= this.totalSteps; i++) {
            const step = document.getElementById(`step-${i}`);
            if (!step) continue;

            if (i === this.currentStep) {
                step.classList.remove('hidden');
                setTimeout(() => {
                    step.classList.add('slide-in');
                    step.classList.remove('slide-out-left', 'slide-out-right');
                }, 50);
            } else {
                step.classList.add('hidden');
                step.classList.remove('slide-in');
            }
        }

        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.stepIndicator.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;

        this.prevBtn.classList.toggle('hidden', this.currentStep === 1);

        if (this.currentStep === 2) {
            this.toggleEssentialAddons();
        }

        if (this.currentStep === 9) {
            this.generateReviewSummary();
        }

        if (this.currentStep === this.totalSteps) {
            this.nextBtn.classList.add('hidden');
            this.submitBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
            this.submitBtn.classList.add('hidden');
            this.updateNextBtnText();
        }

        this.validateCurrentStep();
    }

    updateNextBtnText() {
        if (this.currentStep < this.totalSteps) {
            const nextTitle = this.stepTitles[this.currentStep];
            this.nextBtn.innerHTML = `Continue to ${nextTitle} <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    validateCurrentStep() {
        let isValid = true;

        if (this.currentStep === 1) {
            isValid = this.step1Inputs.name.value.trim() !== '' &&
                      this.step1Inputs.email.value.trim() !== '' &&
                      this.step1Inputs.email.checkValidity() &&
                      this.step1Inputs.timeline.value !== '';
        } else if (this.currentStep === 2) {
            const selectedTier = document.querySelector('input[name="Selected_Investment_Strategy"]:checked');
            isValid = !!selectedTier;
        } else if (this.currentStep === 7) {
            const selectedStyle = document.querySelector('input[name="Logo_Style_Preference"]:checked');
            isValid = !!selectedStyle;
        } else if (this.currentStep === 8) {
            const checkboxes = document.querySelectorAll('.color-checkbox');
            const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            isValid = selectedCount >= 2 && selectedCount <= 4;
        }

        if (this.currentStep === this.totalSteps) {
            const confirmCheck = document.getElementById('confirm-review');
            if (confirmCheck) isValid = isValid && confirmCheck.checked;
            this.submitBtn.disabled = !isValid;
        } else {
            this.nextBtn.disabled = !isValid;
        }
    }

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    generateReviewSummary() {
        const reviewContainer = document.getElementById('review-summary');
        if (!reviewContainer) return;

        const formData = new FormData(this.form);

        const sections = [
            {
                title: 'Contact Details',
                fields: [
                    { name: 'Client_Full_Name', label: 'Full Name' },
                    { name: 'Client_Email_Address', label: 'Email' },
                    { name: 'Project_Timeline', label: 'Due Date' }
                ]
            },
            {
                title: 'Business Profile',
                fields: [
                    { name: 'Business_Organization_Name', label: 'Business Name' },
                    { name: 'Products_and_Services', label: 'Products/Services' },
                    { name: 'Business_Value_Proposition', label: 'Value Prop' },
                    { name: 'Target_Audience', label: 'Target Audience' }
                ]
            },
            {
                title: 'Brand Vision',
                fields: [
                    { name: 'Audience_Perception_Goal', label: 'Perception Goal' },
                    { name: 'Brand_Core_Values', label: 'Core Values' },
                    { name: 'Brand_Mission_Statement', label: 'Mission Statement' }
                ]
            },
            {
                title: 'Visual Direction',
                fields: [
                    { name: 'Logo_Style_Preference', label: 'Logo Style' },
                    { name: 'Brand_Tagline_Slogan', label: 'Tagline' },
                    { name: 'New_Logo_Ideas', label: 'Logo Ideas' },
                    { name: 'Must_Include_Elements', label: 'Include Elements' },
                    { name: 'Visual_Preferences_Constraints', label: 'Constraints' },
                    { name: 'Current_Brand_Assets_References', label: 'References' }
                ]
            }
        ];

        let html = '';

        // Render sections in order
        sections.forEach(section => {
            const fieldContents = section.fields.map(field => {
                let value = '';
                if (field.name.endsWith('[]')) {
                    const values = formData.getAll(field.name);
                    value = values.length > 0 ? values.join(', ') : '';
                } else {
                    value = formData.get(field.name) || '';
                }

                return `
                    <div class="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-700/20 last:border-0">
                        <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 min-w-[140px] mb-1 sm:mb-0">${field.label}</span>
                        <span class="text-[11px] text-slate-300 sm:text-right font-medium leading-relaxed">${this.escapeHTML(value) || '<span class="italic text-slate-700 font-normal">Not specified</span>'}</span>
                    </div>
                `;
            }).join('');

            html += `
                <div class="animate-zoom-in">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mb-3 ml-1">${section.title}</h4>
                    <div class="bg-slate-800/30 rounded-3xl p-6 border border-slate-700/40 shadow-sm hover:bg-slate-800/50 transition-colors">
                        ${fieldContents}
                    </div>
                </div>
            `;
        });

        // Add colors between Visual Direction and Investment
        const colors = formData.getAll('Selected_Color_Psychology[]');
        if (colors.length > 0) {
            html += `
                <div class="mb-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Selected Colors</h4>
                    <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div class="flex flex-wrap gap-2">
                            ${colors.map(color => `
                                <span class="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-medium">${this.escapeHTML(color)}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Investment Section
        const investment = this.calculateTotalInvestment();
        if (investment) {
            const packageSelected = formData.get('Selected_Investment_Strategy');
            const addons = formData.getAll('Essential_Addons[]');

            const selectedTierInput = document.querySelector('input[name="Selected_Investment_Strategy"]:checked');
            const tierId = selectedTierInput ? selectedTierInput.dataset.id : null;
            const tier = this.config.pricingTiers.find(t => t.id === tierId);

            const features = [
                tier.concepts,
                tier.revisions,
                tier.turnaround,
                ...tier.deliverables
            ];

            html += `
                <div class="mb-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Investment</h4>
                    <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div class="flex justify-between py-2 border-b border-slate-700/30">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Package</span>
                            <span class="text-xs text-slate-300 text-right">${this.escapeHTML(packageSelected)} (${this.escapeHTML(investment.basePrice)})</span>
                        </div>
                        <div class="py-2 border-b border-slate-700/30">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Deliverables</span>
                            <ul class="space-y-1">
                                ${features.map(d => `
                                    <li class="flex items-start gap-2 text-[10px] text-slate-400">
                                        <i data-lucide="check" class="w-3 h-3 text-indigo-500 mt-0.5"></i>
                                        <span>${this.escapeHTML(d)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        ${addons.length > 0 ? `
                        <div class="flex justify-between py-2 border-b border-slate-700/30">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Add-ons</span>
                            <span class="text-xs text-slate-300 text-right">${this.escapeHTML(addons.join(', '))}</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between py-2 mt-2 pt-2 bg-indigo-500/5 -mx-3 px-3">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Total Investment</span>
                            <span class="text-xs font-bold text-indigo-400" id="selected-price-display">${this.escapeHTML(investment.display)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add personality scales separately
        const scales = [];
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('Personality_Scale_')) {
                const input = this.form.querySelector(`input[name="${key}"]`);
                const left = input.getAttribute('data-left');
                const right = input.getAttribute('data-right');

                // Helper to get simple descriptor for review
                const getSimpleDesc = (val) => {
                    if (val == 1) return `Strongly ${left}`;
                    if (val == 2) return `Leaning ${left}`;
                    if (val == 3) return `Balanced`;
                    if (val == 4) return `Leaning ${right}`;
                    if (val == 5) return `Strongly ${right}`;
                    return val;
                };

                scales.push({
                    label: key.replace('Personality_Scale_', '').replace(/_/g, ' '),
                    value: getSimpleDesc(value)
                });
            }
        }

        if (scales.length > 0) {
            html += `
                <div class="mb-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Brand Personality</h4>
                    <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        ${scales.map(scale => `
                            <div class="flex justify-between py-1 border-b border-slate-700/30 last:border-0 sm:even:border-b sm:last:border-b-0">
                                <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500">${scale.label}</span>
                                <span class="text-[10px] text-slate-300">${this.escapeHTML(scale.value)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        reviewContainer.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuestionnaireApp();
});
