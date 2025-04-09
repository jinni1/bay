import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import GroupPage from './GroupPage';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크를 설치해주세요.");
      return;
    }

    const prov = new ethers.providers.Web3Provider(window.ethereum);
    await prov.send("eth_requestAccounts", []);
    const sign = prov.getSigner();
    const addr = await sign.getAddress();

    setProvider(prov);
    setSigner(sign);
    setAccount(addr);
  };

  const disconnectWallet = () => {
    setAccount('');
    setSigner(null);
    setProvider(null);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setSigner(provider.getSigner());
      } else {
        disconnectWallet();
      }
    });
  }, [provider]);

  return (
    <BrowserRouter>
      <div style={{ padding: "1rem" }}>
        {account ? (
          <>
            <button onClick={disconnectWallet}>❌ 연결 해제</button>
            <span style={{ marginLeft: '1rem' }}>
              🔗 {account.slice(0, 6)}... 연결됨
            </span>
          </>
        ) : (
          <button onClick={connectWallet}>지갑 연결</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home account={account} signer={signer} />} />
        <Route path="/group/:address" element={<GroupPage account={account} signer={signer} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
