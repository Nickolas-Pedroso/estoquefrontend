import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import PrimeiroAcesso from '../views/primeiroAcesso.vue'
import Equipamentos from '../views/equipamentos.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/primeiro-acesso', name: 'PrimeiroAcesso', component: PrimeiroAcesso },
  { path: '/equipamentos', name: 'Equipamentos', component: Equipamentos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router