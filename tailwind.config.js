module.exports = {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        peach: "#FBBF9B",
        coral: "#E8836A",
        cream: "#FFF8F0",
        softyellow: "#FDECC8",
        sage: "#8FAF87",
        sagelight: "#C5D9C0",
        rosegold: "#C7856A",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
