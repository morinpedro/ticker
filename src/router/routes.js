const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/IndexPage.vue') },
      { path: '/home', component: () => import('pages/IndexPage.vue') },
      { path: '/songs', component: () => import('pages/SongsPage.vue') },
      { name: 'SongPage', path: '/song/:songId', component: () => import('pages/SongPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
