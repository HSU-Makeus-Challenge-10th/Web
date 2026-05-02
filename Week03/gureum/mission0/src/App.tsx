import "./styles/App.css";
import Header from "./components/Header";
import AeongPage from "./pages/AeongPage";
import JoyPage from "./pages/JoyPage";
import MatthewPage from "./pages/MatthewPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Route, Routes } from "./router";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/matthew" component={MatthewPage} />
        <Route path="/aeong" component={AeongPage} />
        <Route path="/joy" component={JoyPage} />
        <Route path="/not-found" component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;