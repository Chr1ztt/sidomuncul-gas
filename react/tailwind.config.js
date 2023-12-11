/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Nunito", "sans-serif"],
			serif: ["ui-serif", "Georgia"],
		},
		extend: {
			// colors: {
			//   main: "#111926",
			//   second: "#F9FAFC",
			//   third: "#E7B7E9",
			//   forth: "#E6E7EB",
			//   fifth: "#FFD960",
			//   "selected-item": "#343A46",
			// },
			colors: {
				//sori klo salah , buta warna wkwkwk
				sidebar: "#111926", //black
				main: "#EDF1D6", //black
				// main: "#232222", //black
				// second: "#346CF6", //blue
				second: "#9DC08B", //blue
				secondary: "#FBFCF7", //blue
				// second: "#1E60FF", //blue
				// second: "#3498db", //blue
				// third: "#5DC69A", //green
				third: "#609966", //green
				forth: "#40513B", //yellow

				fifth: "#C64382", //red
				empty: "#DBE0EB", //abu tua
				light: "#EDF0F4", //abu muda
				// light : "#ffffff",
				"selected-item": "#343A46",
				// secondary: "#F9FAFC",
				grey: "#E6E7EB",
			},
		},
	},
	plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
