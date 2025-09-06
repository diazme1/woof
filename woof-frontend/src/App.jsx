import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Body from "./components/Body/Body";
import Footer from "./components/Footer/Footer";



const App = () => {
    return (
        <Router>
            <Header />


            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/login" element={<Login />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default App;
