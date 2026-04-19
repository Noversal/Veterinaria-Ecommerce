// tema claro u oscuro
export function initTheme() {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconLight = document.getElementById('theme-icon-light');
    const iconDark = document.getElementById('theme-icon-dark');

    // Esto es para guardar el tema claro u oscuro en localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateIcons(savedTheme);

    //cambiar tema al hacer click en el boton
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons(newTheme);
    });

    //esto es para cambiar los iconos del boton la lunita o el sol
    function updateIcons(theme) {
        if (theme === 'dark') {
            iconLight.classList.remove('d-none');
            iconDark.classList.add('d-none');
        } else {
            iconLight.classList.add('d-none');
            iconDark.classList.remove('d-none');
        }
    }
}
