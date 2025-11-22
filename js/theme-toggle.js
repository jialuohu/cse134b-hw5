const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeIcon.innerHTML = '<i class="fa-regular fa-moon"></i>';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (document.startViewTransition) {
        document.startViewTransition(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    } else {
        // fallbacks
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
}

themeToggle.addEventListener('click', toggleTheme);
loadTheme();
