import AdminDashboardView from './views/AdminDashboardView.vue'
import ShipmentCreateView from './views/ShipmentCreateView.vue'
import ShipmentDetailView from './views/ShipmentDetailView.vue'

export const shippingRoutes = [
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin/shipments/create',
    name: 'shipment-create',
    component: ShipmentCreateView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin/shipments/:id',
    name: 'shipment-detail',
    component: ShipmentDetailView,
    meta: {
      requiresAuth: true,
    },
  },
]
