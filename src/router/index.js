import { createRouter, createWebHistory } from 'vue-router'
import GerenciamentoSalas from '../components/GerenciamentoSalas.vue'
import GerenciamentoEspecificacoes from '../components/GerenciamentoEspecs.vue'

const routes = [
  {
    path: '/',
    redirect: '/salas' // Redireciona a raiz para as salas por padrão
  },
  {
    path: '/salas',
    name: 'Salas',
    component: GerenciamentoSalas
  },
  {
    path: '/especificacoes',
    name: 'Especificacoes',
    component: GerenciamentoEspecificacoes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
