export default {
    content: ['./resources/**/*.blade.php', './resources/**/*.jsx'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef7f4', 100: '#d5ece4', 200: '#a9d8c9', 300: '#75bda8',
                    400: '#3f9e85', 500: '#12876f', 600: '#0e6d5a', 700: '#0f5449',
                    800: '#10433c', 900: '#0f3d3e', 950: '#062423',
                },
            },
            fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(6px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: { fadeIn: 'fadeIn .18s ease-out' },
        },
    },
    plugins: [],
};
