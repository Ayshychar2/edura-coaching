// Edura Coaching - Shared Application Script (app.js)
// Implements interactive features: Mobile Nav, Shopping Cart, Auth Modal, and Toast Notifications

document.addEventListener('DOMContentLoaded', () => {
    injectCustomStyles();
    initMobileNav();
    initAuthModal();
    initShoppingCart();
    updateCartBadges();
});

// 1. DYNAMIC STYLES INJECTION
function injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Modal and Overlay transitions */
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-out-right { animation: slideOutRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes fadeIn {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
        }
        
        /* Toast Notification Styling */
        .toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
        }
        .toast-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border-left: 4px solid #004ac6;
            border-radius: 12px;
            padding: 16px 20px;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 10px 25px -5px rgba(30, 41, 59, 0.1), 0 8px 10px -6px rgba(30, 41, 59, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(120%);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
        }
        .toast-card.show { transform: translateX(0); }
        .toast-card.error { border-left-color: #ba1a1a; }
        .toast-card.success { border-left-color: #712ae2; }
    `;
    document.head.appendChild(style);
}

// 2. TOAST NOTIFICATION SYSTEM
function showToast(message, type = 'primary') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-card ${type}`;
    
    let icon = 'info';
    let iconColor = 'text-primary';
    if (type === 'success') {
        icon = 'task_alt';
        iconColor = 'text-secondary';
    } else if (type === 'error') {
        icon = 'error';
        iconColor = 'text-error';
    }
    
    toast.innerHTML = `
        <span class="material-symbols-outlined ${iconColor}">${icon}</span>
        <div class="flex-grow font-body-md text-body-md text-on-surface">${message}</div>
        <button class="text-on-surface-variant hover:text-on-surface ml-2">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 50);
    
    // Auto remove
    const removeTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
    
    // Close button click
    toast.querySelector('button').addEventListener('click', () => {
        clearTimeout(removeTimeout);
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    });
}

// 3. MOBILE NAVIGATION DRAWER
function initMobileNav() {
    // Fallback menu toggle detection by looking for menu icons inside buttons
    let menuBtn = null;
    document.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.includes('menu') || (btn.querySelector('.material-symbols-outlined') && btn.querySelector('.material-symbols-outlined').innerText.includes('menu'))) {
            menuBtn = btn;
        }
    });

    if (!menuBtn) return;

    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileMenu();
    });
}

function openMobileMenu() {
    // Check if already open
    if (document.getElementById('mobile-menu-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'mobile-menu-drawer';
    drawer.className = 'fixed inset-0 z-[100] flex justify-end';
    
    drawer.innerHTML = `
        <div class="fixed inset-0 bg-inverse-surface/30 backdrop-blur-sm fade-in"></div>
        <div class="relative w-80 max-w-full bg-surface h-full shadow-2xl flex flex-col p-6 slide-in-right border-l border-outline-variant/30">
            <div class="flex justify-between items-center mb-8">
                <span class="text-headline-sm font-headline-sm font-extrabold text-primary">Edura Menu</span>
                <button id="close-mobile-menu" class="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <nav class="flex flex-col gap-6 text-body-lg font-label-md">
                <a class="hover:text-primary transition-colors py-2 border-b border-outline-variant/20" href="index.html">Home</a>
                <a class="hover:text-primary transition-colors py-2 border-b border-outline-variant/20" href="courses.html">Explore Courses</a>
                <a class="hover:text-primary transition-colors py-2 border-b border-outline-variant/20" href="instructors.html">Our Teachers</a>
                <a class="hover:text-primary transition-colors py-2 border-b border-outline-variant/20" href="contact.html">Contact Us</a>
                <a class="hover:text-primary transition-colors py-2 border-b border-outline-variant/20" href="platform.html">Dashboard</a>
            </nav>
            <div class="mt-auto flex flex-col gap-4">
                <button class="mobile-login-btn font-label-md text-label-md text-primary border border-primary py-3 rounded-xl hover:bg-surface-container-high transition-colors">Login</button>
                <button class="mobile-join-btn font-label-md text-label-md bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md">Join Now</button>
            </div>
        </div>
    `;

    document.body.appendChild(drawer);
    document.body.style.overflow = 'hidden';

    // Hook events
    const closeBtn = drawer.querySelector('#close-mobile-menu');
    const bgOverlay = drawer.querySelector('.fade-in');
    
    const closeDrawer = () => {
        const pane = drawer.querySelector('.slide-in-right');
        pane.classList.remove('slide-in-right');
        pane.classList.add('slide-out-right');
        bgOverlay.style.opacity = '0';
        bgOverlay.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            drawer.remove();
            document.body.style.overflow = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeDrawer);
    bgOverlay.addEventListener('click', closeDrawer);

    // Wire up Login/Register from mobile menu
    drawer.querySelector('.mobile-login-btn').addEventListener('click', () => {
        closeDrawer();
        openAuthModal('login');
    });
    drawer.querySelector('.mobile-join-btn').addEventListener('click', () => {
        closeDrawer();
        openAuthModal('register');
    });
}

// 4. LOGIN & REGISTRATION MODAL
function initAuthModal() {
    // Intercept all Login/Join/Join Now links or buttons
    document.querySelectorAll('a, button').forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        if (text === 'login') {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal('login');
            });
        } else if (text === 'join now' || text === 'join') {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal('register');
            });
        }
    });
}

function openAuthModal(defaultTab = 'login') {
    if (document.getElementById('auth-modal-overlay')) return;

    const modal = document.createElement('div');
    modal.id = 'auth-modal-overlay';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
    
    modal.innerHTML = `
        <div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-md fade-in"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-outline-variant/30 transform transition-all duration-300 scale-95 opacity-0 flex flex-col p-8 z-10">
            <button id="close-auth-modal" class="absolute top-4 right-4 p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
                <span class="material-symbols-outlined">close</span>
            </button>
            
            <!-- Tabs -->
            <div class="flex border-b border-outline-variant mb-6 mt-4">
                <button id="tab-login" class="flex-1 pb-3 text-center font-label-md text-label-md border-b-2 transition-all duration-200">Sign In</button>
                <button id="tab-register" class="flex-1 pb-3 text-center font-label-md text-label-md border-b-2 transition-all duration-200">Register</button>
            </div>
            
            <!-- Form Container -->
            <form id="auth-form" class="space-y-4">
                <div id="register-fields" class="space-y-4 hidden">
                    <div class="flex flex-col gap-1">
                        <label class="font-label-md text-label-md text-tertiary" for="auth-name">Full Name</label>
                        <input class="px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-on-surface" id="auth-name" placeholder="Alex Morgan" type="text">
                    </div>
                </div>
                
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-tertiary" for="auth-email">Email Address</label>
                    <input class="px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-on-surface" id="auth-email" placeholder="alex@example.com" required type="email">
                </div>
                
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-tertiary" for="auth-password">Password</label>
                    <input class="px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-on-surface" id="auth-password" placeholder="••••••••" required type="password">
                </div>
                
                <div class="flex items-center justify-between pt-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input class="rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface" type="checkbox">
                        <span class="font-body-md text-body-md text-on-surface-variant">Remember me</span>
                    </label>
                    <a class="font-label-sm text-label-sm text-primary hover:underline" href="#">Forgot Password?</a>
                </div>
                
                <button type="submit" id="auth-submit-btn" class="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl hover:bg-primary/95 transition-all shadow-md mt-4">
                    Sign In
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Scale up anim
    const modalPane = modal.querySelector('.relative');
    setTimeout(() => {
        modalPane.classList.remove('scale-95', 'opacity-0');
        modalPane.classList.add('scale-100', 'opacity-100');
    }, 50);

    const closeBtn = modal.querySelector('#close-auth-modal');
    const bgOverlay = modal.querySelector('.fade-in');
    const loginTab = modal.querySelector('#tab-login');
    const registerTab = modal.querySelector('#tab-register');
    const regFields = modal.querySelector('#register-fields');
    const submitBtn = modal.querySelector('#auth-submit-btn');
    const form = modal.querySelector('#auth-form');

    let currentTab = 'login';

    const setTab = (tab) => {
        currentTab = tab;
        if (tab === 'login') {
            loginTab.className = 'flex-1 pb-3 text-center font-label-md text-label-md border-b-2 border-primary text-primary font-bold';
            registerTab.className = 'flex-1 pb-3 text-center font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant hover:text-on-surface';
            regFields.classList.add('hidden');
            submitBtn.textContent = 'Sign In';
            modal.querySelector('#auth-name').required = false;
        } else {
            registerTab.className = 'flex-1 pb-3 text-center font-label-md text-label-md border-b-2 border-primary text-primary font-bold';
            loginTab.className = 'flex-1 pb-3 text-center font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant hover:text-on-surface';
            regFields.classList.remove('hidden');
            submitBtn.textContent = 'Create Account';
            modal.querySelector('#auth-name').required = true;
        }
    };

    setTab(defaultTab);

    loginTab.addEventListener('click', () => setTab('login'));
    registerTab.addEventListener('click', () => setTab('register'));

    const closeModal = () => {
        modalPane.classList.remove('scale-100', 'opacity-100');
        modalPane.classList.add('scale-95', 'opacity-0');
        bgOverlay.style.opacity = '0';
        bgOverlay.style.transition = 'opacity 0.2s ease-out';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    bgOverlay.addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = modal.querySelector('#auth-email').value;
        const name = modal.querySelector('#auth-name').value || 'Student';
        
        closeModal();
        if (currentTab === 'login') {
            showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
        } else {
            showToast(`Account successfully created! Welcome, ${name}.`, 'success');
        }
        
        // Simulating redirect to Dashboard
        setTimeout(() => {
            window.location.href = 'platform.html';
        }, 1200);
    });
}

// 5. SHOPPING CART SYSTEM
function initShoppingCart() {
    // Fallback cart trigger finder
    document.querySelectorAll('button, a').forEach(el => {
        if (el.innerHTML.includes('shopping_cart')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openCartDrawer();
            });
        }
    });
}

function openCartDrawer() {
    if (document.getElementById('cart-drawer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cart-drawer-overlay';
    overlay.className = 'fixed inset-0 z-[150] flex justify-end';
    
    overlay.innerHTML = `
        <div class="fixed inset-0 bg-inverse-surface/30 backdrop-blur-sm fade-in"></div>
        <div class="relative w-96 max-w-full bg-surface h-full shadow-2xl flex flex-col p-6 slide-in-right border-l border-outline-variant/30">
            <div class="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">shopping_cart</span>
                    <span class="text-headline-sm font-headline-sm font-bold text-on-surface">Your Cart</span>
                </div>
                <button id="close-cart-drawer" class="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <!-- Items Area -->
            <div id="cart-items-list" class="flex-grow overflow-y-auto space-y-4 mb-6 pr-1">
                <!-- Cart Items are populated dynamically -->
            </div>
            
            <!-- Summary Area -->
            <div class="border-t border-outline-variant pt-4 space-y-4 mt-auto">
                <div class="flex justify-between font-label-md text-label-md text-on-surface-variant">
                    <span>Subtotal</span>
                    <span id="cart-subtotal">$0.00</span>
                </div>
                <div class="flex justify-between font-headline-sm text-headline-sm font-bold text-on-surface">
                    <span>Total</span>
                    <span id="cart-total">$0.00</span>
                </div>
                <button id="cart-checkout-btn" class="w-full bg-primary text-white font-label-md text-label-md py-4 rounded-xl hover:bg-primary-fixed-variant transition-colors shadow-md flex justify-center items-center gap-2">
                    Checkout Now
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeBtn = overlay.querySelector('#close-cart-drawer');
    const bgOverlay = overlay.querySelector('.fade-in');
    
    const closeDrawer = () => {
        const pane = overlay.querySelector('.slide-in-right');
        pane.classList.remove('slide-in-right');
        pane.classList.add('slide-out-right');
        bgOverlay.style.opacity = '0';
        bgOverlay.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeDrawer);
    bgOverlay.addEventListener('click', closeDrawer);

    // Populate items
    renderCartItems(overlay);

    // Checkout handler
    overlay.querySelector('#cart-checkout-btn').addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
            showToast("Your cart is empty!", "error");
            return;
        }
        
        // Checkout successful!
        closeDrawer();
        showToast("Enrolling you in courses...", "success");
        
        // Save to enrolled courses in dashboard
        const enrolled = getEnrolled();
        cart.forEach(course => {
            if (!enrolled.some(c => c.id === course.id)) {
                enrolled.push({
                    id: course.id,
                    title: course.title,
                    instructor: course.instructor || "Expert Mentor",
                    progress: 0,
                    lessons: course.lessons || "12 Lessons",
                    image: course.image || "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
                });
            }
        });
        localStorage.setItem('enrolled_courses', JSON.stringify(enrolled));
        
        // Clear Cart
        localStorage.setItem('shopping_cart', JSON.stringify([]));
        updateCartBadges();
        
        setTimeout(() => {
            window.location.href = 'platform.html';
        }, 1200);
    });
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('shopping_cart')) || [];
    } catch {
        return [];
    }
}

function getEnrolled() {
    try {
        return JSON.parse(localStorage.getItem('enrolled_courses')) || [];
    } catch {
        // Return default courses if nothing enrolled yet
        return [
            {
                id: 1,
                title: "Learn Figma - UI/UX Design Essential Training",
                instructor: "Sarah Jenkins",
                progress: 68,
                lessons: "8 Lessons",
                image: "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
            },
            {
                id: 2,
                title: "Complete Full-Stack Web Development Bootcamp",
                instructor: "David Chen",
                progress: 24,
                lessons: "42 Lessons",
                image: "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
            }
        ];
    }
}

function renderCartItems(drawerEl) {
    const listEl = drawerEl.querySelector('#cart-items-list');
    const subtotalEl = drawerEl.querySelector('#cart-subtotal');
    const totalEl = drawerEl.querySelector('#cart-total');
    
    const cart = getCart();
    listEl.innerHTML = '';

    if (cart.length === 0) {
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 text-center text-on-surface-variant space-y-3">
                <span class="material-symbols-outlined text-[48px] opacity-40">shopping_cart_off</span>
                <p class="font-body-lg text-body-lg">Your cart is empty.</p>
                <a href="courses.html" class="text-primary font-label-md text-label-md hover:underline">Browse Courses</a>
            </div>
        `;
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }

    let totalSum = 0;
    cart.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'flex items-center gap-4 bg-white p-3 rounded-xl border border-outline-variant/30';
        
        const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('$', '')) || 0;
        totalSum += priceNum;

        card.innerHTML = `
            <div class="w-16 h-16 rounded-lg bg-surface-variant flex-shrink-0 overflow-hidden">
                <img src="${item.image || 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg'}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <h4 class="font-label-md text-label-md text-on-surface line-clamp-1">${item.title}</h4>
                <p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5">${item.instructor || 'Expert Mentor'}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="font-label-md text-label-md text-primary font-semibold">${priceNum === 0 ? 'FREE' : '$' + priceNum.toFixed(2)}</span>
                    <button class="text-error hover:bg-error-container/20 p-1 rounded transition-colors remove-item-btn" data-index="${index}">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </div>
        `;

        listEl.appendChild(card);
    });

    subtotalEl.textContent = '$' + totalSum.toFixed(2);
    totalEl.textContent = '$' + totalSum.toFixed(2);

    // Bind remove event
    listEl.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'));
            removeFromCart(idx);
            renderCartItems(drawerEl);
            showToast("Course removed from cart.", "info");
        });
    });
}

function addToCart(course) {
    const cart = getCart();
    
    // Check duplicate
    if (cart.some(item => item.id === course.id)) {
        showToast("This course is already in your cart!", "error");
        return;
    }

    cart.push(course);
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    updateCartBadges();
    showToast(`"${course.title}" added to cart!`, "success");
}

function removeFromCart(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    updateCartBadges();
}

function updateCartBadges() {
    const cart = getCart();
    const count = cart.length;

    // Update all badge elements
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.remove(); // Clear existing custom badges
    });

    // Add count to all buttons with class/icon shopping_cart
    document.querySelectorAll('button, a').forEach(el => {
        if (el.innerHTML.includes('shopping_cart')) {
            // Find the shopping_cart container or icon wrapper
            // Ensure relative styling
            el.classList.add('relative');
            
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge bg-error text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center absolute -top-1 -right-1 font-bold px-1';
                badge.textContent = count;
                el.appendChild(badge);
            }
        }
    });
}

// Export function so specific pages can add items
window.EduraCart = {
    add: addToCart,
    get: getCart,
    open: openCartDrawer,
    showToast: showToast
};
