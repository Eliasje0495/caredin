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
        teal:        "#1A7A6A",
        "teal-light":"#E8F7F4",
        "teal-mid":  "#5DB8A4",
        dark:        "#0F1C1A",
        text:        "#1D2B29",
        muted:       "#5A7570",
        bg:          "#FAFAF8",
        accent:      "#F5A623",
      },
      fontFamily: {
        fraunces: ["Fraunces", "serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
        sans:     ["DM Sans", "sans-serif"],
        serif:    ["Fraunces", "serif"],
      },
      borderRadius: {
        pill: "40px",
      },
    },
  },
  plugins: [],
};
export default config;
