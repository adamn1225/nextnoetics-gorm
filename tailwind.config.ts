import type { Config } from "tailwindcss";

export default {
	content: [
		'./components/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./lib/**/*.{js,ts,jsx,tsx}',
		'./context/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
		      colors: {
        primary: "var(--primary, theme('colors.teal.500'))",
        secondary: "var(--secondary, theme('colors.blue.500'))",
        foreground: "var(--foreground, theme('colors.teal.300'))",
        background: "var(--background)",
      },
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				xxl: '1836px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ['active'],
			textColor: ['active'],
		},
	},
  plugins: [],
} satisfies Config;
