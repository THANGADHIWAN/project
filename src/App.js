import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Blog from "./Blog";
import Admin from "./Admin";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 space-x-4 border-b">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
