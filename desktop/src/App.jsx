import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './index.css';
import LoginForm from './pages/TelaLogin';
import ListaFichas from './pages/ListaFichas';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuarios';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<ListaFichas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path='/usuarios' element={<Usuarios />} />
      </Routes>
    </Router>
  );
}

export default App;