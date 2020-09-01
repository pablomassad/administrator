const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/feriados',
        component: () => import('pages/feriados/index.vue')
      },
      { path: '/bot', component: () => import('pages/bot/index.vue') },
      { path: '/vids', component: () => import('pages/videogroups/index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
