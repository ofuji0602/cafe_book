// tailwind.config.js
module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js'
  ],
  plugins: [require("daisyui")],
  daisyui: {
    darkTheme: false, // ダークモードをONにする場合は削除
  },
  theme: {
    extend: {
      fontSize: {
        xs: '10px', // xsサイズを10pxに変更
      },
    },
  },
}
