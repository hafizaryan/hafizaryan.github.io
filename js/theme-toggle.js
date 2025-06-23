/* Theme Toggle Functionality */
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check if user has a preference stored in localStorage
    const currentTheme = localStorage.getItem('theme');
    
    // If user has a preference, apply it
    if (currentTheme) {
        document.documentElement.classList.toggle('light-mode', currentTheme === 'light');
    }
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        // Toggle light-mode class on html element
        document.documentElement.classList.toggle('light-mode');
        
        // Save preference to localStorage
        const theme = document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });
});
