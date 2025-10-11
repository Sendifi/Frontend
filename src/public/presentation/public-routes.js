import PublicTrackingView from './views/PublicTrackingView.vue'

export const publicRoutes = [
  {
    path: '/tracking',
    name: 'public-tracking',
    component: PublicTrackingView,
    meta: {
      layout: 'public',
    },
  },
]
