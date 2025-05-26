const createProductCard = (product) => {
    return `
        <div class="product-card" data-aos="fade-up" data-product-id="${product.id}">
            <div class="product-image">
                <div class="image-loader">
                    <div class="spinner"></div>
                </div>
                <img src="${product.image}" 
                     alt="${product.name}"
                     class="product-img"
                     onload="this.parentElement.classList.add('loaded')"
                     onerror="this.src='assets/placeholder.jpg'; this.parentElement.classList.add('loaded')">
                <span class="favorite-icon" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </span>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="size-selector">
                    <select class="size-dropdown" required>
                        <option value="" disabled selected>Select Size</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="2XL">2XL</option>
                    </select>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(this)">Add to Cart</button>
            </div>
        </div>
    `;
};

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Check if we're on the home page
if (document.querySelector('.landing')) {
    // Landing Page Animations
    const landingTimeline = gsap.timeline({
        defaults: {
            ease: 'power3.out',
            duration: 1.2
        }
    });

    // Initial state
    gsap.set(['.main-logo', '.shop-now-btn', '.landing-social'], {
        opacity: 0,
        y: 30
    });

    // Animation sequence
    landingTimeline
        .to('.main-logo', {
            opacity: 1,
            y: 0,
            duration: 1.5
        })
        .to('.shop-now-btn', {
            opacity: 1,
            y: 0,
            duration: 1
        }, '-=0.8')
        .to('.landing-social .social-icon', {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8
        }, '-=0.5');

    // Background Animation
    gsap.to('.background-animation', {
        backgroundPosition: '100% 50%',
        duration: 15,
        repeat: -1,
        ease: 'none'
    });

    // Social Icons Hover Animation
    document.querySelectorAll('.landing-social .social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Shop Now Button Hover Animation
    const shopNowBtn = document.querySelector('.shop-now-btn');
    shopNowBtn.addEventListener('mouseenter', () => {
        gsap.to(shopNowBtn, {
            y: -2,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    shopNowBtn.addEventListener('mouseleave', () => {
        gsap.to(shopNowBtn, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}

// Check if we're on the collections page
if (document.querySelector('.collections-page')) {
    // Products data
    const products = [
        {
            name: 'XKOOZA Classic Tee',
            price: '$49.99',
            image: 'assets/product1.jpg'
        },
        {
            name: 'XKOOZA Hoodie',
            price: '$89.99',
            image: 'assets/product2.jpg'
        },
        {
            name: 'XKOOZA Cap',
            price: '$29.99',
            image: 'assets/product3.jpg'
        },
        {
            name: 'XKOOZA Jacket',
            price: '$129.99',
            image: 'assets/product4.jpg'
        },
        {
            name: 'XKOOZA Pants',
            price: '$79.99',
            image: 'assets/product5.jpg'
        },
        {
            name: 'XKOOZA Backpack',
            price: '$69.99',
            image: 'assets/product6.jpg'
        }
    ];

    // Populate products grid
    const productsGrid = document.querySelector('.products-grid');
    products.forEach(product => {
        productsGrid.innerHTML += createProductCard(product);
    });

    // Product card hover animations
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Social Icons Hover Animation
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
            y: -5,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart Function with improved image handling and color-image sync
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const priceText = productCard.querySelector('.price').textContent;
    const productPrice = parseFloat(priceText.replace('L.E', '').trim());

    // Get quantity from the quantity input
    const quantityInput = productCard.querySelector('.quantity-input');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    // Check for size selection using size squares
    let selectedSize = '';
    const selectedSquare = productCard.querySelector('.size-square.selected');
    if (selectedSquare) {
        selectedSize = selectedSquare.dataset.size;
    }

    // Get the selected color
    let selectedColor = '';
    const selectedColorSquare = productCard.querySelector('.color-square.active');
    if (selectedColorSquare) {
        selectedColor = selectedColorSquare.dataset.color;
    }

    // Get the image corresponding to the selected color (the active image in the slider)
    let imageUrl = '';
    const activeImage = productCard.querySelector('.image-slider img.active') || productCard.querySelector('.image-slider img');
    if (activeImage) {
        imageUrl = activeImage.src;
    } else {
        // fallback to product image if no slider
        const productImage = productCard.querySelector('.product-image img');
        imageUrl = productImage ? productImage.src : '';
    }

    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }

    const totalPrice = productPrice * quantity;

    // Create product details object with the same format as payNow
    const productDetails = {
        name: productName,
        price: productPrice,
        priceFormatted: `${productPrice.toFixed(2)} L.E`,
        totalPrice: totalPrice,
        totalPriceFormatted: `${totalPrice.toFixed(2)} L.E`,
        image: imageUrl,
        size: selectedSize,
        quantity: quantity,
        color: selectedColor
    };

    // Get current cart from localStorage
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    currentCart.push(productDetails);

    // Update localStorage and global cart variable
    localStorage.setItem('cart', JSON.stringify(currentCart));
    cart = currentCart;

    updateCartBadge();
    showToast('Item added to cart successfully!', 'success');

    // Update cart display if we're on the checkout page
    if (document.querySelector('.checkout-section')) {
        displayCartItems();
    }

    // Show the cart sidebar if it's present
    const sidebar = document.querySelector('.cart-sidebar');
    if (sidebar) {
        updateCartSidebar();
        sidebar.classList.add('active');
    }

    // Update hidden form inputs
    const cartItemsInput = document.getElementById('cart-items-input');
    const totalAmountInput = document.getElementById('total-amount-input');

    if (cartItemsInput) {
        cartItemsInput.value = JSON.stringify(currentCart);
    }

    if (totalAmountInput) {
        totalAmountInput.value = totalPrice;
    }
}

// Check for successful form submission when returning from thank you page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart badge
    updateCartBadge();

    // Get the referrer URL
    const referrer = document.referrer;

    // Check if coming back from thank you page
    if (referrer.includes('/thank-you')) {
        // Check which page we're on to show appropriate message
        if (window.location.pathname.includes('checkout')) {
            showToast('Order placed successfully!', 'success');
        } else if (window.location.pathname.includes('contact')) {
            showToast('Message sent successfully!', 'success');
        } else if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            showToast('Thank you for subscribing!', 'success');
        }
    }
});

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Create cart badge if it doesn't exist
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Remove any existing badge first to avoid duplicates
        const existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Create and append the badge
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartIcon.appendChild(badge);

        // Add shopping cart icon if it doesn't exist
        if (!cartIcon.querySelector('.fas.fa-shopping-cart')) {
            const cartIconElement = document.createElement('i');
            cartIconElement.className = 'fas fa-shopping-cart';
            cartIcon.insertBefore(cartIconElement, badge);
        }
    }

    // Update the badge
    updateCartBadge();

    // If we're on the checkout page, display cart items
    if (document.querySelector('.checkout-section')) {
        displayCartItems();
    }

    // Add size selection functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('size-square')) {
            const sizeSelector = e.target.closest('.size-selector');
            // Remove selected class from all squares in this selector
            sizeSelector.querySelectorAll('.size-square').forEach(square => {
                square.classList.remove('selected');
            });
            // Add selected class to clicked square
            e.target.classList.add('selected');
        }
    });
});

// Update Cart Badge
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            cartBadge.style.display = 'none';
        } else {
            cartBadge.textContent = cart.length;
            cartBadge.style.display = 'flex';
        }
    }
}

// Remove item from cart
function removeFromCart(index) {
    // Get current cart
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove item at specified index
    if (index >= 0 && index < currentCart.length) {
        currentCart.splice(index, 1);

        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(currentCart));

        // Update UI
        updateCartBadge();
        displayCartItems();
        showToast('Item removed from cart', 'success');
    }
}

// Show Cart Modal
function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal active';
    modal.innerHTML = `
        <div class="cart-content">
            <button class="close-modal">&times;</button>
            <h3>Item Added to Cart</h3>
            <p>Would you like to continue shopping or proceed to checkout?</p>
            <div class="cart-buttons">
                <button class="cart-btn continue">Continue Shopping</button>
                <button class="cart-btn proceed">Proceed to Checkout</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        showToast('Item added to cart successfully!', 'success');
    });

    modal.querySelector('.continue').addEventListener('click', () => {
        modal.remove();
        showToast('Item added to cart successfully!', 'success');
    });

    modal.querySelector('.proceed').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
}

// Show Toast Notification
function showToast(message, type = 'success') {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Display cart items with proper image loading
function displayCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.total-price');
    const shippingRow = document.getElementById('shipping-row');
    const totalRow = document.getElementById('total-row');
    const checkoutBtn = document.getElementById('showFormBtn');
    const paymentForm = document.getElementById('payment-form');

    if (!cartContainer || !totalElement) return;

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (currentCart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-container">
                <p class="empty-cart-message">Your cart is empty</p>
                <a href="collections.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        totalElement.textContent = '0.00 L.E';
        if (shippingRow) shippingRow.style.display = 'none';
        if (totalRow) totalRow.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        if (paymentForm) paymentForm.style.display = 'none';
        return;
    } else {
        if (shippingRow) shippingRow.style.display = '';
        if (totalRow) totalRow.style.display = '';
        if (checkoutBtn) checkoutBtn.style.display = '';
        if (paymentForm) paymentForm.style.display = '';
    }

    let total = 0;
    cartContainer.innerHTML = currentCart.map((item, index) => {
        const price = item.price || parseFloat(item.priceFormatted?.replace(/[^0-9.]/g, '')) || 0;
        const itemTotal = price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         class="cart-product-img">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <button class="remove-item" onclick="removeFromCart(${index})" aria-label="Remove item">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cart-item-info">
                        <div class="info-row">
                            <span class="info-label">Size:</span>
                            <span class="info-value">${item.size}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Color:</span>
                            <span class="info-value">${item.color}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Quantity:</span>
                            <span class="info-value">${item.quantity}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Price:</span>
                            <span class="info-value">${price.toFixed(2)} L.E</span>
                        </div>
                        <div class="info-row total-row">
                            <span class="info-label">Total:</span>
                            <span class="info-value total-value">${itemTotal.toFixed(2)} L.E</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Remove shipping cost from total calculation
    // const shippingCost = 90;
    // total += shippingCost;

    // Update total price
    totalElement.textContent = `${total.toFixed(2)} L.E`;
}


// Counter Animation
function startCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the value, the faster the animation

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
                // Add percentage sign for the passion counter
                if (target === 100) {
                    counter.innerText += '%';
                }
            }
        };

        updateCount();
    });
}

// Intersection Observer for counter animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounterAnimation();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Start observing when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelector('.mobile-nav-links');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

    if (hamburger && mobileNavLinks) {
        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });

        // Handle sub-menu toggles
        mobileMenuItems.forEach(item => {
            const link = item.querySelector('a');
            const subMenu = item.querySelector('.sub-menu');

            if (link && subMenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    subMenu.classList.toggle('active');
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileNavLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
                // Close all sub-menus
                document.querySelectorAll('.sub-menu').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });

        // Close menu when clicking a link (except collection links)
        mobileNavLinks.querySelectorAll('a').forEach(link => {
            if (!link.parentElement.classList.contains('mobile-menu-item')) {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileNavLinks.classList.remove('active');
                    // Close all sub-menus
                    document.querySelectorAll('.sub-menu').forEach(menu => {
                        menu.classList.remove('active');
                    });
                });
            }
        });
    }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Social Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const brandMark = document.getElementById('brandMark');
    const socialMenu = document.getElementById('socialMenu');

    if (brandMark && socialMenu) {
        brandMark.addEventListener('click', (e) => {
            e.stopPropagation();
            brandMark.classList.toggle('active');
            socialMenu.classList.toggle('active');
        });

        // Close social menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!brandMark.contains(e.target) && !socialMenu.contains(e.target)) {
                brandMark.classList.remove('active');
                socialMenu.classList.remove('active');
            }
        });

        // Prevent closing when clicking social menu
        socialMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('.lazy-image');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Image loading handlers
function handleImageLoad(img) {
    img.style.opacity = '0';
    img.parentElement.classList.add('loading');

    // Ensure image is fully loaded
    if (img.complete) {
        showLoadedImage(img);
    } else {
        img.addEventListener('load', () => showLoadedImage(img));
    }
}

function handleImageError(img) {
    img.src = 'assets/placeholder.jpg';
    showLoadedImage(img);
}

function showLoadedImage(img) {
    // Small delay to ensure smooth transition
    setTimeout(() => {
        img.style.opacity = '1';
        img.parentElement.classList.remove('loading');
        img.parentElement.classList.add('loaded');
    }, 50);
}

// Add these functions to your script.js
function updateCartSidebar() {
    const cartItemsContainer = document.querySelector('.cart-sidebar-items');
    if (!cartItemsContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        totalPrice += parseFloat(item.price.replace(/[^0-9.-]+/g, ''));

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
    });

    const totalElement = document.querySelector('.sidebar-total-price');
    if (totalElement) {
        totalElement.textContent = `${totalPrice.toFixed(2)} L.E`;
    }
}
// Click outside to close sidebar
document.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon-container');

    if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(event.target) && !cartIcon.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Terms and Conditions Popup
document.addEventListener('DOMContentLoaded', () => {
    const termsPopup = document.getElementById('termsPopup');
    const acceptButton = document.getElementById('acceptTerms');
    const declineButton = document.getElementById('declineTerms');

    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem('acceptedTerms');

    if (!hasAcceptedTerms) {
        // Show popup with animation
        setTimeout(() => {
            termsPopup.classList.add('show');
        }, 1000);
    }

    acceptButton.addEventListener('click', () => {
        // Save to localStorage
        localStorage.setItem('acceptedTerms', 'true');
        // Hide popup with animation
        termsPopup.classList.remove('show');
    });

    declineButton.addEventListener('click', () => {
        // Redirect to another website or show message
        window.location.href = 'https://www.google.com';
    });
});
function payNow(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const priceText = productCard.querySelector('.price').textContent;
    const productPrice = parseFloat(priceText.replace('L.E', '').trim());

    // Get quantity from the quantity input
    const quantityInput = productCard.querySelector('.quantity-input');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    // Check for size selection using size squares
    let selectedSize = '';
    const selectedSquare = productCard.querySelector('.size-square.selected');
    if (selectedSquare) {
        selectedSize = selectedSquare.dataset.size;
    }

    // Get the selected color
    let selectedColor = '';
    const selectedColorSquare = productCard.querySelector('.color-square.active');
    if (selectedColorSquare) {
        selectedColor = selectedColorSquare.dataset.color;
    }

    // Get the image corresponding to the selected color (the active image in the slider)
    let imageUrl = '';
    const activeImage = productCard.querySelector('.image-slider img.active') || productCard.querySelector('.image-slider img');
    if (activeImage) {
        imageUrl = activeImage.src;
    } else {
        // fallback to product image if no slider
        const productImage = productCard.querySelector('.product-image img');
        imageUrl = productImage ? productImage.src : '';
    }

    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }

    const totalPrice = productPrice * quantity;

    // Create product details object
    const productDetails = {
        name: productName,
        price: productPrice,
        priceFormatted: `${productPrice.toFixed(2)} L.E`,
        totalPrice: totalPrice,
        totalPriceFormatted: `${totalPrice.toFixed(2)} L.E`,
        image: imageUrl,
        size: selectedSize,
        quantity: quantity,
        color: selectedColor
    };

    // Store product in cart
    cart = [productDetails]; // Update the global cart variable
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('payNowClicked', 'true');

    // Update cart badge
    updateCartBadge();

    // Update hidden inputs
    const cartItemsInput = document.getElementById('cart-items-input');
    const totalAmountInput = document.getElementById('total-amount-input');

    if (cartItemsInput) {
        cartItemsInput.value = JSON.stringify(cart);
    }

    if (totalAmountInput) {
        totalAmountInput.value = totalPrice;
    }

    // Use setTimeout to ensure data is saved before redirecting
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 100);
}

function updateHiddenFields() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsInput = document.getElementById('cart-items-input');
    const totalAmountInput = document.getElementById('total-amount-input');

    if (cartItemsInput) {
        cartItemsInput.value = JSON.stringify(cart);
    }

    if (totalAmountInput) {
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        totalAmountInput.value = total;
    }
}

// ... existing code ...
function displayUserOrders(userId) {
    const ordersContainer = document.getElementById('ordersList');
    if (!ordersContainer) return;
    ordersContainer.innerHTML = '<div class="loading-spinner"></div>';

    const db = firebase.firestore();
    db.collection('orders').where('userId', '==', userId)
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                ordersContainer.innerHTML = '<p class="no-orders">No orders yet</p>';
                return;
            }
            let orders = [];
            snapshot.forEach(doc => {
                const order = doc.data();
                // Do NOT overwrite order.id with doc.id; use the saved custom ID
                orders.push(order);
            });
            renderOrdersList(orders, ordersContainer);
        }, (error) => {
            ordersContainer.innerHTML = '<p class="no-orders">Error loading orders.</p>';
        });
}
// ... existing code ...
const statusColors = {
    'Pending': '#1e4023', // green
    'Confirmed': '#007bff', // blue
    'Processing': '#007bff', // blue
    'Shipped': '#ff9800', // orange
    'Delivered': '#4caf50', // dark green
    'Cancelled': '#f44336', // red
    'Returned': '#9c27b0', // purple
    'Failed': '#b71c1c' // dark red
};

function getStatusColor(status) {
    return statusColors[status] || '#333';
}

// Helper function to generate a custom order ID
function generateCustomOrderId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    for (let i = 0; i < 3; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return `XK-${randomLetters}`;
}

// Helper function to render the orders list
function renderOrdersList(orders, ordersList) {
    ordersList.innerHTML = orders.map(order => {
        const totalAmount = order.items.reduce((total, item) => {
            const price = parseFloat(item.price.toString().replace('L.E', '').trim());
            return total + (price * item.quantity);
        }, 0);
        const orderId = order.id || order.docId;
        return `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">Order #${orderId}</span>
                    <span class="order-date">${order.date}</span>
                    <span class="order-status" style="background:${getStatusColor(order.status)};color:#fff;padding:5px 15px;border-radius:10px;">
                        ${order.status}
                    </span>
                    <span class="order-actions">
                         <span class="order-eye" data-order-id="${orderId}" style="cursor:pointer; margin-right:10px;">
                            <i class="fa fa-eye"></i>
                        </span>
                        <span class="download-receipt-icon" data-order-id="${orderId}" style="cursor:pointer;">
                            <i class="fas fa-download"></i>
                        </span>
                    </span>
                </div>
                <div class="order-details" style="display: none;">
                    <div class="order-items">
                        ${order.items.map(item => {
            const price = parseFloat(item.price.toString().replace('L.E', '').trim());
            const itemTotal = price * (item.quantity || 1);
            return `
                                <div class="order-item-row">
                                    <span>${item.name || ''} (${item.quantity})</span>
                                    <span>${itemTotal.toFixed(2)} L.E</span>
                                </div>
                            `;
        }).join('')}
                    </div>
                    <div class="order-footer">
                        <span class="order-total">Total: ${totalAmount.toFixed(2)} L.E</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.order-eye').forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            const orderId = this.getAttribute('data-order-id');
            showOrderSummaryPopup(orderId);
        });
    });
    
    document.querySelectorAll('.download-receipt-icon').forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            const orderId = this.getAttribute('data-order-id');
            // Redirect to the receipt page with the order ID
            window.location.href = `order-receipt.html?orderId=${orderId}`;
        });
    });
}

function showOrderSummaryPopup(orderId) {
    const popup = document.getElementById('orderSummaryPopup');
    const popupContent = document.getElementById('orderSummaryContent');
    
    popup.style.display = 'flex';
    popupContent.innerHTML = '<div class="loading">Loading order details...</div>';
    
    const db = firebase.firestore();
    db.collection('orders').where('id', '==', orderId).limit(1).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                const order = snapshot.docs[0].data();
                const totalAmount = order.items.reduce((total, item) => {
                    const price = parseFloat(item.price.toString().replace('L.E', '').trim());
                    return total + (price * item.quantity);
                }, 0);
                
                popupContent.innerHTML = `
                    <div class="order-info">
                        <h2>Order Details</h2>
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Order Date:</strong> ${order.date}</p>
                        <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)} L.E</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Shipping Address:</strong> ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.governorate}</p>
                    </div>
                    <div class="order-items">
                        <h3>Items Ordered</h3>
                        <ul>
                            ${order.items.map(item => {
                                const price = parseFloat(item.price.toString().replace('L.E', '').trim());
                                const itemTotal = price * item.quantity;
                                return `
                                    <li>
                                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                                        <div class="order-item-details">
                                            <p><strong>${item.name}</strong></p>
                                            <p>Size: ${item.size}</p>
                                            ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                                            <p>Quantity: ${item.quantity}</p>
                                            <p>Price: ${price.toFixed(2)} L.E</p>
                                            <p>Total: ${itemTotal.toFixed(2)} L.E</p>
                                        </div>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                `;
    } else {
                popupContent.innerHTML = '<p>Order details not found.</p>';
            }
        })
        .catch(() => {
            popupContent.innerHTML = '<p>Error loading order details.</p>';
        });
}

// Function to close the popup
function closeOrderSummaryPopup() {
    const popup = document.getElementById('orderSummaryPopup');
    popup.style.display = 'none';
}

// Close popup when clicking outside
document.addEventListener('click', function(e) {
    const popup = document.getElementById('orderSummaryPopup');
    const popupContent = document.querySelector('.popup-content');
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.profile-section')) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                displayUserOrders(user.uid);
                document.getElementById('userName').textContent = user.displayName || 'User';
                document.getElementById('userEmail').textContent = user.email;
            } else {
                document.getElementById('ordersList').innerHTML = '<p class="no-orders">Please sign in to view your orders.</p>';
            }
        });
    }
});

// Function to generate unique order ID
function generateOrderId() {
    return new Promise((resolve) => {
        // Generate a random 3-digit number
        const randomNum = Math.floor(100 + Math.random() * 900); // ensures a 3-digit number (100-999)
        
        // Create the order ID with random number
        const orderId = `XK-${randomNum}`;
        
        // Check if this ID already exists in Firebase to avoid duplicates
        const db = firebase.firestore();
        db.collection('orders').where('id', '==', orderId).get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    // ID doesn't exist yet, we can use it
                    resolve(orderId);
                } else {
                    // ID already exists, generate another one (recursively)
                    generateOrderId().then(newId => resolve(newId));
                }
            })
            .catch((error) => {
                console.error("Error checking order ID:", error);
                // In case of error, just use a random ID with timestamp to ensure uniqueness
                const timestamp = new Date().getTime().toString().slice(-3);
                const fallbackRandomNum = Math.floor(100 + Math.random() * 900);
                resolve(`XK-${fallbackRandomNum}${timestamp}`);
            });
    });
}

// Update the storeOrder function to use the new generateOrderId
function storeOrder(orderData) {
    // Get current date and time in Cairo timezone
    const cairoDate = new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    // Generate order ID
    generateOrderId().then(orderId => {
        // Create new order object with all required information
        const newOrder = {
            id: orderId,
            date: cairoDate,
            items: orderData.items,
            shippingInfo: orderData.shippingInfo,
            paymentMethod: orderData.paymentMethod,
            status: 'Pending',
            totalAmount: orderData.items.reduce((total, item) => {
                const price = parseFloat(item.price.toString().replace('L.E', '').trim());
                return total + (price * item.quantity);
            }, 0)
        };

        // Add user ID if user is logged in
        const user = firebase.auth().currentUser;
        if (user) {
            newOrder.userId = user.uid;
        }

        // Save to Firebase
        const db = firebase.firestore();
        db.collection('orders').add(newOrder)
            .then(() => {
                // Clear cart after successful order
                localStorage.removeItem('cart');
                updateCartBadge();
                
                // Show success message
                showToast('Order placed successfully!', 'success');
                
                // Redirect to thank you page with order ID as URL parameter
                setTimeout(() => {
                    window.location.href = `thank-you.html?orderId=${orderId}`;
                }, 1500);
            })
            .catch((error) => {
                console.error("Error adding order: ", error);
                showToast('Error placing order. Please try again.', 'error');
            });
    });
}

// Update the handleOrderSubmission function to not redirect immediately
function handleOrderSubmission(event) {
    event.preventDefault();

    // Get form data
    const form = document.getElementById('payment-form');
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const phone = form.querySelector('#phone').value;
    const governorate = form.querySelector('#governorate').value;
    const city = form.querySelector('#city').value;
    const address = form.querySelector('#address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate total
    const totalAmount = cart.reduce((total, item) => {
        const price = parseFloat(item.price.toString().replace('L.E', '').trim());
        return total + (price * item.quantity);
    }, 0);

    // Create order data
    const orderData = {
        items: cart,
        shippingInfo: {
            name,
            email,
            phone,
            governorate,
            city,
            address
        },
        paymentMethod,
        totalAmount: totalAmount.toFixed(2) + ' L.E'
    };

    // Store order (the redirect is handled inside storeOrder now)
    storeOrder(orderData);
}

// City data organized by governorate
const egyptCities = {
    'cairo': ['Nasr City', 'Heliopolis', 'New Cairo', 'Maadi', 'Zamalek', 'Downtown Cairo', 'Shubra', 'Ain Shams', 'El Marg', 'Helwan', 'El Basatin', 'Dar El Salam', 'El Sayeda Zeinab', 'El Manial', 'El Mokattam', 'El Matariya', 'Bulaq', 'El Khalifa', 'El Zawya El Hamra', 'El Salam City', 'El Sharabiya', 'New Administrative Capital'],
    'giza': ['Giza', '6th of October', 'Sheikh Zayed', 'Al-Hawamdeya', 'Badrashin', 'Al-Saf', 'Atfih'],
    'alexandria': ['Alexandria', 'Borg El Arab'],
    'qalyubia': ['Banha', 'Qalyub', 'Shubra El-Kheima', 'Kafr Shukr', 'Tukh', 'Khanka', 'Shibin El-Qanater'],
    'daqahlia': ['Mansoura', 'Mit Ghamr', 'Talkha', 'El-Sinbillawain', 'Aga', 'Sherbin', 'Gamasa'],
    'sharqia': ['Zagazig', 'Belbeis', '10th of Ramadan', 'Abu Kebir', 'Fakous', 'Minya El-Qamh'],
    'gharbia': ['Tanta', 'El-Mahalla El-Kubra', 'Kafr El-Zayat', 'Zefta', 'Samannoud', 'Basyoun'],
    'monufia': ['Shebin El-Kom', 'Menouf', 'Ashmoun', 'Tala', 'Sadat City', 'Quesna'],
    'beheira': ['Damanhur', 'Kafr El-Dawar', 'Rashid', 'Kom Hamada', 'Itay El Barud'],
    'kafr-el-sheikh': ['Kafr El Sheikh', 'Desouk', 'Baltim', 'Sidi Salem', 'Fuwwah'],
    'fayoum': ['Fayoum', 'Ibshway', 'Senuris', 'Tamiya', 'Etsa'],
    'beni-suef': ['Beni Suef', 'Al Wasta', 'Nasser', 'Ihnasia', 'Beba', 'El Fashn'],
    'minya': ['Minya', 'Minya El Gedida', 'Maghagha', 'Beni Mazar', 'Matai', 'Samalut', 'Abu Qurqas', 'Mallawi', 'Deir Mawas', 'El Adwa'],
    'assiut': ['Assiut', 'Dairut', 'Manfalut', 'Abnoub', 'El Qusiya', 'Al Badari', 'Sahel Selim'],
    'sohag': ['Sohag', 'Tahta', 'Akhmim', 'Girga', 'Juhayna', 'Maragha', 'Al Balina'],
    'qena': ['Qena', 'Qus', 'Nag Hammadi', 'Dishna', 'Farshut', 'Abu Tesht'],
    'luxor': ['Luxor', 'Armant', 'Esna'],
    'aswan': ['Aswan', 'Edfu', 'Kom Ombo', 'Daraw'],
    'red-sea': ['Hurghada', 'Safaga', 'El Qoseir', 'Marsa Alam', 'Ras Gharib'],
    'new-valley': ['Kharga', 'Dakhla', 'Farafra', 'Baris'],
    'matrouh': ['Marsa Matrouh', 'El Alamein', 'Sidi Barrani', 'Siwa'],
    'north-sinai': ['Arish', 'Rafah', 'Sheikh Zuweid', 'Bir al-Abed'],
    'south-sinai': ['El Tor', 'Sharm El Sheikh', 'Dahab', 'Nuweiba', 'Taba', 'Saint Catherine'],
    'ismailia': ['Ismailia', 'Qantara East', 'Qantara West', 'Abu Suweir'],
    'port-said': ['Port Said', 'Port Fouad'],
    'suez': ['Suez']
};

// Function to update cities based on selected governorate
function updateCities() {
    const governorateSelect = document.getElementById('governorate');
    const citySelect = document.getElementById('city');

    if (!governorateSelect || !citySelect) return;

    const selectedGovernorate = governorateSelect.value;

    // Clear the current options
    citySelect.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = selectedGovernorate ? 'Select City' : 'Select Governorate First';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    citySelect.appendChild(defaultOption);

    // If a governorate is selected, add its cities
    if (selectedGovernorate && egyptCities[selectedGovernorate]) {
        egyptCities[selectedGovernorate].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, '-');
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// Initialize cities dropdown when checkout page loads
document.addEventListener('DOMContentLoaded', function () {
    const governorateSelect = document.getElementById('governorate');
    if (governorateSelect) {
        updateCities();
    }
});

// Function to handle order submission
function handleOrderSubmission(event) {
    event.preventDefault();

    // Get form data
    const form = document.getElementById('payment-form');
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const phone = form.querySelector('#phone').value;
    const governorate = form.querySelector('#governorate').value;
    const city = form.querySelector('#city').value;
    const address = form.querySelector('#address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate total
    const totalAmount = cart.reduce((total, item) => {
        const price = parseFloat(item.price.toString().replace('L.E', '').trim());
        return total + (price * item.quantity);
    }, 0);

    // Create order data
    const orderData = {
        items: cart,
        shippingInfo: {
            name,
            email,
            phone,
            governorate,
            city,
            address
        },
        paymentMethod,
        totalAmount: totalAmount.toFixed(2) + ' L.E'
    };

    // Store order (the redirect is handled inside storeOrder now)
    storeOrder(orderData);
}
let currentIndex = 0;

function changeImage(button, direction) {
    // Get the product card that contains this button
    const productCard = button.closest('.product-card');
    
    // Get images and color squares only from this specific product card
    const images = productCard.querySelectorAll('.image-slider img');
    const colorSquares = productCard.querySelectorAll('.color-square');
    
    // Find the currently active image in this card
    let currentIndex = 0;
    for (let i = 0; i < images.length; i++) {
        if (images[i].classList.contains('active')) {
            currentIndex = i;
            break;
        }
    }
    
    // Remove active class from current image
    images[currentIndex].classList.remove('active');
    
    // Calculate new index with wrapping
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    
    // Add active class to new image
    images[currentIndex].classList.add('active');
    
    // Synchronize the color squares with the current image
    const currentColor = images[currentIndex].getAttribute('data-color');
    colorSquares.forEach(square => {
        if (square.getAttribute('data-color') === currentColor) {
            square.classList.add('active');
        } else {
            square.classList.remove('active');
        }
    });
}

// Color selection and image sync logic
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to ALL color squares
    document.querySelectorAll('.color-square').forEach(btn => {
        btn.addEventListener('click', () => {
            // Get the product card that contains this color square
            const productCard = btn.closest('.product-card');
            
            // Get only color squares and images from this specific product card
            const colorSquares = productCard.querySelectorAll('.color-square');
            const productImages = productCard.querySelectorAll('.image-slider img');
            
            // Remove active class from all color squares in this card
            colorSquares.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked square
            btn.classList.add('active');
            
            // Show only the image with matching data-color in this card
            const selectedColor = btn.getAttribute('data-color');
            productImages.forEach(img => {
                if (img.getAttribute('data-color') === selectedColor) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        });
    });
});

function openQuickView(button) {
    const productCard = button.closest('.product-card');
    const images = Array.from(productCard.querySelectorAll('img')).map(img => img.src);

    const productDetails = {
        images: images,
    };
    localStorage.setItem('quickViewProduct', JSON.stringify(productDetails));

    window.location.href = 'quick-view.html';
}

function showSizeChart(button) {
    const productCard = button.closest('.product-card');
    const sizeChartImage = productCard.querySelector('.size-chart-image');

    if (sizeChartImage) {
        const modal = document.createElement('div');
        modal.className = 'size-chart-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove();" style="cursor: pointer; font-size: 24px; position: absolute; top: 10px; right: 20px;">&times;</span>
                <img src="${sizeChartImage.src}" alt="Size Chart" style="width: 100%; height: auto;">
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Function to display favorite products on favorite.html
async function displayFavoriteProducts() {
    const favoriteProductsGrid = document.querySelector('.favorite-products-grid');
    if (!favoriteProductsGrid) return; // Exit if not on the favorite page

    const user = firebase.auth().currentUser;
    if (!user) {
        favoriteProductsGrid.innerHTML = '<p class="no-orders">Please sign in to view your favorites.</p>';
        return;
    }

    const userId = user.uid;
    const db = firebase.firestore();
    const favoritesRef = db.collection('users').doc(userId).collection('favorites');

    try {
        const snapshot = await favoritesRef.orderBy('addedAt', 'desc').get();

        if (snapshot.empty) {
            favoriteProductsGrid.innerHTML = '<p class="no-orders">You have no favorite products yet.</p>';
            return;
        }

        favoriteProductsGrid.innerHTML = ''; // Clear loading indicator
        const productPromises = snapshot.docs.map(async doc => {
            const favoriteData = doc.data();
            // Assuming favoriteData contains product details (name, price, image, id)
            // If it only contains productId, you would need to fetch product details from your products collection here
            // For now, assuming product details are stored in the favorite document
            return favoriteData;
        });

        const products = await Promise.all(productPromises);

        // Use createProductCard to render favorite products
        products.forEach(product => {
            favoriteProductsGrid.innerHTML += createProductCard(product);
        });

        // After rendering, update the favorite icon appearance
        checkFavoriteStatus();

    } catch (error) {
        console.error('Error fetching favorite products:', error);
        favoriteProductsGrid.innerHTML = '<p class="no-orders">Error loading favorite products.</p>';
    }
}

// Call displayFavoriteProducts on page load if on the favorite page
document.addEventListener('DOMContentLoaded', () => {
    // Other DOMContentLoaded logic...
    
    // Check favorite status on relevant pages
    if (document.querySelector('.products-grid') || document.querySelector('.favorite-products-grid')) {
         // Delay slightly to ensure product cards are rendered
         setTimeout(() => {
             checkFavoriteStatus();
             // If on the favorite page, display favorite products
             if (document.querySelector('.favorite-products-grid')) {
                 displayFavoriteProducts();
             }
         }, 500);
    }

    // If on the favorite page initially (without products-grid), call displayFavoriteProducts
    if (document.querySelector('.favorite-products-grid') && !document.querySelector('.products-grid')) {
         displayFavoriteProducts();
    }
});
// Quick View Zoom Logic
(function(){
  const img = document.getElementById('quickViewImage');
  const container = img && img.closest('.quick-view-image');
  if (!img || !container) return;

  // --- Desktop: الزووم عند hover يتم بالـ CSS فقط ---

  // --- Mobile: double tap أو pinch to zoom ---
  let lastTap = 0;
  let isZoomed = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;
  let initialDistance = 0;
  let pinchZoom = false;

  function setTransform(x, y) {
    img.style.transform = isZoomed ? `scale(2) translate(${x}px,${y}px)` : '';
  }

  function resetZoom() {
    isZoomed = false;
    img.classList.remove('zoomed');
    img.style.transform = '';
    lastX = lastY = 0;
  }

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      // Pinch start
      pinchZoom = true;
      initialDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      isZoomed = true;
      img.classList.add('zoomed');
      lastX = lastY = 0;
    } else if (e.touches.length === 1 && isZoomed) {
      startX = e.touches[0].clientX - lastX;
      startY = e.touches[0].clientY - lastY;
    }
  }

  function onTouchMove(e) {
    if (pinchZoom && e.touches.length === 2) {
      // Pinch to zoom (fixed at scale 2)
      // Prevent default scroll
      e.preventDefault();
    } else if (isZoomed && e.touches.length === 1) {
      e.preventDefault();
      lastX = e.touches[0].clientX - startX;
      lastY = e.touches[0].clientY - startY;
      // Limit panning so image doesn't go out of bounds
      const maxX = (img.offsetWidth * (2-1)) / 2;
      const maxY = (img.offsetHeight * (2-1)) / 2;
      lastX = Math.max(-maxX, Math.min(maxX, lastX));
      lastY = Math.max(-maxY, Math.min(maxY, lastY));
      img.style.transform = `scale(2) translate(${lastX}px,${lastY}px)`;
    }
  }

  function onTouchEnd(e) {
    if (pinchZoom && e.touches.length < 2) {
      pinchZoom = false;
    }
  }

  // Double tap to zoom
  container.addEventListener('touchend', function(e) {
    if (e.touches.length > 0) return;
    const now = Date.now();
    if (now - lastTap < 350) {
      // Double tap
      isZoomed = !isZoomed;
      if (isZoomed) {
        img.classList.add('zoomed');
      } else {
        resetZoom();
      }
    } else if (isZoomed) {
      // Single tap while zoomed: reset
      resetZoom();
    }
    lastTap = now;
  });

  container.addEventListener('touchstart', onTouchStart, {passive:false});
  container.addEventListener('touchmove', onTouchMove, {passive:false});
  container.addEventListener('touchend', onTouchEnd);

  // Prevent scroll when zoomed
  container.addEventListener('touchmove', function(e){
    if (isZoomed) e.preventDefault();
  }, {passive:false});

  // Reset zoom on image change
  window.addEventListener('hashchange', resetZoom);
})();

document.getElementById('newsletter-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('subscriber-email').value;
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
        showToast('Please login first to subscribe', 'error');
        return;
    }

    // Check if already subscribed
    const existingSub = await db.collection('subscribers')
        .where('email', '==', email)
        .get();

    if (!existingSub.empty) {
        showToast('You are already subscribed!', 'info');
        return;
    }

    // Generate unique subscriber ID
    let subscriberId;
    let isUnique = false;
    
    while (!isUnique) {
        const randomNum = Math.floor(100 + Math.random() * 900);
        subscriberId = `XKS-${randomNum}`;
        
        // Check if ID exists
        const docRef = await db.collection('subscribers').doc(subscriberId).get();
        if (!docRef.exists) {
            isUnique = true;
        }
    }

    // Save subscription with custom ID
    db.collection('subscribers').doc(subscriberId).set({
        email: email,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        subscriberId: subscriberId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        showToast('Thank you for subscribing!', 'success');
        document.getElementById('subscriber-email').value = '';
    })
    .catch((error) => {
        showToast('Error: ' + error.message, 'error');
    });
});

// Contact Form Submission
console.log('Script loaded'); // Check if script is loaded

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Check if page is loaded
    
    const contactForm = document.getElementById('contact-form');
    console.log('Contact form element:', contactForm); // Check if form is found
    
    if (contactForm) {
        console.log('Adding submit event listener');
        contactForm.addEventListener('submit', function(e) {
            console.log('Form submitted');
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            console.log('Form values:', { name, email, message });
            
            // Validate all fields are filled
            if (!name || !email || !message) {
                console.log('Form validation failed: empty fields');
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.log('Form validation failed: invalid email');
                showToast('Please enter a valid email address', 'error');
                return;
            }

            console.log('Attempting to save to Firestore');
            // Save to Firestore
            const db = firebase.firestore();
            db.collection('contacts').add({
                name: name,
                email: email,
                message: message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'new',
                read: false
            })
            .then(() => {
                console.log('Message saved successfully');
                showToast('Message sent successfully!', 'success');
                // Clear form
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('message').value = '';
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                showToast('Error sending message. Please try again.', 'error');
            });
        });
    } else {
        console.log('Contact form not found in the DOM');
    }
});

