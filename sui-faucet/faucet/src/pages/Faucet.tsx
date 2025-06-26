import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";

const FAUCET_PACKAGE = import.meta.env.VITE_FAUCET_PACKAGE_ID;
const FAUCET_OBJECT = import.meta.env.VITE_FAUCET_OBJECT;

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet')});

export function Faucet() {
    const [recipient, setRecipient] = useState('');
    const [balance, setBalance] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction({
                execute: async ({ bytes, signature }) => {
                    const result = await suiClient.executeTransactionBlock({
                        transactionBlock: bytes,
                        signature,
                        options: {
                            showRawEffects: true,
                            showObjectChanges: true,
                        },
                    });
                    // 반드시 필요한 값을 명시적으로 리턴
                    return {
                        digest: result.digest,
                        objectChanges: result.objectChanges,
                    };
                },
            });

    const fetchFaucetInfo = async() => {
        try{
            const { data } = await suiClient.getObject({
                id: FAUCET_OBJECT,
                options: { showContent: true },
            });

            const fields = (data?.content as any).fields;
            setBalance(fields.balance.fields.value);
            setHistory(fields.history);
        } catch (err) {
            console.log("Faucet 정보 조회 실패: ", err);
        }
    };

    useEffect(() => {
        fetchFaucetInfo();
    }, []);

    const handleRequest = async() => {
        
        
        if (!recipient.startsWith('0x') || recipient.length !==66) {
            alert('정확한 주소를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const tx = new Transaction();
            const faucetObj = tx.object(FAUCET_OBJECT);

            tx.moveCall({
                target: `${FAUCET_PACKAGE}::faucet::request_tockens`,
                arguments: [faucetObj],
            });

            const { digest, objectChanges } = await signAndExecuteTransaction({ transaction: tx});

            console.log('요청 완료: ', digest, objectChanges);
            alert('전송 완료');
            await fetchFaucetInfo();
        } catch (err) {
            console.log("err:", err);
        } finally{
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
        <h1>Faucet 페이지</h1>

        <div style={{ marginBottom: 16 }}>
        <label>주소 입력 (지갑 주소): </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ width: '400px', marginRight: 8 }}
        />
        <button onClick={handleRequest} disabled={loading}>
          {loading ? '전송 중...' : '수이 전송'}
        </button>
      </div>

      <div style={{ marginTop: 32 }}>
        <h3>잔액</h3>
        <p>{balance ? `${Number(balance) / 1e9} SUI` : '불러오는 중...'}</p>
      </div>

      <div style={{ marginTop: 32 }}>
        <h3>요청 기록 (history)</h3>
        {history.length > 0 ? (
          <ul>
            {history.map((addr, i) => (
              <li key={i}>{addr}</li>
            ))}
          </ul>
        ) : (
          <p>기록 없음</p>
        )}
      </div>
    </div>
  );

}