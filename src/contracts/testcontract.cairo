use starknet::ContractAddress;
#[starknet::interface]
trait IdentityTestTrait<T> {
    
    fn setMessage(ref self: T,message:ByteArray);
    fn getMessage(ref self:T)->(ByteArray,ContractAddress);
 }   
#[starknet::interface]
trait IdentityGateway<TContractState> {
    fn get_id(self:@TContractState,user:ContractAddress) ->ContractAddress;

}

#[starknet::interface]
trait Identity<T> {
    fn isValidClaim(self:@T,issuer:ContractAddress,claim_topic:u256) ->bool;

}

 #[starknet::contract]
mod IdentityTest {
    use super::ContractAddress;
    use starknet::get_caller_address;
    use super::IdentityDispatcherTrait;
    use super::IdentityDispatcher;
    use super::IdentityGatewayDispatcherTrait;
    use super::IdentityGatewayDispatcher;

     #[storage]
    struct Storage {
        lastMessage:ByteArray,
        lastCaller:ContractAddress,
        identityGateway:ContractAddress
        
 

    }
      #[constructor]
        fn constructor(ref self: ContractState, identityGateway: ContractAddress) {
           self.identityGateway.write(identityGateway);
         
    }

     #[abi(embed_v0)]
    impl IdentityImpl of super::IdentityTestTrait<ContractState> {
            fn setMessage(ref self: ContractState,message:ByteArray) {
                let id = self.get_id();
                let caller = get_caller_address();
                assert(self.isValidClaim(id),'Invalid Claim');
                self.lastCaller.write(caller);
                self.lastMessage.write(message);
                    
            }


            fn getMessage(ref self:ContractState) -> (ByteArray,ContractAddress) {
                 let id = self.get_id();
                assert(self.isValidClaim(id),'Invalid Claim'); 
               (self.lastMessage.read(),self.lastCaller.read())
            }


    }

    #[generate_trait]
    impl PrivateMethods of PrivateMethodsTrait {
        fn get_id(self: @ContractState) ->ContractAddress{
            let caller = get_caller_address();
              let contract_address = self.identityGateway.read();
              let id = IdentityGatewayDispatcher { contract_address}.get_id(caller);
              assert(!id.is_zero(),'You don\'t have an ID');
              id
        }

         fn isValidClaim(self: @ContractState,contract_address:ContractAddress) ->bool{
             let caller = get_caller_address();
             IdentityDispatcher { contract_address}.isValidClaim(caller,1)
    }  

   
  
    }

}
    