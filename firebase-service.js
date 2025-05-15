// Firebase Service - Centralized functions for Firebase interactions

// Cart Management
const CartService = {
    // Get cart for current user
    getCart: async function() {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        
        try {
            if (user) {
                // Logged in user - get cart from Firebase
                const cartDoc = await db.collection('carts').doc(user.uid).get();
                if (cartDoc.exists) {
                    return cartDoc.data().items || [];
                } else {
                    return [];
                }
            } else {
                // Guest user - get from localStorage as fallback
                return JSON.parse(localStorage.getItem('cart')) || [];
            }
        } catch (error) {
            console.error("Error getting cart: ", error);
            // Fallback to localStorage if Firebase fails
            return JSON.parse(localStorage.getItem('cart')) || [];
        }
    },
    
    // Update or create cart
    updateCart: async function(cartItems) {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        
        try {
            // Always update localStorage as backup
            localStorage.setItem('cart', JSON.stringify(cartItems));
            
            if (user) {
                // Logged in user - update Firebase
                await db.collection('carts').doc(user.uid).set({
                    items: cartItems,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error updating cart: ", error);
            return false;
        }
    },
    
    // Clear cart
    clearCart: async function() {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        
        try {
            // Always clear localStorage
            localStorage.removeItem('cart');
            
            if (user) {
                // Logged in user - clear Firebase cart
                await db.collection('carts').doc(user.uid).set({
                    items: [],
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error clearing cart: ", error);
            return false;
        }
    },
    
    // Add item to cart
    addToCart: async function(item) {
        const currentCart = await this.getCart();
        currentCart.push(item);
        return await this.updateCart(currentCart);
    },
    
    // Remove item from cart
    removeFromCart: async function(index) {
        const currentCart = await this.getCart();
        if (index >= 0 && index < currentCart.length) {
            currentCart.splice(index, 1);
            return await this.updateCart(currentCart);
        }
        return false;
    }
};

// Order Management
const OrderService = {
    // Create a new order
    createOrder: async function(orderData) {
        const db = firebase.firestore();
        
        try {
            // Generate order ID
            const orderId = await generateOrderId();
            
            // Create new order object with all required information
            const newOrder = {
                id: orderId,
                date: new Date().toLocaleString('en-US', {
                    timeZone: 'Africa/Cairo',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }),
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
            
            // Save order to Firebase
            const orderRef = await db.collection('orders').add(newOrder);
            
            // Clear cart after successful order
            await CartService.clearCart();
            
            return {
                success: true,
                orderId: orderId,
                orderRef: orderRef.id
            };
        } catch (error) {
            console.error("Error creating order: ", error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Get all orders for current user
    getUserOrders: async function() {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        
        if (!user) {
            return [];
        }
        
        try {
            const snapshot = await db.collection('orders')
                .where('userId', '==', user.uid)
                .orderBy('date', 'desc')
                .get();
                
            let orders = [];
            snapshot.forEach(doc => {
                const order = doc.data();
                orders.push(order);
            });
            
            return orders;
        } catch (error) {
            console.error("Error getting user orders: ", error);
            return [];
        }
    },
    
    // Get a specific order by ID
    getOrderById: async function(orderId) {
        const db = firebase.firestore();
        
        try {
            const snapshot = await db.collection('orders')
                .where('id', '==', orderId)
                .limit(1)
                .get();
                
            if (!snapshot.empty) {
                return snapshot.docs[0].data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting order: ", error);
            return null;
        }
    }
};

// User Preferences (Terms, Settings, etc.)
const UserPreferencesService = {
    // Check if user has accepted terms
    hasAcceptedTerms: async function() {
        try {
            const user = firebase.auth().currentUser;
            
            if (user) {
                // Check Firebase for logged in users
                const db = firebase.firestore();
                const prefsDoc = await db.collection('userPreferences').doc(user.uid).get();
                
                if (prefsDoc.exists) {
                    return prefsDoc.data().acceptedTerms === true;
                }
            }
            
            // Fallback to localStorage
            return localStorage.getItem('acceptedTerms') === 'true';
        } catch (error) {
            console.error("Error checking terms acceptance: ", error);
            return localStorage.getItem('acceptedTerms') === 'true';
        }
    },
    
    // Set terms acceptance
    setTermsAcceptance: async function(accepted) {
        try {
            // Always update localStorage as fallback
            if (accepted) {
                localStorage.setItem('acceptedTerms', 'true');
            } else {
                localStorage.removeItem('acceptedTerms');
            }
            
            const user = firebase.auth().currentUser;
            if (user) {
                // Update in Firebase for logged in users
                const db = firebase.firestore();
                await db.collection('userPreferences').doc(user.uid).set({
                    acceptedTerms: accepted,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }
            
            return true;
        } catch (error) {
            console.error("Error setting terms acceptance: ", error);
            return false;
        }
    }
};

// Product Sharing between pages (Quick View, etc.)
const ProductSharingService = {
    // Set temporary product data
    setTempProduct: async function(productDetails, key = 'quickViewProduct') {
        try {
            // Always set in localStorage for simplicity
            localStorage.setItem(key, JSON.stringify(productDetails));
            
            // For logged in users, we can also store in Firebase
            const user = firebase.auth().currentUser;
            if (user) {
                const db = firebase.firestore();
                await db.collection('userTempData').doc(user.uid).set({
                    [key]: productDetails,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }
            
            return true;
        } catch (error) {
            console.error(`Error setting temp product data (${key}): `, error);
            return false;
        }
    },
    
    // Get temporary product data
    getTempProduct: async function(key = 'quickViewProduct') {
        try {
            // First try Firebase for logged in users
            const user = firebase.auth().currentUser;
            if (user) {
                const db = firebase.firestore();
                const dataDoc = await db.collection('userTempData').doc(user.uid).get();
                
                if (dataDoc.exists && dataDoc.data()[key]) {
                    return dataDoc.data()[key];
                }
            }
            
            // Fallback to localStorage
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : null;
        } catch (error) {
            console.error(`Error getting temp product data (${key}): `, error);
            
            // Fallback to localStorage
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : null;
        }
    }
};

// Helper function to generate order ID
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

// Export services
window.CartService = CartService;
window.OrderService = OrderService;
window.UserPreferencesService = UserPreferencesService;
window.ProductSharingService = ProductSharingService; 