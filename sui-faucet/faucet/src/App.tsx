// src/App.tsx
import { ConnectButton } from '@mysten/dapp-kit';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaucetCreate } from './pages/FaucetCreate';
import { ConnectedAccount } from './pages/ConnectedAccount';
import { FaucetList } from './pages/FaucetList';
import { Faucet } from './pages/Faucet';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Faucet DApp</h1>
          <ConnectButton />
        </header>

        <nav className="nav-menu">
          <Link to="/" className="nav-button">지갑 상태</Link>
          <Link to="/faucet" className="nav-button">Faucet 생성</Link>
          <Link to="/faucets" className="nav-button">Faucet 목록</Link>
          <Link to="/faucets-detail" className="nav-button">Faucet</Link>
        </nav>



        <Routes>
          <Route path="/" element={<ConnectedAccount />} />
          <Route path="/faucet" element={<FaucetCreate />} />
          <Route path="/faucets" element={<FaucetList />} />
          <Route path='/faucets-detail' element={<Faucet />} />
        </Routes>
      </div>
    </Router>
  );
}
