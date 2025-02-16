/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'botao-gradient': 'linear-gradient(0deg, rgba(34,197,94,1) 0%, rgba(93,255,152,1) 100%)',
        'checklist-gradient': 'linear-gradient(0deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) 36%, rgba(255,255,255,0) 100%)',
        'sessao-gradient': 'linear-gradient(0deg, rgba(249,115,22,1) 0%, rgba(249,193,22,1) 48%, rgba(249,115,22,0.7791491596638656) 100%);',
        'cardContent-gradient' : 'linear-gradient(43deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.4) 90%);',
        'cinza-gradient' : 'linear-gradient(43deg, rgba(242,242,242,1) 0%, rgba(242,242,242,1) 30%, rgba(242,242,242,1) 60%, rgba(242,242,242,0.4) 90%);',
        'verde-gradient' : 'linear-gradient(43deg, rgba(228,248,240,1) 0%, rgba(228,248,240,1) 30%, rgba(228,248,240,1) 60%, rgba(228,248,240,1) 90%);',
        'data-gradient' : 'linear-gradient(0deg, rgba(34,197,94,1) 28%, rgba(24,164,76,1) 65%);',
        'hora-gradient' : 'linear-gradient(90deg, rgba(34,197,94,1) 0%, rgba(24,164,76,1) 90%);',
        'relogio-gradient' : 'linear-gradient(270deg, rgba(34,197,94,1) 0%, rgba(24,164,76,1) 90%);'
      },
    },
  },
  plugins: [],
};
