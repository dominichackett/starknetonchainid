use starknet::ContractAddress;
#[starknet::interface]
trait IdentityGatewayTrait<T> {
    fn get_owner(self: @T) -> ContractAddress;
    fn get_id(self:@T,user:ContractAddress) ->ContractAddress;
    fn createId(ref self: T);
 }   
    
#[starknet::contract]
mod IdentityGateway {
    use super::ContractAddress;
    use starknet::ClassHash;
    use starknet::SyscallResult;
    use starknet::get_caller_address;
    use core::poseidon::PoseidonTrait;
    use starknet::get_block_timestamp;
    use starknet::deploy_syscall;

 
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Identity {
        owner: ContractAddress,
        identity:ContractAddress,
    
    }

   #[storage]
    struct Storage {
        owner: ContractAddress,
        class_hash:ClassHash,
        ids: LegacyMap::<ContractAddress, Identity>,
        
    }

      #[constructor]
        fn constructor(ref self: ContractState,class_hash:ClassHash) {
           let caller = get_caller_address(); 
           self.owner.write(caller);
           self.class_hash.write(class_hash);
    }


     /// @dev Event that gets emitted when an id is generated
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        IdentityCreated: IdentityCreated,
        
    }

    /// @dev Represents an Id that was added
    #[derive(Drop, starknet::Event)]
    struct IdentityCreated {
        
        identity:ContractAddress,
        owner: ContractAddress,
        date_created:u64,

    }

     #[abi(embed_v0)]
    impl IdentityGatewayImpl of super::IdentityGatewayTrait<ContractState> {
       fn get_owner(self: @ContractState) -> ContractAddress{
         self.owner.read()
       }

    fn get_id(self:@ContractState,user:ContractAddress) ->ContractAddress {
      self.ids.read(user).identity   
    }


    fn createId(ref self: ContractState){
       let caller = get_caller_address();
       let mut calldata =  ArrayTrait::<felt252>::new();
       calldata.append(caller.into());
       self.idDoesNotExist(); 
       let (identity,_) = deploy_syscall(self.class_hash.read() ,
     caller.into(),
    calldata.span(),
     false).unwrap();


       self.emit(IdentityCreated{identity:identity,owner:caller,date_created:get_block_timestamp()});   
   }   

}

#[generate_trait]
    impl PrivateMethods of PrivateMethodsTrait {
        fn idDoesNotExist(self: @ContractState) {
            let caller = get_caller_address();
            assert(caller != self.ids.read(caller).owner, 'ID exist.');
        }
          

   
  
    }
}