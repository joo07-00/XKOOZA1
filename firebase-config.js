// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            userIcon.innerHTML = `
                <i class="fas fa-user"></i>
                <div class="user-dropdown">
                    <a href="profile.html">Profile</a>
                    <a href="index.html" id="signoutBtn">Sign Out</a>
                </div>
            `;

            // Add hover functionality for dropdown
            userIcon.addEventListener('mouseenter', () => {
                const dropdown = userIcon.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                }
            });

            userIcon.addEventListener('mouseleave', () => {
                const dropdown = userIcon.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(10px)';
                }
            });
        }
    } else {
        // User is signed out
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            userIcon.innerHTML = `
                <i class="fas fa-user"></i>
                <div class="user-dropdown">
                    <a href="signin.html">Sign In</a>
                    <a href="signup.html">Sign Up</a>
                </div>
            `;

            // Add hover functionality for dropdown
            userIcon.addEventListener('mouseenter', () => {
                const dropdown = userIcon.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                }
            });

            userIcon.addEventListener('mouseleave', () => {
                const dropdown = userIcon.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(10px)';
                }
            });
        }
    }
});

// Sign out functionality
document.addEventListener('click', (e) => {
    if (e.target.id === 'signoutBtn') {
        e.preventDefault();
        signOut(auth).then(() => {
            // Sign-out successful
            window.location.href = 'index.html';
        }).catch((error) => {
            // An error happened
            console.error('Error signing out:', error);
            showToast('Failed to sign out', 'error');
        });
    }
});

// Sign in with email/password
document.getElementById('signinForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect to home page after successful sign in
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing in:', error);
        showToast('Failed to sign in. Please check your credentials.', 'error');
    }
});

// Sign in with Google
document.querySelector('.google-auth')?.addEventListener('click', async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Store user data in Firestore
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
            fullName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString()
        }, { merge: true });

        // Show success message
        showToast('Signed in successfully with Google!', 'success');

        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing in with Google:', error);
        showToast('Failed to sign in with Google', 'error');
    }
});

// Sign up with email/password
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with full name
        await updateProfile(user, {
            displayName: fullName
        });

        // Store additional user data in Firestore
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
            fullName: fullName,
            email: email,
            createdAt: new Date().toISOString()
        });

        // Update the user icon immediately after successful registration
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            userIcon.innerHTML = `
                <i class="fas fa-user"></i>
                <div class="user-dropdown">
                    <a href="profile.html">Profile</a>
                    <a href="index.html" id="signoutBtn">Sign Out</a>
                </div>
            `;

            // Add hover functionality for dropdown
            userIcon.addEventListener('mouseenter', () => {
                const dropdown = userIcon.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                }
            });

            userIcon.addEventListener('mouseleave', () => {
                const dropdown = userIcon.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(10px)';
                }
            });
        }

        // Show success message
        showToast('Account created successfully!', 'success');

        // Redirect to home page after successful sign up
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing up:', error);
        let errorMessage = 'Failed to sign up. Please try again.';
        
        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please sign in.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters.';
        }
        
        showToast(errorMessage, 'error');
    }
});

// Profile Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = auth.currentUser;
    const profileContainer = document.querySelector('.profile-container');
    const ordersContainer = document.querySelector('.orders-list');

    if (user) {
        // Get user data from Firestore
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    updateProfileInfo(userData);
                }
            })
            .catch((error) => {
                console.error("Error getting user data:", error);
            });

        // Get user's orders
        db.collection('orders')
            .where('userId', '==', user.uid)
            .orderBy('date', 'desc')
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    showNoOrders();
                } else {
                    displayOrders(querySnapshot);
                }
            })
            .catch((error) => {
                console.error("Error getting orders:", error);
            });
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'signin.html';
    }

    // Handle sign out
    const signOutBtn = document.getElementById('signoutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    // Redirect to home page after successful sign out
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("Error signing out:", error);
                    showToast('Failed to sign out', 'error');
                });
        });
    }

    // Handle password change
    const changePasswordBtn = document.querySelector('.change-password-btn');
    const passwordModal = document.querySelector('.password-modal');
    const closeModal = document.querySelector('.close-modal');
    const passwordForm = document.querySelector('.password-form');

    if (changePasswordBtn && passwordModal) {
        changePasswordBtn.addEventListener('click', () => {
            passwordModal.classList.add('active');
        });

        closeModal.addEventListener('click', () => {
            passwordModal.classList.remove('active');
        });

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = passwordForm.querySelector('#current-password').value;
            const newPassword = passwordForm.querySelector('#new-password').value;
            const confirmPassword = passwordForm.querySelector('#confirm-password').value;

            if (newPassword !== confirmPassword) {
                showError("New passwords don't match");
                return;
            }

            // Reauthenticate user before changing password
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            user.reauthenticateWithCredential(credential)
                .then(() => {
                    return user.updatePassword(newPassword);
                })
                .then(() => {
                    showSuccess("Password updated successfully");
                    passwordModal.classList.remove('active');
                    passwordForm.reset();
                })
                .catch((error) => {
                    showError(error.message);
                });
        });
    }
});

function updateProfileInfo(userData) {
    const nameElement = document.querySelector('.profile-name');
    const emailElement = document.querySelector('.profile-email');

    if (nameElement && userData.name) {
        nameElement.textContent = userData.name;
    }
    if (emailElement && userData.email) {
        emailElement.textContent = userData.email;
    }
}

function displayOrders(querySnapshot) {
    const ordersContainer = document.querySelector('.orders-list');
    if (!ordersContainer) return;

    ordersContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const order = doc.data();
        const orderElement = createOrderElement(order, doc.id);
        ordersContainer.appendChild(orderElement);
    });
}

function createOrderElement(order, orderId) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-item';

    const date = order.date.toDate();
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    orderDiv.innerHTML = `
        <div class="order-header">
            <span class="order-id">Order #${orderId.slice(-8)}</span>
            <span class="order-date">${formattedDate}</span>
        </div>
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item-details">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="order-item-info">
                        <h4>${item.name}</h4>
                        <p>Size: ${item.size} | Quantity: ${item.quantity}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            Total: $${order.total.toFixed(2)}
        </div>
    `;

    return orderDiv;
}

function showNoOrders() {
    const ordersContainer = document.querySelector('.orders-list');
    if (!ordersContainer) return;

    ordersContainer.innerHTML = `
        <div class="no-orders">
            <p>No orders found</p>
        </div>
    `;
}

function showError(message) {
    // Implement error notification
    console.error(message);
    // You can add a toast notification here
}

function showSuccess(message) {
    // Implement success notification
    console.log(message);
    // You can add a toast notification here
}

// DOM Content Loaded Event Handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all UI elements
    initializeUI();
    
    // Check authentication state
    onAuthStateChanged(auth, handleAuthStateChange);
});

// Initialize UI elements
function initializeUI() {
    // Initialize user icon and dropdown
    initializeUserIcon();
    
    // Initialize cart
    initializeCart();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize AOS
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
        easing: 'ease',
        delay: 100
    });
}

// Initialize user icon and dropdown
function initializeUserIcon() {
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        // Force initial style application
        userIcon.style.opacity = '1';
        userIcon.style.visibility = 'visible';
        
        const dropdown = userIcon.querySelector('.user-dropdown');
        if (dropdown) {
            // Set initial state
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(10px)';
            
            // Add hover events
            userIcon.addEventListener('mouseenter', () => {
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
                dropdown.style.transform = 'translateY(0)';
            });

            userIcon.addEventListener('mouseleave', () => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(10px)';
            });
        }
    }
}

// Handle auth state changes
function handleAuthStateChange(user) {
    const userIcon = document.querySelector('.user-icon');
    if (!userIcon) return;

    if (user) {
        // User is signed in
        userIcon.innerHTML = `
            <i class="fas fa-user"></i>
            <div class="user-dropdown">
                <a href="profile.html">Profile</a>
                <a href="#" id="signoutBtn">Sign Out</a>
            </div>
        `;
    } else {
        // User is signed out
        userIcon.innerHTML = `
            <i class="fas fa-user"></i>
            <div class="user-dropdown">
                <a href="signin.html">Sign In</a>
                <a href="signup.html">Sign Up</a>
            </div>
        `;
    }
    
    // Reinitialize user icon after content change
    initializeUserIcon();
}

// Initialize cart functionality
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Force initial style application
        cartIcon.style.opacity = '1';
        cartIcon.style.visibility = 'visible';
        
        // Update cart badge
        updateCartBadge();
    }
}

