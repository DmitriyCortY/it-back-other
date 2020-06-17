import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/skeleton-builder',
        name: 'SkeletonBuilder',
        component: () =>
            import ('../views/SkeletonBuilder.vue'),

        children: [{
                name: 'SkeletonBuilderIndex',
                path: '/',
                component: () =>
                    import ('../components/SkeletonBuilder/Index.vue'),
            },
            {
                name: 'SkeletonBuilderUpdate',
                path: 'update/:id',
                component: () =>
                    import ('../components/SkeletonBuilder/Update.vue'),
            },
            {
                name: 'SkeletonBuilderCreate',
                path: 'create',
                component: () =>
                    import ('../components/SkeletonBuilder/Create.vue'),
            }
        ]

    },
    {
        path: '/base-builer',
        name: 'BaseBuilder',
        component: () =>
            import ('../views/BaseBuilder.vue'),
        children: [{
                name: 'BaseBuilderIndex',
                path: '/',
                component: () =>
                    import ('../components/BaseBuilder/Index.vue'),
            }, {
                name: 'BaseBuilderUpdate',
                path: 'update/:id',
                component: () =>
                    import ('../components/BaseBuilder/Update.vue'),
            },
            {
                name: 'BaseBuilderCreate',
                path: 'create',
                component: () =>
                    import ('../components/BaseBuilder/Create.vue'),
            }
        ]
    },
    {
        path: '/part-builder',
        name: 'PartBuilder',
        component: () =>
            import ('../views/PartBuilder.vue'),
        children: [{
                name: 'PartBuilderIndex',
                path: '/',
                component: () =>
                    import ('../components/PartBuilder/Index.vue'),
            }, {
                name: 'PartBuilderUpdate',
                path: 'update/:id',
                component: () =>
                    import ('../components/PartBuilder/Update.vue'),
            },
            {
                name: 'PartBuilderCreate',
                path: 'create',
                component: () =>
                    import ('../components/PartBuilder/Create.vue'),
            }
        ]
    },
    {
        path: '/admin-kit-builder',
        name: 'AdminKitBuilder',
        component: () =>
            import ('../views/AdminKitBuilder.vue'),
        children: [{
                name: 'AdminKitBuilderIndex',
                path: '/',
                component: () =>
                    import ('../components/AdminKitBuilder/Index.vue'),
            }, {
                name: 'AdminKitBuilderUpdate',
                path: 'update/:id',
                component: () =>
                    import ('../components/AdminKitBuilder/Update.vue'),
            },
            {
                name: 'AdminKitBuilderCreate',
                path: 'create',
                component: () =>
                    import ('../components/AdminKitBuilder/Create.vue'),
            }
        ]
    },
]

const router = new VueRouter({
    routes
})


export default router