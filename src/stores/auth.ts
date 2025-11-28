//Pinia
import { defineStore } from 'pinia'
//Vue
import { ref, computed } from 'vue'
//Firebase
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
//Router
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);

    const router = useRouter();
    const isAuthenticated = computed(() => user.value !== null);

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            if(result.user){
                user.value = result.user;
            }
        } catch (error) {
            console.log('Error al iniciar sesión con Google', error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            user.value = null;
            router.push('/');
        } catch (error) {
            console.log('Error al cerrar sesión', error);
        }
    }

    const initAuth = () => {
        onAuthStateChanged(auth, (firebaseUser) => {
            if(firebaseUser){
                user.value = firebaseUser;
            }else{
                user.value = null;
            }
        });
    }

    if(auth.currentUser){
        user.value = auth.currentUser;
    }

    return {
        user, 
        isAuthenticated,
        loginWithGoogle,
        logout,
        initAuth
    }
});