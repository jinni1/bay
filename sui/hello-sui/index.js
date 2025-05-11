import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
 
// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS = '0x340344fe4cc08dc2aa9c5dfa27fb2184c08083ea169e3c691102379727f7a0ce';
 
// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });
// sui client 객체 생성
 
// Convert MIST to Sui
const balance = (balance) => {
	return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}; // 단위를 mist -> sui 변경
 
// store the JSON representation for the SUI the address owns before using faucet
const suiBefore = await suiClient.getBalance({
	owner: MY_ADDRESS,
});
 
await requestSuiFromFaucetV1({
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