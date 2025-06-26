import { Transaction } from '@mysten/sui/transactions';
 
// 동일한 유형의 트랜잭션을 하나의 트랜잭션에 여러 개 연결할 수 있다.
// 예시로 여러 개의 송금 정보를 리스트로 받아 이를 반복하면서 
// 각각에게 코인을 전송할 수 있다. 


// 새로운 트랜잭션 생성
const tx = new Transaction();

// 한 명에게 보내는 코드 
// 가스에서 100만큼 분할
const [coin] = tx.splitCoins(tx.gas, [100]);

// 분할한 코인을 해당 주소로 전송
tx.transferObjects([coin], '0xSomeSuiAddress');


// 여러 명에게 보내는 코드
/*
interface Transfer {
	to: string;
	amount: number;
}
 
// 전송할 대상 리스트
const transfers: Transfer[] = getTransfers();
 
const tx = new Transaction();
 
// 코인을 여러 개로 분할
const coins = tx.splitCoins(
	tx.gas,
	transfers.map((transfer) => transfer.amount),
);
 
// 각각에게 코인 전송
transfers.forEach((transfer, index) => {
	tx.transferObjects([coins[index]], transfer.to);
});
*/

// 실행
client.signAndExecuteTransaction({ signer: keypair, transaction: tx });

// waitForTransaction 메소드를 사용하여 이후 실행되는 함수는
//  transaction의 effect가 반영된 상태를 보장한다.
await client.waitForTransaction({ digest: result.digest });

// 가스
tx.setGasPrice(gasPrice); // 가스 가격 설정
tx.setGasBudget(gasBudgetAmount); // 가스 예산 설정
