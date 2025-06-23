module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
      stage: 3,
      browsers: '> 1%, last 2 versions, Firefox ESR, not dead',
    },
    ...(process.env.NODE_ENV === 'production' ? {
      'cssnano': {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: false,
        }],
      },
    } : {}),
  },
} 