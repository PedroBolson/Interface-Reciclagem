/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 4s ease-in-out infinite',
                'pulse-slow': 'pulse 2s infinite',
                'twinkle': 'twinkle 3s ease-in-out infinite',
                'drift': 'drift 6s ease-in-out infinite',
                'shimmer': 'shimmer 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '25%': { transform: 'translateY(-2px) translateX(1px)' },
                    '50%': { transform: 'translateY(-1px) translateX(-1px)' },
                    '75%': { transform: 'translateY(-3px) translateX(1px)' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
                    '50%': { opacity: '1', transform: 'scale(1.2)' },
                },
                drift: {
                    '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
                    '33%': { transform: 'translateX(2px) translateY(-1px)' },
                    '66%': { transform: 'translateX(-1px) translateY(1px)' },
                },
                shimmer: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.8' },
                }
            }
        }
    },
    plugins: []
}