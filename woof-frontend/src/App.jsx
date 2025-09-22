import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Body from "./components/Body/Body";
import Footer from "./components/Footer/Footer";
import PaseoForm from "./components/PaseoForm/PaseoForm";
import DashboardPaseos from "./components/Paseos/DashboardPaseos";
import PaseadorDashboard from "./components/Dashboard/PaseadorDashboard";
import ClienteDashboard from "./components/Dashboard/ClienteDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";

const App = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Router>
            <Header />

            <Routes>
                {/* Home según rol */}
                <Route
                    path="/"
                    element={
                        !user ? (
                            <Body /> // no logueado
                        ) : user.rol === "ROLE_PASEADOR" ? (
                            <PaseadorDashboard />
                        ) : user.rol === "ROLE_CLIENTE" ? (
                            <ClienteDashboard />
                        ) : user.rol === "ROLE_ADMIN" ? (
                            <AdminDashboard />
                        ) : (
                            <Body />
                        )
                    }
                />

                {/* Rutas adicionales */}
                <Route path="/login" element={<Login />} />
                <Route path="/solicitudes" element={<DashboardPaseos />} />
                <Route path="/paseos" element={<PaseoForm />} />
            </Routes>

            <Footer />
        </Router>
    );
};
export default App;
