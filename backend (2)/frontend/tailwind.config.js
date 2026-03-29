/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#2D5016',
        leaf: '#4A7C2C',
        harvest: '#DF6D14',
        soil: '#8B6914',
        cream: '#F5F5DC',
        'light-gray': '#E8E8E0',
        'warm-white': '#FAFAF5',
        charcoal: '#3E3E3E',
        'grade-a': '#2D5016',
        'grade-b': '#F4C430',
        'grade-c': '#FF8C42',
        'reject': '#C44536'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace']
      },
      boxShadow: {
        'farmer': '0 4px 20px rgba(45, 80, 22, 0.15)',
      }
    }
  },
  plugins: []
}

