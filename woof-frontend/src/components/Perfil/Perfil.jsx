import { useEffect, useState, useRef } from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import styles from "./Perfil.module.css";

export default function Perfil() {
    const { paramUserId } = useParams();
    const userLS = JSON.parse(localStorage.getItem("user"));
    const userId = paramUserId || userLS?.id;
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});
    const [dirty, setDirty] = useState(false);
    const fileRef = useRef(null);
    const [resenias, setResenias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // POP UP
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    function openToast(msg) {
        setToastMsg(msg);
        setToastOpen(true);

        setTimeout(() => setToastOpen(false), 2500);
    }

    function toImageSrc(u, id) {
        if (!u) return null;
        if (/^[A-Za-z]:\\/.test(u) || u.startsWith("\\\\")) {
            return `http://localhost:8080/user/${id}/foto-perfil`;
        }
        if (u.startsWith("/")) return `http://localhost:8080${u}`;
        return u;
    }

    // Stats
    const [paseos, setPaseos] = useState(0);
    const [antiguedad, setAntiguedad] = useState("0 días y 0 meses");

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8080/paseo/solicitudes/${userId}`)
            .then((res) => setPaseos(res.data))
            .catch(() => setPaseos(0));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8080/user/${userId}/antiguedad`)
            .then((res) => setAntiguedad(`${res.data}`))
            .catch(() => setAntiguedad("0 días y 0 meses"));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8080/user/${userId}`).then(({ data }) => {
            setUser(data);
        });
    }, [userId]);

    useEffect(() => {
        const onBeforeUnload = (e) => {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [dirty]);

    useEffect(() => {
        if (!userId) return;
        fetchResenias();
        const interval = setInterval(fetchResenias, 10000);
        return () => clearInterval(interval);
    }, [userId]);

    const fetchResenias = async () => {
        try {
            const { data: resenias } = await axios.get(`http://localhost:8080/resenia/paseador/${userId}`);

            // Pedimos la info de cada cliente en paralelo
            const reseniasConClientes = await Promise.all(
                resenias.map(async (r) => {
                    try {
                        const { data: cliente } = await axios.get(`http://localhost:8080/resenia/cliente/${r.idCliente}`);
                        return { ...r, cliente };
                    } catch {
                        return { ...r, cliente: null };
                    }
                })
            );

            setResenias(reseniasConClientes);
        } catch (err) {
            console.error("Error al obtener reseñas:", err);
            setResenias([]);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = () => {
        setForm({
            nombre: user?.nombre ?? "",
            alias: user?.alias ?? "",
            biografia: user?.biografia ?? "",
            direccion: user?.direccion ?? "",
            telefono: user?.telefono ?? "",
            fotoPreview: toImageSrc(user?.fotoPerfilUrl, userId) ?? null,
            fotoFile: null,
        });
        setErrors({});
        setDirty(false);
        setEditMode(true);
    };

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
            setForm((prev) => ({
                ...prev,
                fotoFile: file,
                fotoPreview: URL.createObjectURL(file),
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validate = () => {
        const v = {};
        if (!form.nombre.trim()) v.nombre = "Nombre completo obligatorio";
        if (form.alias?.trim()) {
            const a = form.alias.trim();
            if (a.length < 6 || a.length > 20 || !/^[A-Za-z0-9.-]+$/.test(a)) {
                v.alias = "Alias inválido";
            }
        }
        if (form.telefono && !/^\+?\d[\d\s-]{6,}$/i.test(form.telefono)) v.telefono = "Teléfono inválido";
        if (form.direccion && form.direccion.length > 255) v.direccion = "Dirección demasiado larga";
        if (form.biografia && form.biografia.length > 500) v.biografia = "Biografía demasiado larga";
        return v;
    };

    // 🔍 Detectar si realmente hay cambios
    const computeDiffs = (u, f) => {
        if (!u || !f) return [];
        const norm = (s) => (s ?? "").trim();
        const diffs = [];
        if (norm(u.nombre) !== norm(f.nombre)) diffs.push("nombre");
        if (norm(u.alias ?? "") !== norm(f.alias ?? "")) diffs.push("alias");
        if ((u.telefono ?? "") !== (f.telefono ?? "")) diffs.push("telefono");
        if ((u.direccion ?? "") !== (f.direccion ?? "")) diffs.push("direccion");
        if ((u.biografia ?? "") !== (f.biografia ?? "")) diffs.push("biografia");
        if (f.fotoFile) diffs.push("foto");
        return diffs;
    };

    const save = async () => {
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;

        const diffs = computeDiffs(user, form);
        // Si no hubo cambios, salir “silenciosamente” del modo edición
        if (diffs.length === 0) {
            setDirty(false);
            setEditMode(false);
            setForm(null);
            return;
        }

        try {
            let newFotoUrl = null;

            if (form.fotoFile) {
                const fd = new FormData();
                fd.append("file", form.fotoFile);
                const { data } = await axios.put(`http://localhost:8080/user/${userId}/foto`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                newFotoUrl = `${toImageSrc(data.fotoUrl, userId)}?t=${Date.now()}`;
                setUser((prev) => ({ ...prev, fotoPerfilUrl: newFotoUrl }));
            }

            const payload = {
                nombre: form.nombre.trim(),
                alias: form.alias.trim(),
                telefono: form.telefono || null,
                direccion: form.direccion || null,
                biografia: form.biografia || null,
            };

            const { data: updated } = await axios.put(`http://localhost:8080/user/${user.id}`, payload);

            const merged = {
                ...updated,
                fotoPerfilUrl:
                    newFotoUrl ??
                    toImageSrc(updated.fotoPerfilUrl, userId) ??
                    toImageSrc(user?.fotoPerfilUrl, userId) ??
                    null,
            };

            setUser(merged);
            localStorage.setItem("user", JSON.stringify({ ...userLS, ...merged }));

            setDirty(false);
            setEditMode(false);
            setForm(null);

            // ✅ Mostrar toast de éxito SÓLO si hubo cambios reales
            openToast("Datos modificados con éxito.");
        } catch (err) {
            if (err?.response?.data?.errors) setErrors(err.response.data.errors);
            else if (err?.response?.data) alert(err.response.data);
            else alert("No se pudo guardar. Intentá nuevamente.");
        }
    };

    if (!user) return <div>Cargando…</div>;

    const liveUrl = toImageSrc(user.fotoPerfilUrl, userId);
    const imgSrc = editMode
        ? form.fotoPreview || liveUrl || "/avatar-placeholder.png"
        : liveUrl || "/avatar-placeholder.png";

    const isOwnProfile = !!userLS && (
        Number(userLS.id) === Number(userId) ||
        Number(userLS.idPaseador) === Number(userId)
    );

    return (
        <div className={styles.perfil}>
            {/* HEADER */}
            <div className={styles.header}>
                <div style={{ position: "relative" }}>
                    <img
                        src={imgSrc}
                        alt="avatar"
                        className={styles.avatar}
                        onClick={() => editMode && fileRef.current?.click()}
                    />
                    {editMode && isOwnProfile && (
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

                <div>
                    {!editMode ? (
                        <>
                            <h2 className={styles.title}>{user.nombre}</h2>
                            {isOwnProfile && (
                                <div className={styles.actions}>
                                    <button className={styles.editBtn} onClick={startEdit}>
                                        Editar perfil
                                    </button>
                                </div>
                            )}
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
                        <p><strong>Alias para transferencias:</strong> {user.alias ?? "—"}</p>
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Teléfono</div>
                            <input
                                name="telefono"
                                value={form.telefono}
                                onChange={onChange}
                                placeholder="+54911..."
                                style={{ width: "100%" }}
                            />
                            {errors.telefono && <small style={{ color: "crimson" }}>{errors.telefono}</small>}
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Dirección</div>
                            <input
                                name="direccion"
                                value={form.direccion}
                                onChange={onChange}
                                placeholder="Calle 123, Ciudad"
                                style={{ width: "100%" }}
                            />
                            {errors.direccion && <small style={{ color: "crimson" }}>{errors.direccion}</small>}
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Alias para transferencias</div>
                            <input
                                name="alias"
                                value={form.alias}
                                onChange={onChange}
                                placeholder="mi.alias.banco"
                                maxLength={20}
                                style={{ width: "100%" }}
                            />
                            {errors.alias && <small style={{ color: "crimson" }}>{errors.alias}</small>}
                            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                                6–20 caracteres. Permitidos: letras, números, punto y guion.
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* ESTADISTICAS */}
            <section className={styles.stats}>
                <h3>Estadísticas</h3>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{paseos}</span>
                        <span>Paseos realizados</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{antiguedad}</span>
                        <span>Antiguedad</span>
                    </div>
                </div>
            </section>

            {/* RESEÑAS */}
            <section className={styles.resenias}>
                <h3>Reseñas y Opiniones</h3>
                {resenias.length === 0 ? (
                    <div className={styles.emptyResenias}>
                        <p>Este paseador aún no posee reseñas.</p>
                    </div>
                ) : (
                    <ul className={styles.reseniasList}>
                        {resenias.map((r) => (
                            <li key={r.id} className={styles.reseniaCard}>
                                <div className={styles.puntuacion}>
                                    {r.puntuacion} ⭐
                                </div>
                                <p className={styles.descripcion}><strong>{r.cliente.nombre}</strong></p>
                                <p className={styles.descripcion}>{r.cliente.email}</p>
                                <p className={styles.descripcion}>{r.descripcion}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* POP UP  */}
            {toastOpen && (
                <div className={styles.toastOverlay} role="presentation" onClick={() => setToastOpen(false)}>
                    <div
                        className={styles.toastModal}
                        role="dialog"
                        aria-modal="true"
                        aria-live="polite"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>{toastMsg}</span>
                        <button
                            className={styles.toastClose}
                            onClick={() => setToastOpen(false)}
                            aria-label="Cerrar notificación"
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
