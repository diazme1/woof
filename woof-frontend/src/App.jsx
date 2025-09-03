import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";

const App = () => {
    return (
        <Router>
            <Header />

            <Routes>
                {/* Redirige al login */}
                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
};

export default App;
