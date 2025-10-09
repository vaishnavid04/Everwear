/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#8b6f47',
          800: '#6f4e37',
          900: '#5d4037',
        },
        secondary: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#bdbdbd',
          600: '#9e9e9e',
          700: '#757575',
          800: '#424242',
          900: '#212121',
        },
        product: {
          black: '#000000',
          grey: '#9e9e9e',
          cream: '#f5f5dc',
          darkBrown: '#3e2723',
        },
        neutral: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#bdbdbd',
          600: '#9e9e9e',
          700: '#757575',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        'heading': ['Inter', 'Helvetica Neue', 'sans-serif'],
        'body': ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
        subtle: 'subtle 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtle: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b6f47 0%, #6f4e37 100%)',
        'gradient-warm': 'linear-gradient(135deg, #bfa094 0%, #a18072 100%)',
        'gradient-neutral': 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)',
      },
      boxShadow: {
        'minimal': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'medium': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};