module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2ff',
          100: '#dde6ff',
          500: '#1a3a6b',
          600: '#162f58',
          700: '#122545',
          800: '#0e1c35',
          900: '#0a1222',
        },
        brand: {
          orange: '#f97316',
          navy:   '#1a3a6b',
        },
      },
    },
  },
  plugins: [],
};
