import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//Firebase
import './firebase/config'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
//Pinia
import { createPinia } from 'pinia'
//Router
import router from './router';

let app: any;

onAuthStateChanged(auth, () => {
    if(!app){
        const app = createApp(App);
        //Servicios
        app.use(createPinia());
        app.use(router);
        app.mount('#app');
    }
});

