//VueRouter
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import Dashboard from '../views/Dashboard.vue';
//Firebase
import { auth } from '../firebase/config';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const currentUser = auth.currentUser;
    if(requiresAuth && !currentUser){
        next('/');
    }else if(to.path === '/' && currentUser){
        next('/dashboard');
    }else{
        next();
    }
});

export default router;