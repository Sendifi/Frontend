import { createRouter, createWebHistory } from 'vue-router'
import { userRoutes } from '../user/presentation/user-routes.js'
import { publicRoutes } from '../public/presentation/public-routes.js'
import { deliveryRoutes } from '../delivery/presentation/delivery-routes.js'
import { shippingRoutes } from '../shipping/presentation/shipping-routes.js'
import { useUserStore } from '../user/application/user.store.js'
import { useDeliveryStore } from '../delivery/application/delivery.store.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [...userRoutes, ...publicRoutes, ...deliveryRoutes, ...shippingRoutes],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const deliveryStore = useDeliveryStore()

  if (to.meta.requiresAuth) {
    if (!userStore.currentUser) {
      await userStore.getCurrentUser().catch(() => {})
    }
    if (!userStore.isAuthenticated) {
      return next({ name: 'login' })
    }
  }

  if (to.meta.requiresDeliveryAuth && !deliveryStore.currentDeliveryPerson) {
    return next({ name: 'delivery-login' })
  }

  if (to.name === 'login' && userStore.isAuthenticated) {
    return next({ name: 'admin-dashboard' })
  }

  return next()
})

export default router
