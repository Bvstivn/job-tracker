export interface Job {
    id?: string;
    company: string;
    position: string;
    status: 'pendiente' | 'entrevista' | 'rechazado' | 'oferta';
    link?: string;
    date: number;
    userId: string;
}