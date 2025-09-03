import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import ClientForm from "./components/ClientForm/ClientForm";


const App = () => {
    return (
        <Router>
            <Header></Header>

            <Routes>
                <Route path="/login" element={<ClientForm />} />
            </Routes>
        </Router>
    )
}


export default App;