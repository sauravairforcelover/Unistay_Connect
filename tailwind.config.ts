import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1380ec",
        secondary: "#f0f2f4",
        text: {
          primary: "#111418",
          secondary: "#617589",
        },
        border: "#dbe0e6",
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

