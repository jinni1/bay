import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import groupAbi from './abi/GroupWallet.json';

function GroupPage({ account, signer }) {
  const { address } = useParams();
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState('');
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [description, setDescription] = useState('');
  const [krw, setKRW] = useState('');
  const [rate, setRate] = useState('');

  useEffect(() => {
    if (!signer) return;
    const load = async () => {
      const contract = new ethers.Contract(address, groupAbi, signer);
      setWallet(contract);

      const bal = await contract.getBalance();
      setBalance(ethers.utils.formatEther(bal));

      const name = await contract.groupName();
      setGroupName(name);

      const mlist = await contract.getAllMembers();
      setMembers(mlist);

      const count = await contract.receiptCount();
      const result = [];
      for (let i = 0; i < count; i++) {
        const r = await contract.getReceipt(i);
        result.push({ id: i, data: r });
      }
      setReceipts(result);
    };
    load();
  }, [signer, address]);

  const submitReceipt = async () => {
    if (!description || !krw || !rate) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
    try {
      const tx = await wallet.submitReceipt(description, krw, rate);
      await tx.wait();
      alert("✅ 영수증 등록 완료!");
      window.location.reload();
    } catch (err) {
      alert("영수증 등록 실패: " + err.message);
    }
  };

  const vote = async (id) => {
    try {
      const tx = await wallet.voteReceipt(id);
      await tx.wait();
      alert("🗳 투표 완료!");
      try {
        const finalizeTx = await wallet.finalizedReceipt(id);
        await finalizeTx.wait();
        alert("✅ 과반수 찬성! 송금 완료!");
      } catch (e) {
        console.log("자동 송금 조건 미충족 또는 잔액 부족:", e.message);
      }
      window.location.reload();
    } catch (err) {
      alert("❌ 투표 중 오류: " + err.message);
    }
  };

  const deposit = async () => {
    const eth = prompt("입금할 ETH 양 (예: 0.1)");
    if (!eth || isNaN(eth) || Number(eth) <= 0) {
      alert("유효한 금액을 입력해주세요.");
      return;
    }
    try {
      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(eth)
      });
      await tx.wait();
      alert("💰 입금 완료!");
      window.location.reload();
    } catch (err) {
      alert("입금 오류: " + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏷 그룹: {groupName}</h1>
      <p>지갑 주소: {address}</p>
      <p>잔액: {balance} ETH</p>
      <button onClick={deposit}>💰 그룹에 이더 입금</button>

      <h2>👥 현재 멤버</h2>
      <ul>
        {members.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>

      <hr />
      <h2>🧾 영수증 등록</h2>
      <input placeholder="내용" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="금액 (KRW)" type="number" value={krw} onChange={e => setKRW(e.target.value)} />
      <input placeholder="환율 (1 ETH = KRW)" type="number" value={rate} onChange={e => setRate(e.target.value)} />
      <button onClick={submitReceipt}>등록</button>

      <hr />
      <h2>📋 영수증 목록</h2>
      {receipts.length === 0 && <p>등록된 영수증이 없습니다.</p>}
      <ul>
        {receipts.map(({ id, data }) => (
          <li key={id} style={{ marginBottom: '1.2rem' }}>
            <strong>{data[1]}</strong> -  {data[2].toString()} KRW →  {ethers.utils.formatEther(data[4])} ETH<br />
            결제자: {data[0]}<br />
            투표 수: {data[6].toString()}<br />
            {!data[5] && <button onClick={() => vote(id)}>🗳 투표</button>}
            {data[5] && <span>✅ 송금 완료</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupPage;