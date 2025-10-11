import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const SendifyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff3e6',
      100: '#ffe0bc',
      200: '#ffcc91',
      300: '#ffb766',
      400: '#ffa246',
      500: '#ff8c32',
      600: '#eb7626',
      700: '#c85c1b',
      800: '#9a4412',
      900: '#6c2d0a',
      950: '#441c06',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#101010',
          50: '#141414',
          100: '#191919',
          200: '#1e1e1e',
          300: '#242424',
          400: '#2a2a2a',
          500: '#303030',
          600: '#363636',
          700: '#3c3c3c',
          800: '#424242',
          900: '#474747',
        },
      },
    },
  },
})

export default SendifyPreset
