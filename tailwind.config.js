/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // The deep blue-black of a night sky or Totoro's umbrella
        ink: '#1e293b', 
        // A soft, warm off-white like aged paper or clouds
        mist: '#fdfcf0', 
        // Pure canvas white
        surface: '#ffffff', 
        // "Forest Spirit" greens (Lush, organic, and vibrant)
        accent: {
          50: '#f1f8e9',
          100: '#dcedc8',
          500: '#689f38', // Grass green
          600: '#558b2f', // Deep leaf
          700: '#33691e', // Moss
        },
        // "Sunset Glow" (Warm, nostalgic oranges and yellows)
        coral: {
          500: '#ffb74d', // Warm sunlight
          600: '#f57c00', // Deep sunset
        },
        // "Sky & Water" (The classic Joe Hisaishi blue)
        azure: {
          400: '#81d4fa',
          500: '#29b6f6',
        }
      },
      boxShadow: {
        // Softer, warmer shadow for a "hand-drawn" feel
        glow: '0 24px 80px rgba(85, 139, 47, 0.1)',
      },
      fontFamily: {
        // Space Grotesk is a bit too modern; something rounder fits Ghibli better
        heading: ['"Quicksand"', 'sans-serif'], 
        body: ['"Nunito"', 'sans-serif'],
      },
      backgroundImage: {
        // A soft morning meadow gradient
        mesh:
          'radial-gradient(circle at top left, rgba(104, 159, 56, 0.15), transparent 40%), radial-gradient(circle at right, rgba(255, 183, 77, 0.12), transparent 30%), linear-gradient(180deg, #fdfcf0 0%, #e0f2f1 100%)',
      },
    },
  },
  plugins: [],
};