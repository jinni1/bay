module faucet::faucet;

use sui::sui::SUI;
use sui::coin::{Self, Coin}; // Self -> sui::coin을 의미 
use sui::balance::{Self, Balance};
use sui::tx_context::{TxContext, sender};
use sui::object::{UID, new};
use sui::transfer;
use sui::table;
use std::vector;

public struct Faucet has key, store {
    id: UID,
    balance: Coin<SUI>,
    requesters: table::Table<address, bool>,
    history: vector<address>,
}

public entry fun init_faucet (coin: Coin<SUI>, ctx: &mut TxContext) {
    let id = new(ctx);
    let balance = coin;
    let requesters = table::new<address, bool>(ctx);
    let history = vector::empty<address>();

    let faucet = Faucet{
        id,
        balance,
        requesters,
        history,
    };

    let recipient = sender(ctx);
    transfer::public_transfer(faucet, recipient);

} // Faucet 생성


public entry fun request_tockens (faucet: &mut Faucet, ctx: &mut TxContext) {
    let requester = sender(ctx);
    let already = table::contains(&faucet.requesters, requester);
    assert!(!already, 100); // 이미 요청했으면 100 에러코드 

    table::add(&mut faucet.requesters, requester, true);
    vector::push_back(&mut faucet.history, requester);

    let amount = 1_000_000;
    let give = coin::split(&mut faucet.balance, amount, ctx);

    transfer::public_transfer(give, requester);
}


public fun get_balance (faucet: &Faucet) :u64 {
    coin::value(&faucet.balance)
} // 잔액 표시

public fun get_history (faucet: &Faucet) : vector<address> {
    faucet.history
} // 요청 기록