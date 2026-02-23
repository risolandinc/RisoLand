// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Analytics System
const analytics = {
    events: [],
    track: function(eventName, data = {}) {
        const event = {
            event: eventName,
            timestamp: new Date().toISOString(),
            data: data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        this.events.push(event);
        console.log('Analytics Event:', event);

        // In a real implementation, this would send to an analytics service
        // Example: gtag('event', eventName, data);
    },
    trackPageView: function() {
        this.track('page_view', {
            title: document.title,
            referrer: document.referrer
        });
    },
    trackButtonClick: function(buttonText, section) {
        this.track('button_click', {
            button_text: buttonText,
            section: section
        });
    }
};

// Initialize analytics
document.addEventListener('DOMContentLoaded', function() {
    analytics.trackPageView();

    // Track order button clicks
    const orderButtons = document.querySelectorAll('a[href*="order"], a[href*="pesan"], button');
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const section = this.closest('section') ? this.closest('section').id : 'unknown';
            analytics.trackButtonClick(buttonText, section);
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.flex.space-x-4 a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.querySelector('svg') ? 'social_media' : 'unknown';
            analytics.track('social_click', {
                platform: platform,
                href: this.href
            });
        });
    });

    // Track navigation clicks
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            analytics.track('navigation_click', {
                text: this.textContent.trim(),
                href: this.getAttribute('href')
            });
        });
    });
});

// Error handling
window.addEventListener('error', function(e) {
    analytics.track('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Performance tracking
window.addEventListener('load', function() {
    const perfData = performance.getEntriesByType('navigation')[0];
    analytics.track('page_load_performance', {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart
    });
});

// Image Modal Functions
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
}

// Close modal when clicking outside the image or on the close button
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

// Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});

// Filter Products Function
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update button active state
    buttons.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('bg-orange-600', 'text-white');
            btn.classList.remove('bg-white', 'text-orange-600', 'border', 'border-orange-300');
        } else {
            btn.classList.remove('bg-orange-600', 'text-white');
            btn.classList.add('bg-white', 'text-orange-600', 'border', 'border-orange-300');
        }
    });
    
    // Filter products
    products.forEach(product => {
        const productCategory = product.dataset.category;
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
            product.classList.add('animate__animated', 'animate__fadeIn');
        } else {
            product.style.display = 'none';
        }
    });
}
