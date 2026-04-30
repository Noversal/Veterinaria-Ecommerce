export function contador(id) {
     let template = `  
     
     Cantidad:
     
     <div class="d-flex justify-content-center align-items-center gap-3 my-3">
            <button id="btn-decrementar-${id}" class="btn-decremento">-</button>
            <div>
                <p><span id="contador-${id}">1</span></p>
            </div>
            <button id="btn-incrementar-${id}" class="btn-incremento">+</button>
        </div>
    `
    return template;    
}
// Evento de funcionalidad para el contador
export function addEventListeners(id, cantidad) {
    let btnDecrementar = document.querySelector(`#btn-decrementar-${id}`);
    let btnIncrementar = document.querySelector(`#btn-incrementar-${id}`);
    let spanContador = document.querySelector(`#contador-${id}`);
    btnIncrementar.addEventListener('click', () => {
        spanContador.textContent = ++cantidad;
     });
    btnDecrementar.addEventListener('click', () => {
        if(cantidad > 1) {
            spanContador.textContent = --cantidad;
        }
        spanContador.textContent = cantidad;
    });

}


////Contador para el carrito

export function contadorCarrito(id, cantidad) {
     let template = `  
     
     Cantidad:
     
     <div class="d-flex justify-content-center align-items-center gap-3 my-3">
            <button id="btn-decrementarCarrito-${id}" class="btn-decremento">-</button>
            <div>
                <p><span id="contadorCarrito-${id}">${cantidad}</span></p>
            </div>
            <button id="btn-incrementarCarrito-${id}" class="btn-incremento">+</button>
        </div>
    `
    return template;    
}

export function addEventListenersCarrito(id, cantidad, onChange) {
    let btnDecrementar = document.querySelector(`#btn-decrementarCarrito-${id}`);
    let btnIncrementar = document.querySelector(`#btn-incrementarCarrito-${id}`);
    let spanContador = document.querySelector(`#contadorCarrito-${id}`);
    
    if (!btnDecrementar || !btnIncrementar || !spanContador) return;
    
    let cantidadActual = cantidad;
    
    btnIncrementar.addEventListener('click', () => {
        cantidadActual++;
        spanContador.textContent = cantidadActual;
        if (onChange) onChange(cantidadActual);
    });
    
    btnDecrementar.addEventListener('click', () => {
        if (cantidadActual > 1) {
            cantidadActual--;
            spanContador.textContent = cantidadActual;
            if (onChange) onChange(cantidadActual);
        }
    });
}
