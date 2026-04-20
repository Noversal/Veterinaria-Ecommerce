const CART_KEY = 'veterinaria_cart';

export function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
}