import http from '../config/http';

export async function registerUser(payload) {
    // payload: { fullName, dni, email, phone, address, birthDate, password }
    const res = await http.post('/user/register', payload);
    return res.data; // { id }
}

export async function checkEmailExists(email) {
    const res = await http.get('/user/email-exists', { params: { email } });
    return res.data.exists === true;
}