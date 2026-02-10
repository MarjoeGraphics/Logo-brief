class QuestionnaireApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 9;
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
                <div class="space-y-2">
                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>${scale.left}</span>
                        <span>${scale.right}</span>
                    </div>
                    <input type="range" name="${scale.name}" min="1" max="5" step="1" value="3" class="w-full personality-scale" data-left="${scale.left}" data-right="${scale.right}">
                </div>
            `).join('');
        }

        // Render Step 6: Logo Styles
        const logoGrid = document.getElementById('logo-selection-grid');
        if (logoGrid) {
            logoGrid.innerHTML = this.config.logoStyles.map(style => `
                <label class="cursor-pointer group relative">
                    <input type="radio" name="Logo_Style_Preference" value="${style.value}" class="peer hidden">
                    <div class="h-full bg-slate-700/30 border border-slate-600 rounded-xl overflow-hidden transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 group-hover:border-slate-500">
                        <div class="aspect-video w-full overflow-hidden border-b border-slate-600/50">
                            <img src="${style.image}" alt="${style.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        <div class="p-3">
                            <span class="block font-bold text-white text-sm mb-1">${style.title}</span>
                            <p class="text-[10px] text-slate-500 leading-tight">${style.description}</p>
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
                    <div class="bg-slate-700/30 border border-slate-600 rounded-xl p-4 h-full transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 group-hover:border-slate-500">
                        <div class="w-full h-20 ${color.colorClass} rounded-lg mb-3 ${color.id === 'black' ? 'border border-slate-600' : ''}"></div>
                        <span class="block font-bold ${color.textClass || 'text-white'} text-base mb-1.5">${color.name}</span>
                        <p class="text-xs text-slate-400 leading-snug">${color.keywords}</p>
                    </div>
                </label>
            `).join('');

            this.setupColorLogic();
        }

        // Render Step 8: Pricing
        const pricingGrid = document.getElementById('pricing-selection-grid');
        if (pricingGrid) {
            pricingGrid.innerHTML = this.config.pricingTiers.map(tier => `
                <label class="cursor-pointer group relative block h-full">
                    <input type="radio" name="Selected_Investment_Strategy" value="${tier.title}" data-id="${tier.id}" class="peer hidden" required>
                    <div class="bg-slate-700/30 border-2 border-slate-600 rounded-2xl p-6 h-full transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 group-hover:border-slate-500 relative overflow-hidden flex flex-col">
                        ${tier.recommended ? '<div class="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Recommended</div>' : ''}
                        <h3 class="text-xl font-bold text-white mb-1">${tier.title}</h3>
                        <div class="text-2xl font-bold text-indigo-400 mb-4">${tier.price}</div>
                        <ul class="space-y-2 flex-grow">
                            ${tier.features.map(f => `
                                <li class="flex items-center gap-2 text-xs text-slate-400">
                                    <i data-lucide="check" class="w-3 h-3 text-indigo-500"></i>
                                    ${f}
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
                        <div class="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600 rounded-xl transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 group-hover:border-slate-500 peer-checked:[&_.checkmark-box]:bg-indigo-500 peer-checked:[&_.checkmark-box]:border-indigo-500 peer-checked:[&_svg]:opacity-100">
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-white">${addon.label}</span>
                                <span class="text-[10px] text-slate-400">${addon.price}</span>
                            </div>
                            <div class="w-5 h-5 rounded border border-slate-600 flex items-center justify-center transition-all checkmark-box">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white opacity-0 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
            if (e.target.name === 'Selected_Investment_Strategy' || e.target.name === 'Logo_Style_Preference') {
                this.validateCurrentStep();
                if (e.target.name === 'Selected_Investment_Strategy' && this.currentStep === 8) {
                    this.toggleEssentialAddons();
                }
            }
        });
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

        if (this.currentStep === 8) {
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
        }

        this.validateCurrentStep();
    }

    validateCurrentStep() {
        let isValid = true;

        if (this.currentStep === 1) {
            isValid = this.step1Inputs.name.value.trim() !== '' &&
                      this.step1Inputs.email.value.trim() !== '' &&
                      this.step1Inputs.email.checkValidity() &&
                      this.step1Inputs.timeline.value !== '';
        } else if (this.currentStep === 6) {
            const selectedStyle = document.querySelector('input[name="Logo_Style_Preference"]:checked');
            isValid = !!selectedStyle;
        } else if (this.currentStep === 7) {
            const checkboxes = document.querySelectorAll('.color-checkbox');
            const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            isValid = selectedCount >= 2 && selectedCount <= 4;
        } else if (this.currentStep === 8) {
            const selectedTier = document.querySelector('input[name="Selected_Investment_Strategy"]:checked');
            isValid = !!selectedTier;
        }

        if (this.currentStep === this.totalSteps) {
            this.submitBtn.disabled = !isValid;
        } else {
            this.nextBtn.disabled = !isValid;
        }
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
                    { name: 'Brand_Tagline_Slogan', label: 'Tagline' }
                ]
            },
            {
                title: 'Investment',
                fields: [
                    { name: 'Selected_Investment_Strategy', label: 'Package' },
                    { name: 'Essential_Addons[]', label: 'Add-ons' }
                ]
            }
        ];

        let html = '';

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
                    <div class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-700/30 last:border-0">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 min-w-[120px]">${field.label}</span>
                        <span class="text-xs text-slate-300 sm:text-right">${value || '<span class="italic text-slate-600">Not specified</span>'}</span>
                    </div>
                `;
            }).join('');

            html += `
                <div class="mb-6 last:mb-0">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">${section.title}</h4>
                    <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        ${fieldContents}
                    </div>
                </div>
            `;
        });

        // Add colors separately
        const colors = formData.getAll('Selected_Color_Psychology[]');
        if (colors.length > 0) {
            html += `
                <div class="mb-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Selected Colors</h4>
                    <div class="flex flex-wrap gap-2">
                        ${colors.map(color => `
                            <span class="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-medium">${color}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        reviewContainer.innerHTML = html;
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuestionnaireApp();
});
