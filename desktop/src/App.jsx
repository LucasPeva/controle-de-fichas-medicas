import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './index.css';
import LoginForm from './LoginForm';
import ListaFichas from './ListaFichas';
import Configuracoes from './Configuracoes';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<ListaFichas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}

export default App;