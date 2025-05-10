import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

const initialUser = JSON.parse(localStorage.getItem('user')) || null;

const initialState = {
    status: 'idle',
    loading: false,
    currentUser: initialUser,
    currentRole: initialUser?.role || null,
    currentToken: initialUser?.token || null,
    isLoggedIn: !!initialUser,
    error: null,
    response: null,

    responseReview: null,
    responseProducts: null,
    responseSellerProducts: null,
    responseSpecificProducts: null,
    responseDetails: null,
    responseSearch: null,
    responseCustomersList: null,

    productData: [],
    sellerProductData: [],
    specificProductData: [],
    productDetails: {},
    productDetailsCart: {},
    filteredProducts: [],
    customersList: [],
};

const updateCartDetailsInLocalStorage = (cartDetails) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    currentUser.cartDetails = cartDetails;
    localStorage.setItem('user', JSON.stringify(currentUser));
};

export const updateShippingDataInLocalStorage = (shippingData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { ...currentUser, shippingData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.status = 'loading';
        },
        underControl: (state) => {
            state.status = 'idle';
            state.response = null;
        },
        stuffAdded: (state) => {
            state.status = 'added';
            state.response = null;
            state.error = null;
        },
        stuffUpdated: (state) => {
            state.status = 'updated';
            state.response = null;
            state.error = null;
        },
        updateFailed: (state, action) => {
            state.status = 'failed';
            state.responseReview = action.payload;
            state.error = null;
        },
        updateCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        authSuccess: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.currentUser = action.payload;
            state.currentRole = action.payload.role;
            state.currentToken = action.payload.token;
            state.status = 'success';
            state.response = null;
            state.error = null;
            state.isLoggedIn = true;
        },
        authFailed: (state, action) => {
            state.status = 'failed';
            state.response = action.payload;
            state.error = null;
        },
        authError: (state, action) => {
            state.status = 'error';
            state.response = null;
            state.error = action.payload;
        },
        authLogout: (state) => {
            localStorage.removeItem('user');
            state.status = 'idle';
            state.loading = false;
            state.currentUser = null;
            state.currentRole = null;
            state.currentToken = null;
            state.error = null;
            state.response = true;
            state.isLoggedIn = false;
        },
        isTokenValid: (state) => {
            if (!state.currentToken) {
                return;
            }
            const decodedToken = jwtDecode(state.currentToken);
            if (decodedToken.exp * 1000 > Date.now()) {
                state.isLoggedIn = true;
            } else {
                localStorage.removeItem('user');
                state.currentUser = null;
                state.currentRole = null;
                state.currentToken = null;
                state.status = 'idle';
                state.response = null;
                state.error = null;
                state.isLoggedIn = false;
            }
        },

        // Cart Management
        addToCart: (state, action) => {
            if (!state.currentUser.cartDetails) {
                state.currentUser.cartDetails = [];
            }

            const existing = state.currentUser.cartDetails.find(
                item => item._id === action.payload._id
            );
            if (existing) {
                existing.quantity += 1;
            } else {
                const newCartItem = { ...action.payload };
                state.currentUser.cartDetails.push(newCartItem);
            }
            updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
        },
        removeFromCart: (state, action) => {
            if (!state.currentUser.cartDetails) return;

            const existing = state.currentUser.cartDetails.find(
                item => item._id === action.payload._id
            );
            if (existing) {
                if (existing.quantity > 1) {
                    existing.quantity -= 1;
                } else {
                    state.currentUser.cartDetails = state.currentUser.cartDetails.filter(
                        item => item._id !== action.payload._id
                    );
                }
                updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
            }
        },
        removeSpecificProduct: (state, action) => {
            if (!state.currentUser.cartDetails) return;
            const updated = state.currentUser.cartDetails.filter(
                item => item._id !== action.payload
            );
            state.currentUser.cartDetails = updated;
            updateCartDetailsInLocalStorage(updated);
        },
        fetchProductDetailsFromCart: (state, action) => {
            const product = state.currentUser.cartDetails?.find(
                item => item._id === action.payload
            );
            state.productDetailsCart = product ? { ...product } : null;
        },
        removeAllFromCart: (state) => {
            state.currentUser.cartDetails = [];
            updateCartDetailsInLocalStorage([]);
        },

        // Product Fetch Actions
        getRequest: (state) => {
            state.loading = true;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getDeleteSuccess: (state) => {
            state.status = 'deleted';
            state.loading = false;
            state.response = null;
            state.error = null;
        },
        productSuccess: (state, action) => {
            state.productData = action.payload;
            state.responseProducts = null;
            state.loading = false;
            state.error = null;
        },
        getProductsFailed: (state, action) => {
            state.responseProducts = action.payload;
            state.loading = false;
        },
        sellerProductSuccess: (state, action) => {
            state.sellerProductData = action.payload;
            state.responseSellerProducts = null;
            state.loading = false;
            state.error = null;
        },
        getSellerProductsFailed: (state, action) => {
            state.responseSellerProducts = action.payload;
            state.loading = false;
        },
        specificProductSuccess: (state, action) => {
            state.specificProductData = action.payload;
            state.responseSpecificProducts = null;
            state.loading = false;
            state.error = null;
        },
        getSpecificProductsFailed: (state, action) => {
            state.responseSpecificProducts = action.payload;
            state.loading = false;
        },
        productDetailsSuccess: (state, action) => {
            state.productDetails = action.payload;
            state.responseDetails = null;
            state.loading = false;
        },
        getProductDetailsFailed: (state, action) => {
            state.responseDetails = action.payload;
            state.loading = false;
        },

        // Customers and Search
        customersListSuccess: (state, action) => {
            state.customersList = action.payload;
            state.responseCustomersList = null;
            state.loading = false;
        },
        getCustomersListFailed: (state, action) => {
            state.responseCustomersList = action.payload;
            state.loading = false;
        },
        setFilteredProducts: (state, action) => {
            state.filteredProducts = action.payload;
            state.responseSearch = null;
            state.loading = false;
        },
        getSearchFailed: (state, action) => {
            state.responseSearch = action.payload;
            state.loading = false;
        },
    },
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    stuffUpdated,
    updateFailed,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    isTokenValid,
    getDeleteSuccess,
    getRequest,
    productSuccess,
    sellerProductSuccess,
    productDetailsSuccess,
    getProductsFailed,
    getSellerProductsFailed,
    getProductDetailsFailed,
    getFailed,
    getError,
    getSearchFailed,
    setFilteredProducts,
    getCustomersListFailed,
    customersListSuccess,
    getSpecificProductsFailed,
    specificProductSuccess,
    addToCart,
    removeFromCart,
    removeSpecificProduct,
    removeAllFromCart,
    fetchProductDetailsFromCart,
    updateCurrentUser,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
