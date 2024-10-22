module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/assets/stylesheets/**/*.scss', // SCSSファイルも含める
    './app/javascript/**/*.js'
  ],
  plugins: [require("daisyui")],
  daisyui: {
    darkTheme: false,
  },
  theme: {
    extend: {
      colors: {
        'ay': {
          300: 'rgba(209, 213, 219, var(--tw-bg-opacity))' // 修正した部分
        },
      },
    },
  },
}
