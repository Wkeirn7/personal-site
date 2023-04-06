// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        'primevue/resources/themes/saga-blue/theme.css',
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css',
        'primeflex/primeflex.css',
        '~/assets/fonts/orbitron.css',
      ],
      build: {
        transpile: ['primevue']
      },
      ssr: false,
      app: {
        head: {
          title: 'William Keirn',
          link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
          ],
        }
      }
})
