
export const cotizacion = 1400;

export function convertToARS(priceUSD) {
    return priceUSD * cotizacion;
}

export function formatARS(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(price);
}


