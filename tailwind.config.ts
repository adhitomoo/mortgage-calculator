import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lime: '#D8DB2F',
        slate: {
          900: "#133041",
          700: "#4E6E7E",
          500: "#6B94A8",
          300: "#9ABED5",
          100: "#E4F4FD",
        },
        danger: "#D73328"
      },
      height: {
        card: "606px",
      },
      borderRadius: {
        "5xl": "5rem",
      }
    },
  },
  plugins: [
    // Other third party and/or custom plugins
    // require('@tailwindcss/typography')({modifiers: ['sm', 'lg']})
    plugin(function({ matchUtilities }) {
      matchUtilities(
        {
          'x': (value) => ({
            [`@apply ${value.replaceAll(',', ' ')}`]: {}
          })
        }
      )
    })
  ]
} satisfies Config;
