import http from '../config/http';

export type RegisterWalkerPayload = {
    fullName: string;
    dni: string;
    email: string;
    phone: string;       // ya normalizado a dígitos
    address: string;
    birthDate: string;   // 'YYYY-MM-DD'
    password: string;
};

export async function registerWalker(payload: RegisterWalkerPayload) {
    const res = await http.post('/walkers/register', payload);
    return res.data; // { id }
}

export async function checkEmailExists(email: string) {
    const res = await http.get('/walkers/email-exists', { params: { email } });
    return res.data.exists as boolean;
}