/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode:'class',
  theme: {
    extend: {
      boxShadow:{
        customShadow:"box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);"
      },
      colors:{
        primaryColor:"var(--primaryColor)",
        accentColor:"var(--accentColor)",
        backGround:"var(--background)",
        foreground:"var(--foreground)",
        textColor:"var(--textColor)",
        grayColor:"var(--grayColor)",
        darkGrayColor:"var(--darkGrayColor)",
        dangerColor:"#F20505"
      },
      fontFamily:{
        logoFont:"Foldit"
      }
    },
  },
  
  plugins: [],
  
};
