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