const themeSwitch = document.getElementById('theme-switch');
const body = document.getElementById('theme-body');

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.remove('light-mode');
    body.classList.add(currentTheme);
}

themeSwitch.addEventListener('click', function() {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
});
