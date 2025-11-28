//Pinia
import { defineStore } from 'pinia';
//Vue
import { ref } from 'vue';
//Firebase
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
//Auth
import { useAuthStore } from './auth';
//Types
import type { Job } from '../interfaces/jobs';

export const useJobStore = defineStore('jobs', () => {
    const jobs = ref<Job[]>([]);
    const loading = ref(false);

    const addJob = async (jobData: Omit<Job, 'id' | 'userId' | 'date'>) => {
        loading.value = true;
        const user = auth.currentUser;
        console.log('usuario actual: ', user);
        if(!user) return;

        try {
            const newJob: Job = {
                ...jobData,
                userId: user.uid,
                date: Date.now(),
                status: 'pendiente'
            }
            const docRef = await addDoc(collection(db, 'jobs'), newJob);
            jobs.value.push({...newJob, id: docRef.id});
            console.log('Nuevo trabajo agregado', docRef.id);
        } catch (error) {
            console.log('Error al agregar trabajo', error);
        }finally{
            loading.value = false;
        }
    }

    const fetchJobs = async () => {
        const authStore = useAuthStore();
        if(!authStore.user) return;
        try {
            const q = query(collection(db, 'jobs'), where('userId', '==', authStore.user.uid));

            const querySnapshot = await getDocs(q);

            jobs.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Job[];
        } catch (error) {
            console.log('Error al obtener trabajos', error);
        }
    }

    const deleteJob = async (jobId: string) => {
        try {
            await deleteDoc(doc(db, 'jobs', jobId));
            jobs.value = jobs.value.filter(job => job.id !== jobId);
        } catch (error) {
            console.log('Error al eliminar trabajo', error);
        }
    };

    const updateStatus = async (id: string, newStatus: Job['status']) => {
        const authStore = useAuthStore();
        if(!authStore.user) return;
        try {
            const jobRef = doc(db, 'jobs', id);
            await updateDoc(jobRef, {
                status: newStatus
            });

            const index = jobs.value.findIndex(job => job.id === id);
            if(index !== -1 && jobs.value[index]){
                jobs.value[index].status = newStatus;
            }
        } catch (error) {
            console.log('Error al actualizar trabajo', error);
        }
    }

    return {
        jobs,
        loading,
        addJob,
        fetchJobs,
        deleteJob,
        updateStatus
    }
});