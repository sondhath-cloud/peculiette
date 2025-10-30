// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Custom smooth scrolling for all anchor links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    // Custom smooth scroll with easing
                    smoothScrollTo(offsetPosition, 1200); // 1200ms duration
                }
            }
        });
    });

    // Contact page: toggle more details section
    const toggleDetailsBtn = document.getElementById('toggle-details');
    const moreDetails = document.getElementById('more-details');
    if (toggleDetailsBtn && moreDetails) {
        toggleDetailsBtn.addEventListener('click', function() {
            const show = moreDetails.style.display === 'none';
            moreDetails.style.display = show ? 'block' : 'none';
            toggleDetailsBtn.textContent = show ? 'Hide extra details' : 'Provide more details to get started faster';
        });
    }
    
	// Pricing page: rotate hero background image each visit
	(function rotatePricingHeroBackground() {
		const bgEl = document.querySelector('.pricing-hero-background');
		if (!bgEl) return; // only run on pricing page

		const heroImages = [
			'cyan-monster-fish-1-left.png',
			'cyan-monster-fish-2-right.png',
			'cyan-monster-fish-3-left.png'
		];

		try {
			const key = 'pricingHeroImageIndex';
			const lastIndex = parseInt(localStorage.getItem(key) || '-1', 10);
			const nextIndex = isNaN(lastIndex) ? 0 : (lastIndex + 1) % heroImages.length;
			localStorage.setItem(key, String(nextIndex));
			bgEl.style.backgroundImage = `url('${heroImages[nextIndex]}')`;
		} catch (e) {
			// Fallback to random if localStorage unavailable
			const idx = Math.floor(Math.random() * heroImages.length);
			bgEl.style.backgroundImage = `url('${heroImages[idx]}')`;
		}
	})();

    // Advanced Features Toggle
    const advancedFeaturesToggle = document.getElementById('toggle-advanced-features');
    const advancedFeaturesSection = document.getElementById('advanced-features');
    
    if (advancedFeaturesToggle && advancedFeaturesSection) {
        advancedFeaturesToggle.addEventListener('click', function() {
            const isVisible = advancedFeaturesSection.style.display !== 'none';
            
            if (isVisible) {
                advancedFeaturesSection.style.display = 'none';
                advancedFeaturesToggle.textContent = 'View Advanced Features';
                // Scroll to toggle button after hiding
                setTimeout(() => {
                    advancedFeaturesToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            } else {
                advancedFeaturesSection.style.display = 'block';
                advancedFeaturesToggle.textContent = 'Hide Advanced Features';
                // Scroll to advanced features section
                setTimeout(() => {
                    advancedFeaturesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    }
    
    // Handle nested input visibility for advanced features
    const featureCheckboxes = document.querySelectorAll('#advanced-features .feature-checkbox');
    
    featureCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const featureGroup = this.closest('.advanced-feature-group');
            const nestedInput = featureGroup.querySelector('.nested-input');
            
            if (nestedInput) {
                if (this.checked) {
                    nestedInput.style.display = 'block';
                } else {
                    nestedInput.style.display = 'none';
                    // Clear any input values when hiding
                    nestedInput.querySelectorAll('input, select, textarea').forEach(input => {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            // Don't clear radio buttons or checkboxes
                        } else {
                            input.value = '';
                        }
                    });
                }
            }
        });
    });
    
    // Initialize Interactive Pricing
    initInteractivePricing();
});

// Initialize Interactive Pricing
function initInteractivePricing() {
    // Pricing data for optional features
    const optionalFeatures = [
        { id: 'database-integration', name: 'Database Integration', description: 'Store and manage data like user accounts, products, bookings', price: 200 },
        { id: 'payment-processing', name: 'Payment Processing', description: 'Accept credit cards, subscriptions, or one-time payments', price: 250 },
        { id: 'user-authentication', name: 'User Authentication System', description: 'User registration, login, password management, and role-based access', price: 300 },
        { id: 'api-integrations', name: 'API Integrations', description: 'Connect to external services like Calendly, Google Analytics, social media feeds', price: 150 },
        { id: 'ecommerce', name: 'E-commerce Functionality', description: 'Online store with product catalog, shopping cart, and checkout system', price: 400 },
        { id: 'booking-system', name: 'Booking/Appointment System', description: 'Online scheduling for services, appointments, or reservations', price: 350 },
        { id: 'content-management', name: 'Advanced Content Management', description: 'Easy-to-use interface for updating content without coding knowledge', price: 200 },
        { id: 'analytics-dashboard', name: 'Custom Analytics Dashboard', description: 'Track visitors, conversions, and other key metrics with visual reports', price: 180 }
    ];
    
    // Base pricing
    const STANDARD_PRICE = 150;
    const MONTHLY_HOSTING = 29;
    const ANNUAL_HOSTING = 290;
    
    const container = document.querySelector('.optional-features-container');
    if (!container) return;
    
    // Create feature items with nested inputs
    optionalFeatures.forEach(feature => {
        const item = document.createElement('div');
        item.className = 'optional-feature-item';
        item.dataset.featureId = feature.id;
        
        // Create nested input HTML based on feature type
        let nestedInput = '';
        if (feature.id === 'database-integration') {
            nestedInput = `
                <div class="nested-input" id="${feature.id}-details" style="display: none;">
                    <label for="${feature.id}-type">What type of data will you be storing?</label>
                    <textarea id="${feature.id}-type" name="${feature.id}_type" class="glass-input" rows="2" 
                        placeholder="E.g., user profiles, product inventory, booking information..."></textarea>
                </div>
            `;
        } else if (feature.id === 'payment-processing') {
            nestedInput = `
                <div class="nested-input" id="${feature.id}-details" style="display: none;">
                    <label>Payment Type Needed:</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="payment_type" value="one-time">
                            <span>One-time payments</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="payment_type" value="subscriptions">
                            <span>Recurring subscriptions</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="payment_type" value="both">
                            <span>Both</span>
                        </label>
                    </div>
                </div>
            `;
        } else if (feature.id === 'user-authentication') {
            nestedInput = `
                <div class="nested-input" id="${feature.id}-details" style="display: none;">
                    <label for="${feature.id}-roles">Describe the user roles needed:</label>
                    <input type="text" id="${feature.id}-roles" name="${feature.id}_roles" class="glass-input" 
                        placeholder="E.g., Admin, Members, Customers...">
                </div>
            `;
        } else if (feature.id === 'api-integrations') {
            nestedInput = `
                <div class="nested-input" id="${feature.id}-details" style="display: none;">
                    <label for="${feature.id}-num">Number of API Integrations Needed:</label>
                    <select id="${feature.id}-num" name="${feature.id}_num" class="glass-input">
                        <option value="">Select...</option>
                        <option value="1">1 integration</option>
                        <option value="2">2 integrations</option>
                        <option value="3">3 integrations</option>
                        <option value="4-5">4-5 integrations</option>
                        <option value="6+">6+ integrations</option>
                    </select>
                    <label for="${feature.id}-services" style="margin-top: 15px;">Which services do you need to integrate?</label>
                    <textarea id="${feature.id}-services" name="${feature.id}_services" class="glass-input" rows="2" 
                        placeholder="E.g., Calendly for scheduling, Google Analytics, social media feeds..."></textarea>
                </div>
            `;
        } else if (feature.id === 'ecommerce') {
            nestedInput = `
                <div class="nested-input" id="${feature.id}-details" style="display: none;">
                    <label for="${feature.id}-num-products">Estimated Number of Products:</label>
                    <select id="${feature.id}-num-products" name="${feature.id}_num_products" class="glass-input">
                        <option value="">Select...</option>
                        <option value="1-10">1-10 products</option>
                        <option value="11-50">11-50 products</option>
                        <option value="51-100">51-100 products</option>
                        <option value="100+">100+ products</option>
                    </select>
                </div>
            `;
        }
        
        item.innerHTML = `
            <div class="optional-feature-left">
                <input type="checkbox" class="optional-feature-checkbox" id="${feature.id}-price">
                <div class="optional-feature-info">
                    <div class="optional-feature-name">${feature.name}</div>
                    <div class="optional-feature-description">${feature.description}</div>
                </div>
            </div>
            <div class="optional-feature-price">$${feature.price}</div>
            ${nestedInput}
        `;
        container.appendChild(item);
    });
    
    // Handle feature checkbox changes and item clicks
    const featureCheckboxes = document.querySelectorAll('.optional-feature-checkbox');
    featureCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.optional-feature-item');
            if (this.checked) {
                item.classList.add('selected');
                // Show nested input if it exists
                const nestedInput = item.querySelector('.nested-input');
                if (nestedInput) {
                    nestedInput.style.display = 'block';
                }
            } else {
                item.classList.remove('selected');
                // Hide nested input and clear values
                const nestedInput = item.querySelector('.nested-input');
                if (nestedInput) {
                    nestedInput.style.display = 'none';
                    // Clear input values
                    nestedInput.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea').forEach(input => {
                        input.value = '';
                    });
                }
            }
            updateTotal();
        });
    });
    
    // Make entire item clickable
    const featureItems = document.querySelectorAll('.optional-feature-item');
    featureItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't toggle if clicking directly on checkbox or inside nested input
            if (e.target.type !== 'checkbox' && !e.target.closest('.nested-input')) {
                const checkbox = this.querySelector('.optional-feature-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
        });
    });
    
    // Handle hosting radio button changes
    const hostingRadios = document.querySelectorAll('input[name="hosting"]');
    
    // Add selected class to hosting cards
    function updateHostingSelection() {
        hostingRadios.forEach(radio => {
            const card = radio.closest('.hosting-card');
            if (radio.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        updateTotal();
    }
    
    // Listen for changes on all radio buttons
    hostingRadios.forEach(radio => {
        radio.addEventListener('change', updateHostingSelection);
    });
    
    // Get hosting elements for later use
    const monthlyHosting = document.getElementById('monthly-hosting');
    const annualHosting = document.getElementById('annual-hosting');
    const noHosting = document.getElementById('no-hosting');
    
    // Update total function
    function updateTotal() {
        let total = STANDARD_PRICE;
        const itemizedList = [];
        itemizedList.push(`Standard Features: $${STANDARD_PRICE}`);
        
        // Add optional features
        featureCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const item = checkbox.closest('.optional-feature-item');
                const featureId = item.dataset.featureId;
                const feature = optionalFeatures.find(f => f.id === featureId);
                if (feature) {
                    total += feature.price;
                    itemizedList.push(`${feature.name}: $${feature.price}`);
                    // include nested input details if present
                    const nestedInput = item.querySelector('.nested-input');
                    if (nestedInput) {
                        const nestedFields = nestedInput.querySelectorAll('input, select, textarea');
                        nestedFields.forEach(field => {
                            if (field.value && (field.type !== 'radio' || field.checked)) {
                                const label = field.closest('label');
                                const fieldLabel = label ? label.textContent.trim().replace(field.value, '').replace(':', '').trim() : field.getAttribute('name') || 'Details';
                                if (field.type === 'radio' && field.checked) {
                                    itemizedList.push(`  └─ ${fieldLabel}: ${field.value}`);
                                } else if (field.type !== 'radio') {
                                    itemizedList.push(`  └─ ${fieldLabel}: ${field.value}`);
                                }
                            }
                        });
                    }
                }
            }
        });
        
        // Add hosting (radio buttons)
        const selectedHosting = document.querySelector('input[name="hosting"]:checked');
        if (selectedHosting) {
            if (selectedHosting.id === 'monthly-hosting') {
                total += MONTHLY_HOSTING;
                itemizedList.push(`Monthly Hosting: $${MONTHLY_HOSTING}/month`);
            } else if (selectedHosting.id === 'annual-hosting') {
                total += ANNUAL_HOSTING;
                itemizedList.push(`Annual Hosting: $${ANNUAL_HOSTING}/year`);
            }
            // No hosting adds $0, so no need to add anything
            if (selectedHosting.id === 'no-hosting') {
                itemizedList.push('No Hosting Needed: $0');
            }
        }
        
        // Update display
        const totalElement = document.getElementById('total-amount');
        if (totalElement) {
            totalElement.textContent = `$${total}`;
        }
        // Update floating total badge
        const floatingTotal = document.getElementById('floating-total');
        if (floatingTotal) {
            floatingTotal.textContent = `$${total}`;
        }

        // Update live quote list
        const liveList = document.getElementById('quote-live-list');
        if (liveList) {
            let html = '';
            itemizedList.forEach(item => {
                if (item.includes('└─')) {
                    const parts = item.split(': ');
                    html += `<li style="padding-left: 1.5rem; color: var(--text-light);"><span class="item-name">${parts[0]}</span><span class="item-price">${parts[1] || ''}</span></li>`;
                } else if (item.includes(': ')) {
                    const parts = item.split(': ');
                    html += `<li><span class="item-name">${parts[0]}</span><span class="item-price">${parts[1]}</span></li>`;
                } else {
                    html += `<li><span class="item-name">${item}</span><span class="item-price"></span></li>`;
                }
            });
            liveList.innerHTML = html;
        }
    }
    
    // Handle submit button
    const submitBtn = document.getElementById('submit-quote');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Re-select elements to ensure they're accessible
            const monthlyHosting = document.getElementById('monthly-hosting');
            const annualHosting = document.getElementById('annual-hosting');
            const noHosting = document.getElementById('no-hosting');
            const featureCheckboxes = document.querySelectorAll('.optional-feature-checkbox');
            
            // Build itemized list
            let itemizedList = [];
            let itemizedTotal = 0;
            
            // Standard Features - Always included
            itemizedList.push(`Standard Features: $${STANDARD_PRICE}`);
            itemizedTotal = STANDARD_PRICE;
            
            // Optional Features
            featureCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const item = checkbox.closest('.optional-feature-item');
                    const featureId = item.dataset.featureId;
                    const feature = optionalFeatures.find(f => f.id === featureId);
                    if (feature) {
                        itemizedList.push(`${feature.name}: $${feature.price}`);
                        itemizedTotal += feature.price;
                        
                        // Collect nested input details
                        const nestedInput = item.querySelector('.nested-input');
                        if (nestedInput) {
                            const nestedFields = nestedInput.querySelectorAll('input, select, textarea');
                            nestedFields.forEach(field => {
                                if (field.value && (field.type !== 'radio' || field.checked)) {
                                    const label = field.closest('label');
                                    const fieldLabel = label ? label.textContent.trim().replace(field.value, '').replace(':', '').trim() : field.getAttribute('name') || 'Details';
                                    if (field.type === 'radio' && field.checked) {
                                        itemizedList.push(`  └─ ${fieldLabel}: ${field.value}`);
                                    } else if (field.type !== 'radio') {
                                        itemizedList.push(`  └─ ${fieldLabel}: ${field.value}`);
                                    }
                                }
                            });
                        }
                    }
                }
            });
            
            // Hosting (radio buttons)
            const selectedHosting = document.querySelector('input[name="hosting"]:checked');
            if (selectedHosting) {
                if (selectedHosting.id === 'monthly-hosting') {
                    itemizedList.push(`Monthly Hosting: $${MONTHLY_HOSTING}/month`);
                    itemizedTotal += MONTHLY_HOSTING;
                } else if (selectedHosting.id === 'annual-hosting') {
                    itemizedList.push(`Annual Hosting: $${ANNUAL_HOSTING}/year`);
                    itemizedTotal += ANNUAL_HOSTING;
                } else if (selectedHosting.id === 'no-hosting') {
                    itemizedList.push(`No Hosting Needed: $0`);
                }
            }
            
            // Debug: log the itemized list
            console.log('Itemized List:', itemizedList);
            console.log('Total:', itemizedTotal);
            
            // Build the HTML for the modal
            let html = '<div class="quote-itemized-content">';
            html += '<h3 style="margin-bottom: 1.5rem; color: var(--text-dark); font-size: 1.25rem; font-weight: 700;">Your Selected Items:</h3>';
            html += '<ul class="quote-itemized-list">';
            
            for (let item of itemizedList) {
                // Parse different formats
                let name, price;
                
                // Handle items with ": " separator
                if (item.includes(': ')) {
                    const parts = item.split(': ');
                    name = parts[0];
                    // Check if remaining part has $ or is already formatted
                    if (parts[1].startsWith('$')) {
                        price = parts[1];
                    } else {
                        // Check for special cases like " └─ Details: info"
                        if (item.includes('└─')) {
                            // This is a nested detail, format differently
                            html += `<li style="padding-left: 1.5rem; color: var(--text-light); font-size: 0.9rem;"><span class="item-name">${parts[0].trim()}</span><span class="item-price" style="font-weight: 400;">${parts[1]}</span></li>`;
                            continue;
                        } else {
                            price = '$' + parts[1];
                        }
                    }
                } else {
                    // Fallback
                    name = item;
                    price = '';
                }
                
                html += `<li><span class="item-name">${name}</span><span class="item-price">${price}</span></li>`;
            }
            
            html += '</ul>';
            html += '</div>';
            html += `<div class="quote-total" style="margin-top: 2rem;"><span class="quote-total-label">Estimated Total</span><span class="quote-total-amount">$${itemizedTotal}</span></div>`;
            
            // Store latest quote for final submission
            window.latestQuote = { items: itemizedList, total: itemizedTotal };

            // Populate modal and show it
            const modalContent = document.getElementById('quote-modal-content');
            const modal = document.getElementById('quote-modal');
            
            console.log('Generated HTML:', html);
            
            modalContent.innerHTML = html;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Setup modal close handlers (only needs to be done once)
    const modal = document.getElementById('quote-modal');
    const closeBtn = document.getElementById('close-quote-modal');
    const overlay = document.querySelector('.quote-modal-overlay');
    const finalSubmitBtn = document.getElementById('submit-quote-final');
    
    function closeQuoteModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuoteModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeQuoteModal);
    }
    
    if (finalSubmitBtn) {
        finalSubmitBtn.addEventListener('click', function() {
            const emailInput = document.getElementById('quote-email');
            const email = emailInput ? emailInput.value.trim() : '';
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!isValidEmail) {
                if (emailInput) {
                    emailInput.focus();
                    emailInput.classList.add('error');
                    setTimeout(() => emailInput.classList.remove('error'), 1500);
                }
                return;
            }

            const payload = {
                email,
                items: (window.latestQuote && window.latestQuote.items) ? window.latestQuote.items : [],
                total: (window.latestQuote && window.latestQuote.total) ? window.latestQuote.total : 0
            };

            const modalContent = document.getElementById('quote-modal-content');

            fetch('api/send-quote.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(r => r.json())
            .then(res => {
                if (res && res.success) {
                    if (modalContent) {
                        modalContent.innerHTML = `
                            <div class="quote-success-message">
                                <h3>✓ Quote Submitted!</h3>
                                <p>Thank you! Your draft quote has been submitted successfully.</p>
                                <p>A copy will be sent to ${email}.</p>
                                <p>You will hear back from Peculiette within 24 hours.</p>
                            </div>
                        `;
                    }
                } else {
                    if (modalContent) {
                        const msg = (res && res.message) ? res.message : 'Failed to send email. Please try again later.';
                        modalContent.innerHTML = `
                            <div class="quote-success-message">
                                <h3>Submission Error</h3>
                                <p>${msg}</p>
                            </div>
                        `;
                    }
                }
                setTimeout(() => { closeQuoteModal(); }, 3000);
            })
            .catch(() => {
                if (modalContent) {
                    modalContent.innerHTML = `
                        <div class="quote-success-message">
                            <h3>Submission Error</h3>
                            <p>Network error. Please try again later.</p>
                        </div>
                    `;
                }
                setTimeout(() => { closeQuoteModal(); }, 3000);
            });
        });
    }
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;
    
    // Easing function for smooth deceleration
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            projectType: document.getElementById('project-type').value,
            message: document.getElementById('message').value.trim(),
            newsletter: document.getElementById('newsletter').checked
        };

        // Basic validation (only name and email required)
        if (!formData.name || !formData.email) {
            showMessage('Please enter your name and email.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission (replace with actual API call)
        showMessage('Submitting your request...', 'success');
        
        // Reset form after a delay
        setTimeout(function() {
            contactForm.reset();
            showMessage('Thank you! Your request has been submitted. I will get back to you within 24 hours.', 'success');
        }, 1500);

        // In production, you would make an actual API call here:
        // fetch('api/contact.php', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         showMessage('Thank you! Your request has been submitted successfully.', 'success');
        //         contactForm.reset();
        //     } else {
        //         showMessage('An error occurred. Please try again later.', 'error');
        //     }
        // })
        // .catch(error => {
        //     showMessage('An error occurred. Please try again later.', 'error');
        // });
    });
}

// Show form messages
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }
});

// Initialize hero effect: rotate between available effect files each visit
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const canvasWrapper = document.getElementById('hero-canvas-effect');
        if (canvasWrapper) {
            canvasWrapper.classList.add('active');
            // List your existing effect files here
            const effectFiles = [
                'effect-drawing-worm.js',
                'liquid-effect/dist/script.js',
                'effect-aurora.js'
            ];
            // Module-based effects (ESM) that must be imported; others are classic scripts
            const moduleEffects = new Set(['liquid-effect/dist/script.js']);

            const key = 'landingHeroEffectIndex';
            let idx = parseInt(localStorage.getItem(key) || '-1', 10);
            idx = isNaN(idx) ? 0 : (idx + 1) % effectFiles.length;
            localStorage.setItem(key, String(idx));
            const fileToLoad = effectFiles[idx];

            if (moduleEffects.has(fileToLoad)) {
                // Create a child canvas element with id expected by the module ('canvas')
                let canv = document.getElementById('canvas');
                if (!canv) {
                    canv = document.createElement('canvas');
                    canv.id = 'canvas';
                    canv.style.width = '100%';
                    canv.style.height = '100%';
                    canvasWrapper.appendChild(canv);
                }
                import(`./${fileToLoad}`).then(() => {
                    // Remove any demo labels containing the word 'liquid' in any form; also restore page title
                    setTimeout(() => {
                        try { document.title = 'Peculiette'; } catch(e) {}
                        const nodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, section, header, footer'));
                        nodes.forEach(el => {
                            const text = (el.textContent || '').toLowerCase();
                            if (text && /\bliquid\b/.test(text)) {
                                try { el.remove(); } catch(e) {}
                            }
                        });
                    }, 0);
                }).catch(() => {
                    // Fallback: remove module canvas and initialize worm effect
                    try { canv.remove(); } catch(e) {}
                    if (typeof window.DrawingWormEffect === 'function') {
                        new window.DrawingWormEffect('hero-canvas-effect');
                    }
                });
            } else {
                // Classic effect path (e.g., Drawing Worm)
                // Clean any leftover canvases inside the wrapper first
                try {
                    Array.from(canvasWrapper.querySelectorAll('canvas')).forEach(c => c.remove());
                } catch (e) {}

                // If the constructor is already present (script included in HTML), instantiate immediately
                if (typeof window.DrawingWormEffect === 'function') {
                    new window.DrawingWormEffect('hero-canvas-effect');
                } else {
                    // Otherwise, load the script and then instantiate
                    const script = document.createElement('script');
                    script.src = fileToLoad;
                    script.onload = function() {
                        if (typeof window.initHeroEffect === 'function') {
                            window.initHeroEffect('hero-canvas-effect');
                            return;
                        }
                        if (typeof window.DrawingWormEffect === 'function') {
                            new window.DrawingWormEffect('hero-canvas-effect');
                        }
                    };
                    script.onerror = function() {
                        if (typeof window.DrawingWormEffect === 'function') {
                            new window.DrawingWormEffect('hero-canvas-effect');
                        }
                    };
                    document.body.appendChild(script);
                }
            }
        }
    }, 100);
    
    // Multi-Step Form Modal Logic
    const modal = document.getElementById('request-form-modal');
    const openBtn = document.getElementById('open-request-form');
    const openBtn2 = document.getElementById('open-request-form-2');
    const closeBtn = document.getElementById('close-modal');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const submitBtn = document.getElementById('submit-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    let currentStep = 1;
    const totalSteps = formSteps.length;
    
    // Open modal function
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Open modal from either button
    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }
    if (openBtn2) {
        openBtn2.addEventListener('click', openModal);
    }
    
    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Next step
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateFormDisplay();
                }
            }
        });
    }
    
    // Previous step
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                updateFormDisplay();
            }
        });
    }
    
    // Update form display based on current step
    function updateFormDisplay() {
        // Show/hide form steps
        formSteps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update progress indicator
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
        submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    }
    
    // Validate current step
    function validateCurrentStep() {
        const activeStep = document.querySelector('.form-step.active');
        const requiredFields = activeStep.querySelectorAll('input[required], select[required], textarea[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                showStatus('Please fill in all required fields.', 'error');
                return false;
            }
        }
        
        return true;
    }
    
    // Show status message
    const statusDiv = document.getElementById('form-status');
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'form-status ' + type;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
    
    // Form submission
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateCurrentStep()) {
                // Collect all form data
                const formData = new FormData(document.getElementById('website-request-form'));
                
                // Show success message
                showStatus('Thank you! Your request has been submitted. We will get back to you within 24 hours.', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    document.getElementById('website-request-form').reset();
                    currentStep = 1;
                    updateFormDisplay();
                    closeModal();
                }, 2000);
            }
        });
    }
});

