import VueRouter from 'vue-router'

export default new VueRouter({
  routes: [
    { path: '/', redirect: '/editor' },
    { path: '/editor', component: () => import('@/views/editor') }
  ]
})