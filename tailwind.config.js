/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./main.js"
    ],
    theme: {
        extend: {
            colors: {
                accent: '#589d0e', // Vibrant Green (High Contrast)
                brand: {
                    dark: '#022c28', // Deep Forest Green
                    mid: '#589d0e',  // Vibrant Leaf Green
                    lite: '#589d0e', // Updated for contrast
                },
                slate: {
                    950: '#021815', // Ultra Dark Green (replacing midnight)
                    900: '#022c28', // Deep Forest Green (replacing dark slate)
                    800: '#03453f', // Lighter border variations
                }
            },
            fontFamily: {
                sans: ['"General Sans"', 'sans-serif'],
                heading: ['"Space Grotesk"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
