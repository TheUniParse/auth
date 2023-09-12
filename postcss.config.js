import cssnext from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'

export default {
  plugins: [
    tailwindcss(),
    cssnext({
      stage: 1,//0experimental ~ 4stable 2d
      minimumVendorImplementations: 1,
      features: {
        'logical-properties-and-values': false,
        'prefers-color-scheme-query': false,
        'gap-properties': false,
        'custom-properties': false,
        'place-properties': false,
        'not-pseudo-class': false,
        'focus-visible-pseudo-class': false,
        'focus-within-pseudo-class': false,
        'color-functional-notation': false,
      }
    }),
  ]
}