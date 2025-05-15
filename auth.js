// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDqBWf2jaKYrJdjpOq8Yoa1_OoMVn4TGsQ",
    authDomain: "xkooza-072.firebaseapp.com",
    projectId: "xkooza-072",
    storageBucket: "xkooza-072.firebasestorage.app",
    messagingSenderId: "530733516957",
    appId: "1:530733516957:web:8ad9b191a8902211dcec74",
    measurementId: "G-PLYZLT365D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Function to update UI based on auth state
function updateAuthUI(user) {
    const userIcon = document.querySelector('.user-icon');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (user) {
        // User is signed in
        if (userIcon) {
            userIcon.innerHTML = `
                <a href="profile.html" class="user-icon-link">
                    <i class="fas fa-user-check"></i>
                </a>
                <div class="user-dropdown">
                    <a href="profile.html" class="profile-link">
                        <i class="fas fa-user-circle"></i>
                        <span>Profile</span>
                    </a>
                    <a href="#" id="signOutBtn" class="signout-link">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Sign Out</span>
                    </a>
                </div>
            `;
    
            // Add hover functionality
            const dropdown = userIcon.querySelector('.user-dropdown');
            userIcon.addEventListener('mouseenter', () => {
                dropdown.style.display = 'block';
            });
            userIcon.addEventListener('mouseleave', () => {
                dropdown.style.display = 'none';
            });
    
            // Add sign out functionality
            const signOutBtn = userIcon.querySelector('#signOutBtn');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut()
                        .then(() => {
                            // Clear any stored data
                            localStorage.clear();
                            sessionStorage.clear();
                            
                            // Show success message
                            showToast('Signed out successfully!', 'success');
                            
                            // Redirect to home page
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1500);
                        })
                        .catch((error) => {
                            console.error('Sign out error:', error);
                            showToast('Error signing out. Please try again.', 'error');
                        });
                });
            }
        }
        
        // Update any other UI elements that should show when user is logged in
        const authButtons = document.querySelectorAll('.auth-status');
        authButtons.forEach(button => {
            if (button.classList.contains('logged-out')) {
                button.style.display = 'none';
            } else if (button.classList.contains('logged-in')) {
                button.style.display = 'block';
            }
        });
        
    } else {
        // No user is signed in
        if (userIcon) {
            userIcon.innerHTML = `
                <a href="signin.html" class="user-icon-link">
                    <i class="fas fa-user"></i>
                </a>
                <div class="user-dropdown">
                    <a href="signin.html" class="signin-link">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Sign In</span>
                    </a>
                    <a href="signup.html" class="signup-link">
                        <i class="fas fa-user-plus"></i>
                        <span>Sign Up</span>
                    </a>
                </div>
            `;
    
            // Add hover functionality
            const dropdown = userIcon.querySelector('.user-dropdown');
            userIcon.addEventListener('mouseenter', () => {
                dropdown.style.display = 'block';
            });
            userIcon.addEventListener('mouseleave', () => {
                dropdown.style.display = 'none';
            });
        }
        
        // Update any other UI elements that should show when user is logged out
        const authButtons = document.querySelectorAll('.auth-status');
        authButtons.forEach(button => {
            if (button.classList.contains('logged-out')) {
                button.style.display = 'block';
            } else if (button.classList.contains('logged-in')) {
                button.style.display = 'none';
            }
        });
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    updateAuthUI(user);
    
    // If on profile page and not authenticated, redirect to sign in
    if (window.location.pathname.includes('profile.html')) {
        if (!user) {
            window.location.href = 'signin.html';
        } else {
            // Update profile page information
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            
            if (userName && userEmail) {
                // Get user data from Firestore
                db.collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            userName.textContent = userData.fullName || user.displayName || 'User';
                            userEmail.textContent = userData.email || user.email;
                        } else {
                            userName.textContent = user.displayName || 'User';
                            userEmail.textContent = user.email;
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting user data:', error);
                        userName.textContent = user.displayName || 'User';
                        userEmail.textContent = user.email;
                    });
            }

            // Setup change password button
            const changePasswordBtn = document.getElementById('changePasswordBtn');
            const passwordModal = document.getElementById('passwordModal');
            const closeModal = document.querySelector('.close-modal');
            const changePasswordForm = document.getElementById('changePasswordForm');

            if (changePasswordBtn && passwordModal) {
                changePasswordBtn.addEventListener('click', () => {
                    passwordModal.style.display = 'block';
                });

                if (closeModal) {
                    closeModal.addEventListener('click', () => {
                        passwordModal.style.display = 'none';
                    });
                }

                if (changePasswordForm) {
                    changePasswordForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const currentPassword = document.getElementById('currentPassword').value;
                        const newPassword = document.getElementById('newPassword').value;
                        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

                        if (newPassword !== confirmNewPassword) {
                            showToast('New passwords do not match', 'error');
                            return;
                        }

                        // Create credential
                        const credential = firebase.auth.EmailAuthProvider.credential(
                            user.email,
                            currentPassword
                        );

                        // Reauthenticate user
                        user.reauthenticateWithCredential(credential)
                            .then(() => {
                                // Change password
                                return user.updatePassword(newPassword);
                            })
                            .then(() => {
                                showToast('Password updated successfully!', 'success');
                                passwordModal.style.display = 'none';
                                changePasswordForm.reset();
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                                let errorMessage = 'Failed to update password';
                                if (error.code === 'auth/wrong-password') {
                                    errorMessage = 'Current password is incorrect';
                                }
                                showToast(errorMessage, 'error');
                            });
                    });
                }
            }

            // Setup sign out button
            const signoutBtn = document.getElementById('signoutBtn');
            if (signoutBtn) {
                signoutBtn.addEventListener('click', () => {
                    auth.signOut()
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch((error) => {
                            console.error('Error signing out:', error);
                            showToast('Error signing out', 'error');
                        });
                });
            }
        }
    }
}); 

// Products data
const products = [
    {
        name: "XKOOZA Summer Tee",
        price: 499.99,
        formattedPrice: "499.99 L.E",
        image: "assets/summer-tee-1.jpg",
        sizes: ["S", "M", "L", "XL", "2XL"],
        description: "Premium cotton comfort",
        category: "summer",
        inStock: true
    },
    {
        name: "XKOOZA Classic Hoodie",
        price: 899.99,
        formattedPrice: "899.99 L.E",
        image: "assets/winter-hoodie.jpg",
        sizes: ["S", "M", "L", "XL", "2XL"],
        description: "Premium winter comfort",
        category: "winter",
        inStock: true
    },
    {
        name: "XKOOZA Street Shorts",
        price: 599.99,
        formattedPrice: "599.99 L.E",
        image: "assets/summer-shorts-1.jpg",
        sizes: ["S", "M", "L", "XL", "2XL"],
        description: "Comfortable urban style",
        category: "summer",
        inStock: true
    },
    {
        name: "XKOOZA Winter Pants",
        price: 799.99,
        formattedPrice: "799.99 L.E",
        image: "assets/winter-pants-1.jpg",
        sizes: ["S", "M", "L", "XL", "2XL"],
        description: "Warm and durable design",
        category: "winter",
        inStock: true
    }
];

// Function to add a single product to Firebase
function addProductToFirebase(product) {
    return db.collection("products").add(product)
        .then((docRef) => {
            console.log("Product added successfully with ID: ", docRef.id);
            return docRef;
        })
        .catch((error) => {
            console.error("Error adding product: ", error);
            throw error;
        });
}

// Function to add all products to Firebase
function initializeProducts() {
    const batch = db.batch();
    
    // First, check if products already exist
    db.collection("products").get()
        .then((snapshot) => {
            if (snapshot.empty) {
                // Collection is empty, add all products
                return Promise.all(products.map(product => addProductToFirebase(product)));
            } else {
                console.log("Products collection already exists. Skipping initialization.");
                return null;
            }
        })
        .then((result) => {
            if (result) {
                console.log("All products added successfully");
            }
        })
        .catch((error) => {
            console.error("Error initializing products: ", error);
        });
}

// Function to get all products from Firebase
function getAllProducts() {
    return db.collection("products").get()
        .then((snapshot) => {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        })
        .catch((error) => {
            console.error("Error getting products: ", error);
            throw error;
        });
}

// Function to get products by category
function getProductsByCategory(category) {
    return db.collection("products")
        .where("category", "==", category)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        })
        .catch((error) => {
            console.error("Error getting products by category: ", error);
            throw error;
        });
}

// Initialize products when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
});

// Function to save order to Firebase
function saveOrderToFirebase(orderData) {
    const user = auth.currentUser;
    
    if (!user) {
        console.log('User not logged in, order only saved to localStorage');
        return;
    }
    
    // Add user ID to order data
    orderData.userId = user.uid;
    console.log('Saving order to Firebase:', orderData);

    // Add order to Firestore
    db.collection('orders').add(orderData)
        .then((docRef) => {
            console.log('Order saved to Firebase with ID:', docRef.id);
        })
        .catch((error) => {
            console.error('Error adding order to Firebase:', error);
        });
}

// Function to get user orders from Firebase
function getUserOrdersFromFirebase() {
    const user = auth.currentUser;
    
    if (!user) {
        console.log('User not logged in, returning localStorage orders only');
        return Promise.resolve([]);
    }
    
    return db.collection('orders')
        .where('userId', '==', user.uid)
        .orderBy('date', 'desc')
        .get()
        .then((querySnapshot) => {
            const orders = [];
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                orderData.firebaseId = doc.id; // Store Firestore document ID
                orders.push(orderData);
            });
            return orders;
        })
        .catch((error) => {
            console.error('Error getting orders from Firebase:', error);
            return [];
        });
}

// Function to merge orders from Firebase and localStorage
function getMergedOrders() {
    // Get orders from localStorage
    const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get orders from Firebase
    return getUserOrdersFromFirebase()
        .then(firebaseOrders => {
            // Create a map of order IDs to check for duplicates
            const orderMap = new Map();
            
            // Add Firebase orders to the map
            firebaseOrders.forEach(order => {
                orderMap.set(order.id, order);
            });
            
            // Add localStorage orders if they don't already exist in Firebase
            localOrders.forEach(order => {
                if (!orderMap.has(order.id)) {
                    orderMap.set(order.id, order);
                    
                    // Save this local order to Firebase
                    saveOrderToFirebase(order);
                }
            });
            
            // Convert map values to array and sort by date (newest first)
            const mergedOrders = Array.from(orderMap.values());
            mergedOrders.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            
            return mergedOrders;
        });
}

// Function to generate unique order ID
function generateOrderId() {
    // Get existing orders to determine the next number
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get the last order number or start from 0
    const lastOrder = orders[orders.length - 1];
    let lastNumber = 0;
    
    if (lastOrder && lastOrder.id) {
        // Extract number from last order ID (XK-001 -> 1)
        const lastNumberStr = lastOrder.id.split('-')[1];
        lastNumber = parseInt(lastNumberStr);
    }
    
    // Generate next number with padding
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    
    // Return new order ID
    return `XK-${nextNumber}`;
}

// Function to store order in localStorage only (fallback)
function storeOrder(orderData) {
    // Get existing orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
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
    
    // Create new order object with all required information
    const newOrder = {
        id: generateOrderId(),
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
    
    // Add new order to orders array
    orders.push(newOrder);
    
    // Update localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart after successful order
    localStorage.removeItem('cart');
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
    
    return newOrder;
}

// Modify storeOrder function to save to both localStorage and Firebase
function storeOrderWithSync(orderData) {
    // Get existing orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
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
    
    // Create new order object with all required information
    const newOrder = {
        id: generateOrderId(),
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
    
    // Add new order to orders array in localStorage
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Also save to Firebase
    saveOrderToFirebase(newOrder);
    
    // Clear cart after successful order
    localStorage.removeItem('cart');
    updateCartBadge();
    
    return newOrder;
}