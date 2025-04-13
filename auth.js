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