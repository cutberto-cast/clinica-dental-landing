import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", 
  
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        "display": ["var(--font-inter)", "sans-serif"],
        "sans": ["var(--font-inter)", "sans-serif"],
        "serif": ["var(--font-playfair)", "serif"], 
      },
      borderRadius: {
        "lg": "0.5rem",
        "xl": "0.75rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
export default config;