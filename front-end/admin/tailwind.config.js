/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
     "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        customDark: '#0f1115', // Đặt tên tùy chỉnh, ví dụ là "customDark"
        coffee:'#333',
        coffee2:'#010101',
        coffee3:'#D1D5DB',
        lightGray: '#e2e2e2',
        lightBlue: '#c9d6ff',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

