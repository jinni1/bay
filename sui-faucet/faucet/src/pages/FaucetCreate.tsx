import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';


const ONE_SUI = 1_000_000_000;
const FAUCET_PACKAGE = import.meta.env.VITE_FAUCET_PACKAGE_ID;
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet')});


export function FaucetCreate() {
    // 계정 불러오기
    const account = useCurrentAccount();
    
    const { mutateAsync: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction({
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
    

    const handleClick = async() => {
        if (!account?.address) {
            alert('지갑을 연결해주세요');
            return;
        }

        // 트랜잭션 생성
        const tx = new Transaction();

        const [oneSuiCoin] = tx.splitCoins(tx.gas, [ONE_SUI]);

        tx.setSender(account.address);

        tx.moveCall({
            target: `${FAUCET_PACKAGE}::faucet::init_faucet`,
            arguments: [
                oneSuiCoin,
            ],
        });

        
        try {
            const { digest, objectChanges } = await signAndExecuteTransaction({ transaction : tx });

            console.log('트랜잭션 완료:', digest);
            console.log('effects:', objectChanges);
        } catch (err) {
            console.error('트랜잭션 실패:', err);
        }
    }

    return (
        <button onClick={handleClick} disabled={isPending} className="border p-2 rounded">
			{isPending ? '전송 중...' : 'SUI 전송하기'}
		</button>
    );
};