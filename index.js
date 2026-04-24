import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
import { initTheme } from './theme.js';
import { getCart, saveCart, clearCart } from './storage.js';
import { createProductCard } from './cards.js';
import { convertToARS, formatARS } from './cotizacion.js';
import { contador, addEventListeners } from './contador.js';

// Inicializa el tema (Claro/Oscuro) nativo
initTheme();

let productsData = [];
let cart = getCart();

const productsList = document.getElementById('products-list');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const cartList = document.getElementById('cart-list');
const totalPriceEl = document.getElementById('total-price');
const btnVaciar = document.getElementById('btn-vaciar');

// Cargar productos y renderizar
async function loadProducts() {
    try {
        //fetch para evitar el cache del navegador al recargar la página
        const response = await fetch('./products.json?v=' + new Date().getTime());
        productsData = await response.json();
        renderProducts(productsData);
        updateCartUI();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        productsList.innerHTML = '<div class="alert alert-danger w-100">Error al cargar el catálogo de productos.</div>';
    }
}

// Renderizar tarjetas en el DOM
function renderProducts(products) {
   // productsList.innerHTML = products.map(p => createProductCard(p)).join('');
   //le agrego una propiedad mas con el precio ars
productsList.innerHTML = products.map(p => {
    return createProductCard({
        ...p,
        precioARS: convertToARS(p.precio)
    });
}).join('');

    // Asignar eventos a los botones nuevos
    const btnsAdd = document.querySelectorAll('.btn-add-cart');
    btnsAdd.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(id);
        });
    });

//boton detalle del producto 
const btnsDetail = document.querySelectorAll('.btn-detail');

btnsDetail.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        showProductDetail(id);
    });
});


}

//Logica de detalle de productos 
    function showProductDetail(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    Swal.fire({
        title: product.nombre,
        html: `
            <img src="${product.imagen}" style="width:100%; max-height:200px; object-fit:contain; margin-bottom:10px;">
            <p><strong>Categoría:</strong> ${product.categoria}</p>
            <p>${product.descripcion || 'Sin descripción disponible.'}</p>
            <p><strong>Precio:</strong> ${formatARS(convertToARS(product.precio))}</p>
         <div>${contador(id)}</div><div><button class="btn-modal-carrito" data-id="${product.id}">Agregar al carrito</button></div>
        `,
        confirmButtonText: 'Cerrar',
        
         didOpen: () => {
            addEventListeners(id, 1);
            const btnAddCart = document.querySelector('.btn-modal-carrito');
            btnAddCart.addEventListener('click', () => {

            const inputCantidad = document.querySelector(`#contador-${id}`); 
            const cantidadElegida = inputCantidad ? parseInt(inputCantidad.textContent) : 1;
                addToCart(id, cantidadElegida);
                Swal.close();
            });
        }
        
    });

}
   
// Filtro de búsqueda
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = productsData.filter(p => p.nombre.toLowerCase().includes(term));
    renderProducts(filtered);
});

// Lógica del Carrito
function addToCart(id, quantity = 1) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }

    saveCart(cart);
    updateCartUI();



    // Notificación visual (SweetAlert2)
    Swal.fire({
        title: '¡Añadido!',
        text: `${product.nombre} se añadió al carrito.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartUI();
}

function updateCartUI() {
    // Actualizar badge
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Renderizar lista en offcanvas
    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-muted text-center mt-4">El carrito está vacío</p>';
        totalPriceEl.textContent =  formatARS(0);    //'$0.00';
        return;
    }

    cartList.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
            <div class="d-flex flex-column">
                <span class="fw-semibold" style="font-size: 0.9rem;">${item.nombre}</span>
                <span class="text-muted small"> ${item.quantity} x ${formatARS(convertToARS(item.precio))} </span>  
            </div>
            ${'' /*comentado el precio original*/}
            ${'' /* ${item.quantity} x $${item.precio.toFixed(2)} */}

            <div class="d-flex align-items-center gap-2">
                <span class="fw-bold text-primary">${formatARS(convertToARS(item.quantity * item.precio))}</span> 
                ${'' /*comentado el precio original*/}
                ${'' /*$${(item.quantity * item.precio).toFixed(2)}*/}
                <button class="btn btn-sm btn-outline-danger btn-remove gap-0 p-1" data-id="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // Eventos para botones eliminar
    const removeBtns = document.querySelectorAll('.btn-remove');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            removeFromCart(id);
        });
    });

    // Calcular total
    const total = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    totalPriceEl.textContent = formatARS(convertToARS(total)); //`$${total.toFixed(2)}`;
}

btnVaciar.addEventListener('click', () => {
    if (cart.length > 0) {
        cart = [];
        saveCart(cart);
        updateCartUI();
        Swal.fire({
            title: 'Carrito vaciado',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
        });
    }
});

const btnFinalizarCompra = document.getElementById('btn-finalizar');

btnFinalizarCompra.addEventListener('click', () => {

    if (cart.length === 0) return;

    const offcanvas = bootstrap.Offcanvas.getInstance('#offcanvas-carrito');

    Swal.fire({
        title: 'Procesando pago...',
        icon: 'info',
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
    });

    setTimeout(() => {
        offcanvas.hide();
        clearCart();
        cart = [];
        updateCartUI();
        Swal.fire({
            title: '¡Compra finalizada!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
        });
    }, 1000);

});



// Inicio de la app
loadProducts();
