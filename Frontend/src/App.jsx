import Navbar from './components/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './styles/App.css';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
    </>
  );
}
