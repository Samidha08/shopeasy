import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/main.css';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default MainLayout;
