import DeliveryLoginView from './views/DeliveryLoginView.vue'
import DeliveryDashboardView from './views/DeliveryDashboardView.vue'
import DeliveryManagementView from './views/DeliveryManagementView.vue'
import DeliveryCreateView from './views/DeliveryCreateView.vue'

export const deliveryRoutes = [
  {
    path: '/delivery',
    name: 'delivery-login',
    component: DeliveryLoginView,
  },
  {
    path: '/delivery/dashboard',
    name: 'delivery-dashboard',
    component: DeliveryDashboardView,
    meta: {
      requiresDeliveryAuth: true,
    },
  },
  {
    path: '/admin/delivery',
    name: 'delivery-management',
    component: DeliveryManagementView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin/delivery/create',
    name: 'delivery-create',
    component: DeliveryCreateView,
    meta: {
      requiresAuth: true,
    },
  },
]
