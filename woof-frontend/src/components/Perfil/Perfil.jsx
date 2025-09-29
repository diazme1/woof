// Perfil.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./Perfil.module.css";

export default function Perfil() {
    const userLS = JSON.parse(localStorage.getItem("user"));
    const userId = userLS?.id ?? userLS?.idPaseador; // ajustá si sólo guardás uno
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});
    const [dirty, setDirty] = useState(false);
    const fileRef = useRef(null);

    // Stats
    const [paseos, setPaseos] = useState(0);
    const [antiguedad, setAntiguedad] = useState("0 días y 0 meses");

    // Paseos realizados
    useEffect(() => {
        if (!userId) return;
        axios
            .get(`http://localhost:8080/paseo/solicitudes/${userId}`)
            .then((res) => setPaseos(res.data))
            .catch(() => setPaseos(0));
    }, [userId]);

    // Antigüedad
    useEffect(() => {
        if (!userId) return;
        axios
            .get(`http://localhost:8080/user/${userId}/antiguedad`)
            .then((res) => setAntiguedad(`${res.data}`))
            .catch(() => setAntiguedad("0 días y 0 meses"));
    }, [userId]);

    // Traer usuario
    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8080/user/${userId}`).then(({ data }) => {
            setUser(data);
        });
    }, [userId]);

    // Guard salir sin guardar
    useEffect(() => {
        const onBeforeUnload = (e) => {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [dirty]);

    // Entrar a modo edición
    const startEdit = () => {
        setForm({
            nombre: user?.nombre ?? "",
            biografia: user?.biografia ?? "",
            direccion: user?.direccion ?? "",
            telefono: user?.telefono ?? "",
            fotoPreview: user?.fotoPerfilUrl ?? null,
            fotoFile: null,
        });
        setErrors({});
        setDirty(false);
        setEditMode(true);
    };

    // Cancelar edición
    const cancelEdit = () => {
        setEditMode(false);
        setForm(null);
        setErrors({});
        setDirty(false);
    };

    const onChange = (e) => {
        const { name, value, files } = e.target;
        setDirty(true);
        if (files) {
            const file = files[0];
            setForm((prev) => ({ ...prev, fotoFile: file, fotoPreview: URL.createObjectURL(file) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Validación front mínima
    const validate = () => {
        const v = {};
        if (!form.nombre.trim()) v.nombre = "Nombre (completo) obligatorio";
        if (form.telefono && !/^\+?\d[\d\s-]{6,}$/i.test(form.telefono)) v.telefono = "Teléfono inválido";
        if (form.direccion && form.direccion.length > 255) v.direccion = "Dirección demasiado larga";
        if (form.biografia && form.biografia.length > 1000) v.biografia = "Biografía demasiado larga";
        return v;
    };

    const save = async () => {
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;

        try {
            // 1) Subir foto si cambió
            if (form.fotoFile) {
                const fd = new FormData();
                fd.append("file", form.fotoFile);
                const { data } = await axios.put(`http://localhost:8080/user/${userId}/foto`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setUser((prev) => ({ ...prev, fotoPerfilUrl: data.fotoUrl }));
            }

            // 2) PUT con campos del perfil
            const payload = {
                nombre: form.nombre.trim(),
                telefono: form.telefono || null,
                direccion: form.direccion || null,
                biografia: form.biografia || null,
            };

            const { data: updated } = await axios.put(`http://localhost:8080/user/${userId}`, payload);

            // 3) Refrescar estado y LS
            setUser(updated);
            localStorage.setItem("user", JSON.stringify({ ...userLS, ...updated }));

            setDirty(false);
            setEditMode(false);
            setForm(null);
            alert("Datos modificados con éxito.");
        } catch (err) {
            if (err?.response?.data?.errors) setErrors(err.response.data.errors);
            else alert("No se pudo guardar. Intentá nuevamente.");
        }
    };

    if (!user) return <div>Cargando…</div>;

    return (
        <div className={styles.perfil}>
            {/* HEADER */}
            <div className={styles.header}>
                <div style={{ position: "relative" }}>
                    <img
                        src={
                            editMode
                                ? form.fotoPreview || user.fotoPerfilUrl || "/avatar-placeholder.png"
                                : user.fotoPerfilUrl || "/avatar-placeholder.png"
                        }
                        alt="avatar"
                        className={styles.avatar}
                        onClick={() => editMode && fileRef.current?.click()}
                    />
                    {editMode && (
                        <>
                            <button
                                type="button"
                                style={{ position: "absolute", bottom: -8, left: 0, fontSize: 12 }}
                                onClick={() => fileRef.current?.click()}
                            >
                                Cambiar foto
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={onChange} name="fotoFile" hidden />
                        </>
                    )}
                </div>

                {/* Nombre + acciones */}
                <div>
                    {!editMode ? (
                        <>
                            <h2 className={styles.title}>{user.nombre}</h2>
                            <div className={styles.actions}>
                                <button className={styles.editBtn} onClick={startEdit}>Editar perfil</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={onChange}
                                placeholder="Nombre completo *"
                                style={{ fontSize: 18, width: "100%" }}
                            />
                            {errors.nombre && <small style={{ color: "crimson", display: "block" }}>{errors.nombre}</small>}

                            <div className={styles.actions}>
                                <button className={styles.saveBtn} onClick={save}>Guardar</button>
                                <button className={styles.cancelBtn} onClick={cancelEdit}>Cancelar</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* BIO */}
            <section className={styles.bio}>
                <h3>Biografía</h3>
                {!editMode ? (
                    <p style={{ whiteSpace: "pre-wrap" }}>{user.biografia || "—"}</p>
                ) : (
                    <>
            <textarea
                name="biografia"
                value={form.biografia}
                onChange={onChange}
                rows={4}
                placeholder="Contales sobre vos y tu experiencia…"
                style={{ width: "100%" }}
            />
                        {errors.biografia && <small style={{ color: "crimson" }}>{errors.biografia}</small>}
                    </>
                )}
            </section>

            {/* CONTACTO */}
            <section className={styles.info}>
                <h3>Contacto</h3>
                {!editMode ? (
                    <>
                        <p><strong>Teléfono:</strong> {user.telefono || "—"}</p>
                        <p><strong>Dirección:</strong> {user.direccion || "—"}</p>
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Teléfono</div>
                            <input name="telefono" value={form.telefono} onChange={onChange} placeholder="+54911..." style={{ width: "100%" }} />
                            {errors.telefono && <small style={{ color: "crimson" }}>{errors.telefono}</small>}
                        </div>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Dirección</div>
                            <input name="direccion" value={form.direccion} onChange={onChange} placeholder="Calle 123, Ciudad" style={{ width: "100%" }} />
                            {errors.direccion && <small style={{ color: "crimson" }}>{errors.direccion}</small>}
                        </div>
                    </>
                )}
            </section>

            {/* ESTADÍSTICAS */}
            <section className={styles.stats}>
                <h3>Estadísticas</h3>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{paseos}</span>
                        <span>Paseos realizados</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{antiguedad}</span>
                        <span>Antigüedad</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
