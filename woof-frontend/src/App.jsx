import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Body from "./components/Body/Body";

const App = () => {
    return (
        <Router>
            <Header></Header>
            <Body></Body>

            <Routes>
                {/* Redirige al login */}
                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
};

export default App;
