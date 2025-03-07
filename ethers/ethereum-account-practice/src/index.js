const { ethers } = require('ethers');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const wallet = ethers.Wallet.createRandom();
// createRandom() : 랜덤으로 pri key와 지갑을 생성

console.log('random wallet: ', wallet);

//const privateKey = wallet.privateKey;
//console.log('Private key: ', privateKey);
const privateKey = 'b476d082d0a32768929d148c14c34c4eb8373832c45dc7ca6bb46c7b3a39099a';

const keyPair = ec.keyFromPrivate(privateKey);
// ec 객체에 접근하여 private key를 컴퓨터가 읽을 수 있도록
// keyFromPrivate 메소드를 통해 입력된 private ket 문자열을 통해
// 타원 곡선 연산을 진행하고 나면 public key의 keyPair을 생성한다. 

const myPublicKey = keyPair.getPublic().encodeCompressed('hex');
//getPublic() 메소드 : keyPair에서 public key를 추출
//encodeCompressed('hex') : hex로 압축
console.log('myPublicKey:::', myPublicKey);

const address = wallet.address;
console.log('My ethereum address: ', address);

