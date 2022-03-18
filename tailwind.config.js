const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-radial-t':
          'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'gradient-radial-b':
          'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
        'gradient-radial-l':
          'radial-gradient(ellipse at left, var(--tw-gradient-stops))',
        'gradient-radial-r':
          'radial-gradient(ellipse at right, var(--tw-gradient-stops))',
        'gradient-radial-tl':
          'radial-gradient(ellipse at top left, var(--tw-gradient-stops))',
        'gradient-radial-tr':
          'radial-gradient(ellipse at top right, var(--tw-gradient-stops))',
        'gradient-radial-bl':
          'radial-gradient(ellipse at bottom left, var(--tw-gradient-stops))',
        'gradient-radial-br':
          'radial-gradient(ellipse at bottom right, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-conic-t': 'conic-gradient(at top, var(--tw-gradient-stops))',
        'gradient-conic-r':
          'conic-gradient(at right, var(--tw-gradient-stops))',
        'gradient-conic-b':
          'conic-gradient(at bottom, var(--tw-gradient-stops))',
        'gradient-conic-l': 'conic-gradient(at left, var(--tw-gradient-stops))',
        'gradient-conic-tr':
          'conic-gradient(at top right, var(--tw-gradient-stops))',
        'gradient-conic-tl':
          'conic-gradient(at top left, var(--tw-gradient-stops))',
        'gradient-conic-br':
          'conic-gradient(at bottom right, var(--tw-gradient-stops))',
        'gradient-conic-bl':
          'conic-gradient(at bottom left, var(--tw-gradient-stops))',
      },
      screens: {
        print: { raw: 'print' },
      },
      colors: {
        blue: {
          ...colors.blue,
        },
        orange: {
          ...colors.orange,
        },
        porter: {
          light: '#0f5289',
          DEFAULT: '#003678',
          accent: '#ec4b1d',
        },
      },
      container: {
        center: true,
        padding: '1rem',
      },
      spacing: {
        14: '3.5rem',
        18: '4.5rem',
        68: '16rem',
        92: '23rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'active', 'disabled'],
      empty: ['before', 'after'],
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
