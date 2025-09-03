import React, { useState } from 'react';
import GlobalForm from '../components/GlobalForm';
import { registerWalker, checkEmailExists } from '../services/User';


// faltan los validators (logica de validacion)


export default function RegisterWalker() {
    const [ok, setOk] = useState(false);

    const fields = [
        {name: 'fullName', label: 'Nombre completo', type: 'text', required: true},
        {name: 'dni', label: 'DNI', type: 'text', required: true, normalize: digitsOnly},
        {
            name: 'email', label: 'Email', type: 'email', required: true,
            validate: validateEmail,
            asyncValidate: async (v) => (await checkEmailExists(v)) ? 'Ya existe un paseador con ese email.' : true
        },
        {name: 'phone', label: 'Teléfono', type: 'tel', required: true, normalize: digitsOnly, validate: validatePhone},
        {name: 'address', label: 'Dirección', type: 'text', required: true},
        {name: 'birthDate', label: 'Fecha de nacimiento', type: 'date', required: true, validate: validateAdult},
        {name: 'password', label: 'Contraseña', type: 'password', required: true}
    ];

    async function onSubmit(values, {setError, reset}) {
        const payload = {
            ...values,
            email: String(values.email).toLowerCase(),
            phone: digitsOnly(values.phone),
        };
        try {
            await registerWalker(payload);
            setOk(true);
            reset();
        } catch (e) {
            const data = e.response?.data;
            if (data?.errors?.length) {
                for (const err of data.errors) setError(err.field, {type: 'server', message: err.message});
            } else if (data?.field && data?.message) {
                setError(data.field, {type: 'server', message: data.message}); // p.ej. 409 email duplicado
            } else {
                setError('root', {type: 'server', message: 'Ocurrió un error. Intentá de nuevo.'});
            }
        }
    }

    return (
        <>
            <h1>Registrate</h1>
            <GlobalForm fields={fields} onSubmit={onSubmit} submitLabel="Crear cuenta"/>
            {ok && (
                <div role="dialog" aria-modal="true" className="modal">
                    <p>✅ Registro realizado exitosamente</p>
                    <button onClick={() => {
                        setOk(false);
                        window.location.href = '/login';
                    }}>
                        Tengo cuenta, quiero iniciar sesión
                    </button>
                </div>
            )}
        </>
    );
}
// se podria hacer un pop up de componente que reciba un prop de que fue el registro exitoso.