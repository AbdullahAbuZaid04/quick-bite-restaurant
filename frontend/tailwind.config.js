/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: "#FF6B35",
          hover: "#E85A2A",
          light: "#FFEDE6",
        },
        content: {
          title: "#1C1B1B",
          paragraph: "#594139",
          subtitle: "#9CA3AF",
        },
        ui: {
          mainBg: "#FCF9F8",
          white: "#FFFFFF",
          border: "#F1F1F1",
        },
        status: {
          delivered: "#22C55E",
          preparing: "#F59E0B",
          cancelled: "#EF4444",
          shipping: "#3B82F6",
        }
      },
      plugins: [],
    }
  }
}