import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue';
import Products from '../views/Products';
import Coupon from '../views/Coupon';
import Order from '../views/Order';
import CustomerOrders from '../views/CustomerOrders';
import CustomerCheckout from '@/views/CustomerCheckout.vue';
import Cart from '@/views/Cart.vue';
import Home from '@/views/Home.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '*',
    redirect: 'login',
  },
  {
    path: '/admin',
    name: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: 'products',
        name: 'products',
        component: Products,
        meta: { requiresAuth: true },
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: Coupon,
        meta: { requiresAuth: true },
      },
      {
        path: 'order',
        name: 'order',
        component: Order,
        meta: { requiresAuth: true },
      },
    ]
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: 'customer_orders',
        name: 'CustomerOrders',
        component: CustomerOrders
      },
      {
        path: 'cart',
        name: 'Cart',
        component: Cart
      },
      {
        path: 'customer_checkout/:orderId',
        name: 'CustomerCheckout',
        component: CustomerCheckout
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
})

export default router
