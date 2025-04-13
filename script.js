// Create product cards - Global function
const createProductCard = (product) => {
    return `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">
                <div class="image-loader">
                    <div class="spinner"></div>
                </div>
                <img src="${product.image}" 
                     alt="${product.name}"
                     class="product-img"
                     onload="this.parentElement.classList.add('loaded')"
                     onerror="this.src='assets/placeholder.jpg'; this.parentElement.classList.add('loaded')">
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
    anchor.addEventListener('click', function(e) {
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

// Add to Cart Function with improved image handling
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productImage = productCard.querySelector('.product-image img');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    
    // Check for size selection using size squares
    let selectedSize = '';
    const selectedSquare = productCard.querySelector('.size-square.selected');
    
    if (selectedSquare) {
        selectedSize = selectedSquare.dataset.size;
    }
    
    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }

    // Create product details object first
    const productDetails = {
        name: productName,
        price: productPrice,
        image: productImage.src, // Get image source directly
        size: selectedSize
    };

    // Get current cart from localStorage
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    currentCart.push(productDetails);
    
    // Update localStorage and global cart variable
    localStorage.setItem('cart', JSON.stringify(currentCart));
    cart = currentCart;
    
    updateCartBadge();
    showToast('Item added to cart successfully!', 'success');

    // The cart items and total are stored in hidden inputs
    document.getElementById('cart-items-input').value = JSON.stringify(cart);
    document.getElementById('total-amount-input').value = totalAmount;

    // Add these lines at the end of the function
    const sidebar = document.querySelector('.cart-sidebar');
    if (sidebar) {
        updateCartSidebar();
        sidebar.classList.add('active');
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
    
    if (!cartContainer || !totalElement) return;
    
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (currentCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        totalElement.textContent = '0.00 L.E';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = currentCart.map((item, index) => {
        const priceStr = item.price || '0.00 L.E';
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
        total += price;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         class="cart-product-img">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <p class="cart-item-price">${priceStr}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})" aria-label="Remove item">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');

    // Add shipping cost
    const shippingCost = 90;
    total += shippingCost;

    // Update total price
    totalElement.textContent = `${total.toFixed(2)} L.E`;
}

// Checkout Page Functionality
if (document.querySelector('.checkout-section')) {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        // Display cart items once when page loads
        displayCartItems();

        // Handle payment method selection
        const paymentOptions = document.querySelectorAll('.payment-option-label');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');

                // Show/hide Vodafone Cash fields
                const vodafoneFields = document.getElementById('vodafone-instructions');
                if (vodafoneFields) {
                    vodafoneFields.style.display = option.dataset.payment === 'vodafone' ? 'block' : 'none';
                }
            });
        });

        // Handle file input change with proper validation and preview
        const paymentScreenshot = document.getElementById('payment-screenshot');
        if (paymentScreenshot) {
            paymentScreenshot.addEventListener('change', function() {
                const file = this.files[0];
                const uploadText = this.previousElementSibling.querySelector('.upload-text');
                const maxSize = 5 * 1024 * 1024; // 5MB max file size
                const previewContainer = document.getElementById('file-preview');
                
                if (file) {
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        uploadText.textContent = 'Please select an image file';
                        uploadText.style.color = '#ff0000';
                        this.value = ''; // Clear the file input
                        if (previewContainer) {
                            previewContainer.innerHTML = '';
                        }
                        return;
                    }
                    
                    // Validate file size
                    if (file.size > maxSize) {
                        uploadText.textContent = 'File size must be less than 5MB';
                        uploadText.style.color = '#ff0000';
                        this.value = ''; // Clear the file input
                        if (previewContainer) {
                            previewContainer.innerHTML = '';
                        }
                        return;
                    }

                    // Update UI with file name and success state
                    uploadText.textContent = `Selected: ${file.name}`;
                    uploadText.style.color = '#4CAF50';
                    
                    // Create preview
                    if (previewContainer) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewContainer.innerHTML = `
                                <img src="${e.target.result}" alt="Payment Screenshot Preview" 
                                     style="max-width: 200px; margin-top: 10px;">
                            `;
                        };
                        reader.readAsDataURL(file);
                    }
                } else {
                    uploadText.textContent = 'Upload Payment Screenshot';
                    uploadText.style.color = 'var(--accent-color)';
                    if (previewContainer) {
                        previewContainer.innerHTML = '';
                    }
                }
            });
        }

        // Payment method is stored in a hidden input
        const selectedLabel = document.querySelector('.payment-option-label.selected');
        if (selectedLabel) {
            document.getElementById('payment-method-input').value = selectedLabel.dataset.payment;
        }

        // Update the checkout form submission handler
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get current cart data
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Update hidden inputs before submission
            document.getElementById('cart-items-input').value = JSON.stringify(cartItems);
            document.getElementById('total-amount-input').value = document.querySelector('.total-price').textContent;
            
            const selectedPayment = document.querySelector('.payment-option-label.selected');
            if (selectedPayment) {
                document.getElementById('payment-method-input').value = selectedPayment.dataset.payment;
            }

            // After successful submission
            setTimeout(() => {
                // Clear the cart
                localStorage.removeItem('cart');
                
                // Update cart badge
                updateCartBadge();
                
                // Reset form
                this.reset();
                
                // Show success message
                showToast('Order placed successfully!', 'success');
                
                // Reload page after delay
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 2000);
            }, 100);
        });
    }
}

// Contact Form Submission
if (document.querySelector('.contact-section')) {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Get form data for logging
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

            // Log contact form data for development
            console.log('Contact Form Submission:', formData);
        });
    }
}

// Newsletter Subscription
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                e.preventDefault();
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Log newsletter subscription for development
            console.log('Newsletter Subscription:', { email });
        });
    }
});

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
document.addEventListener('DOMContentLoaded', function() {
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
document.addEventListener('click', function(event) {
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
