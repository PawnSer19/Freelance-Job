import { createWebHistory, createRouter } from 'vue-router';
import Admin from '../view/AdminPage.vue';
import Login from '../view/LoginPage.vue'
const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'router-link-active'
});
export default router;
