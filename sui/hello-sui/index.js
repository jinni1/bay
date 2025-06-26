import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV2 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
 
// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS = '0x340344fe4cc08dc2aa9c5dfa27fb2184c08083ea169e3c691102379727f7a0ce';
 
// devnet 네트워크의 RPC url 주소를 가져와서 sui 클라이언트를 생성
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });

// transport를 customizing하는 경우 
const client = new SuiClient({
	transport: new SuiHTTPTransport({
		url: 'https://my-custom-node.com/rpc', // 노드의 주소 (dev, test, main 포함)
		websocket: { // 웹소켓
			reconnectTimeout: 1000,
			url: 'https://my-custom-node.com/websockets',
		},
		rpc: {
			headers: { // 커스텀 헤더를 설정할 수 있음 
				'x-custom-header': 'custom value',
			},
		},
	}),
});
 
// Convert MIST to Sui 단위를 mist에서 sui로 변경
const balance = (balance) => {
	return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}; 
 
// store the JSON representation for the SUI the address owns before using faucet
const suiBefore = await suiClient.getBalance({
	owner: MY_ADDRESS,
});
 
await requestSuiFromFaucetV2({
	// use getFaucetHost to make sure you're using correct faucet address
	// you can also just use the address (see Sui TypeScript SDK Quick Start for values)
	host: getFaucetHost('devnet'),
	recipient: MY_ADDRESS,
});
 
// store the JSON representation for the SUI the address owns after using faucet
const suiAfter = await suiClient.getBalance({
	owner: MY_ADDRESS,
});
 
// Output result to console.
console.log(
	`Balance before faucet: ${balance(suiBefore)} SUI. Balance after: ${balance(
		suiAfter,
	)} SUI. Hello, SUI!`,
);

// 주소가 보유한 코인 객체 정보 조회
await client.getCoins({
	owner: '<OWNER_ADDRESS>',
});

// pagination을 사용하여 데이터를 나눠서 가져올 수 있다. 
// data(현재 페이지 결과 목록), nextCursor(다음 페이지 커서 값), hasNextPage(다음 페이지 존재 여부)
const page1 = await client.getCheckpoints({
	limit: 10,
});
 
const page2 =
	page1.hasNextPage &&
	client.getCheckpoints({
		cursor: page1.nextCursor,
		limit: 10,
	});

// 이 외에도 executeTransactionBlock, signAndExecuteTransaction, waitForTransaction와 같이 다양한 
// client 메소드를 사용할 수 있다.


// graphQL을 이용할 수 있다.
// 
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
 
const gqlClient = new SuiGraphQLClient({
	url: 'https://sui-testnet.mystenlabs.com/graphql',
});
 
const chainIdentifierQuery = graphql(` 
	query {
		chainIdentifier
	}
`);
 
async function getChainIdentifier() {
	const result = await gqlClient.query({  // 쿼리를 작성하고 결과에서 원하는 데이터만 받아올 수 있다.
		query: chainIdentifierQuery,
	});
 
	return result.data?.chainIdentifier;
}