/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Add shimmer keyframes and animation
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" }, // Start from the left
          "100%": { transform: "translateX(100%)" }, // Move to the right
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite", // Define the shimmer animation
      },
    },
  },
};
