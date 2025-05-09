module my_first_package::example;

// Part 1: These imports are provided by default 기본으로 제공 
// use sui::object::{Self, UID};
// use sui::transfer;
// use sui::tx_context::{Self, TxContext};
// object, transfer, tx_context 등은 기본 제공되며 use문 없이 사용 가능하다 

// Part 2: struct definitions 구조체 정의
public struct Sword has key, store {
    id: UID,
    magic: u64,
    strength: u64,
}

public struct Forge has key {
    id: UID,
    swords_created: u64,
}

// Part 3: Module initializer to be executed when this module is published 초기화 함수 (모듈 배포 시 한 번 실행됨)
fun init(ctx: &mut TxContext) {
    let admin = Forge {
        id: object::new(ctx),
        swords_created: 0,
    };

    // Transfer the forge object to the module/package publisher
    transfer::transfer(admin, ctx.sender());
}

// Part 4: Accessors required to read the struct fields 접근자 함수 (필드 읽기)
// 외부에서 구조체의 필드를 읽을 수 있도록 공개 함수로 제공한다 
public fun magic(self: &Sword): u64 {
    self.magic
}

public fun strength(self: &Sword): u64 {
    self.strength
}

public fun swords_created(self: &Forge): u64 {
    self.swords_created
}

public fun sword_create(magic: u64, strength: u64, ctx: &mut TxContext): Sword {
    Sword {
        id: object::new(ctx),
        magic: magic,
        strength: strength,
    }
}


// Part 5: Public/entry functions (introduced later in the tutorial)

// Part 6: Tests
#[test]
fun test_sword_create() {
    // Create a dummy TxContext for testing
    let mut ctx = tx_context::dummy();

    // Create a sword
    let sword = Sword {
        id: object::new(&mut ctx),
        magic: 42,
        strength: 7,
    };

    // Check if accessor functions return correct values
    assert!(sword.magic() == 42 && sword.strength() == 7, 1);

    //  객체를 다른 주소로 보내줌 
    let dummy_address = @0xCAFE;
    transfer::public_transfer(sword, dummy_address);

}

#[test]
fun test_sword_transactions() {
    use sui::test_scenario;  // 시뮬레이션 시작 

    let initial_owner = @0xCAFE;
    let final_owner = @0xFACE;

    let mut scenario = test_scenario::begin(initial_owner);
    {
        let sword = sword_create(42, 7, scenario.ctx());
        transfer::public_transfer(sword, initial_owner);
    };

    scenario.next_tx(initial_owner);
    {
        let sword = scenario.take_from_sender<Sword>();
        transfer::public_transfer(sword, final_owner);
    };

    scenario.next_tx(final_owner);  // 다음 트랜잭션 시작 
    {
        let sword = scenario.take_from_sender<Sword>();  // 해당 주소의 객체 가져오기 
        assert!(sword.magic() == 42 && sword.strength() == 7, 1);
        scenario.return_to_sender(sword)  // 객체를 반환하여 유효 상태 유지하기 
    };
    scenario.end();
}
