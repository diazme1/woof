import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Body from "./components/Body/Body";
import Footer from "./components/Footer/Footer";
import PaseoForm from "./components/PaseoForm/PaseoForm";
import DashboardPaseos from "./components/Paseos/DashboardPaseos";



const App = () => {
    return (
        <Router>
            <Header />


            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/login" element={<Login />} />
                <Route path="/solicitudes" element={<DashboardPaseos />} />
                <Route path="/paseos" element={<PaseoForm />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default App;
