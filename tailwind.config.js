/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            // Add simple extensions if needed
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
} 