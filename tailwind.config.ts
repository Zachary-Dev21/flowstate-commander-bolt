import type { Config } from 'tailwindcss'
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f7f9fb',
          100: '#eef3f7',
          200: '#dbe6ef',
          300: '#bfd2e3',
          400: '#99b7d2',
          500: '#7aa0c2',
          600: '#5f85a9',
          700: '#4e6b8a',
          800: '#425971',
          900: '#3a4b5e'
        }
      }
    }
  },
  plugins: []
} satisfies Config
