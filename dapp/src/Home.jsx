import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { FACTORY_ABI, FACTORY_ADDRESS } from './abi/GroupWalletFactory.js';
import groupAbi from './abi/GroupWallet.json';

function Home({ account, signer }) {
  const [factory, setFactory] = useState(null);
  const [groupInfos, setGroupInfos] = useState([]);
  const [showOnlyMyGroups, setShowOnlyMyGroups] = useState(false); // ✅ 변경: 필터링 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      setFactory(contract);
    }
  }, [signer]);

  const loadGroups = async () => {
    if (!factory) return;
    const list = await factory.getAllGroups();
    const result = [];
    for (const addr of list) {
      const wallet = new ethers.Contract(addr, groupAbi, signer.provider);
      const name = await wallet.groupName();

      if (showOnlyMyGroups) { // ✅ 변경: 내 그룹만 보기 조건 추가
        const isMe = await readOnly.isMember(account);
        if (!isMe) continue;
      }

      result.push({ address: addr, name });
    }
    setGroupInfos(result);
  };

  const createGroup = async () => {
    const name = prompt("모임 이름을 입력하세요");
    if (!name) return;

    const raw = prompt("초대할 멤버 지갑 주소들 (쉼표로 구분)");
    const memberList = raw
      ? raw.split(',').map(addr => addr.trim()).filter(Boolean)
      : [];

    if (!memberList.includes(account)) {
      memberList.push(account);
    }

    await factory.createGroup(memberList, name);
    await loadGroups();
  };

  useEffect(() => {
    if (factory) loadGroups();
  }, [factory, showOnlyMyGroups]); // ✅ 변경: 필터링 여부 의존성 추가

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧾 공통 지갑 DApp</h1>

      {account && (
        <>
          <button onClick={createGroup}>➕ 그룹 만들기</button>
          <button onClick={() => setShowOnlyMyGroups(!showOnlyMyGroups)} style={{ marginLeft: '1rem' }}>
            {showOnlyMyGroups ? '📃 전체 보기' : '👤 내 그룹만 보기'}
          </button> {/* ✅ 변경: 토글 버튼 추가 */}

          <h2>📋 그룹 목록</h2>
          <ul>
            {groupInfos.map((g, i) => (
              <li key={i}>
                <a href="#" onClick={() => navigate(`/group/${g.address}`)}>
                  🏷 {g.name} ({g.address.slice(0, 6)}...)
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Home;
