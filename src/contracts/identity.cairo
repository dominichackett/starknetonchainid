
use starknet::ContractAddress;
#[starknet::interface]
trait IdentityTrait<T> {
    fn get_owner(self: @T) -> ContractAddress;
    //fn constructor(ref self: T,init_owner: ContractAddress);
    fn add_claim(ref self: T,claim_topic:u256, claim_content: ByteArray,expires:u64);
    fn add_issuer(ref self: T,issuer_address: ContractAddress);
    fn remove_issuer(ref self: T,issuer_address: ContractAddress);
    fn get_claim(self: @T,claim_id: felt252) ->Identity::Claim ;
    fn get_claimByIssuerAndTopic(self: @T,issuer:ContractAddress,claim_topic:u256) ->Identity::Claim ;
    fn remove_claim(ref self: T,claim_id: felt252);
    fn isValidClaim(self:@T,issuer:ContractAddress,claim_topic:u256) ->bool;
    
    
}



#[starknet::contract]
mod Identity {
    use super::ContractAddress;
    use starknet::get_caller_address;
    use core::poseidon::PoseidonTrait;
    use starknet::get_block_info;	
    use starknet::get_block_timestamp;
    use starknet::get_contract_address;	

    use core::hash::{HashStateTrait, HashStateExTrait};

    // Define a Claim struct

#[derive(Drop, Hash)]
struct StructForHash {
    issuer:ContractAddress ,
    topic:u256,
}

#[derive(Drop,Serde, starknet::Store)]
struct Claim {
    claim_id: felt252,
    issuer: ContractAddress,
    topic:u256,
    content: ByteArray,
    active:bool,
    expires:u64,
}
   
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Issuer {
        address: ContractAddress,
        active: bool,
    }


    #[storage]
    struct Storage {
        owner: ContractAddress,
        authorized_issuers: LegacyMap::<ContractAddress, Issuer>,
        claims: LegacyMap::<felt252, Claim>,
        
 

    }


    /// @dev Event that gets emitted when a claim is added
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ClaimAdded: ClaimAdded,
        
    }

    /// @dev Represents a claim that was added
    #[derive(Drop, starknet::Event)]
    struct ClaimAdded {
        claim_id:felt252,
        identity:ContractAddress,
        issuer: ContractAddress,
        date_added:u64,
        expires:u64,
    }

     
         #[constructor]
        fn constructor(ref self: ContractState, init_owner: ContractAddress) {
           self.owner.write(init_owner);
          self.authorized_issuers.write(init_owner,Issuer{address:init_owner,active:true});

    }

    #[abi(embed_v0)]
    impl IdentityImpl of super::IdentityTrait<ContractState> {
           fn add_issuer(ref self: ContractState,issuer_address: ContractAddress)
           {

                self.only_owner(); //Only Owner can add claims issuers
                self.authorized_issuers.write(issuer_address,Issuer{address:issuer_address,active:true});

           }

           fn add_claim(ref self: ContractState,claim_topic:u256, claim_content: ByteArray,expires:u64) {
              let caller = get_caller_address();
              self.is_issuer_authorized(caller);
              
              let struct_to_hash = StructForHash { issuer:caller,topic:claim_topic };
              let hash = PoseidonTrait::new().update_with(struct_to_hash).finalize();
              self.claims.write(hash,Claim{claim_id:hash,issuer:caller,topic:claim_topic,content:claim_content,active:true,expires:expires});
              self.emit(ClaimAdded{claim_id:hash,identity:get_contract_address(),issuer:caller,date_added:get_block_timestamp(),expires:expires});
            }

        fn remove_claim(ref self:ContractState,claim_id:felt252) {
            let caller = get_caller_address();
            let owner = self.owner.read();
            self.is_issuer_authorized(caller);
            let claim = self.claims.read(claim_id);
            assert(claim.issuer == caller || claim.issuer ==owner,'Unathorized.');
            self.claims.write(claim_id,Claim{claim_id:0x0,issuer:owner,topic:0x0,content:Default::default(),active:false,expires:1});
        }

         fn remove_issuer(ref self: ContractState,issuer_address: ContractAddress){

               self.only_owner(); //Only Owner can add claims issuers
                self.authorized_issuers.write(issuer_address,Issuer{address:issuer_address,active:false});
         }

         fn get_owner(self: @ContractState) -> ContractAddress {
              return self.owner.read();
         }

          fn get_claim(self: @ContractState,claim_id: felt252) -> Claim{
            return self.claims.read(claim_id);
          }


            fn get_claimByIssuerAndTopic(self: @ContractState,issuer:ContractAddress,claim_topic:u256) ->Claim {
              let struct_to_hash = StructForHash { issuer:issuer,topic:claim_topic };
              let hash = PoseidonTrait::new().update_with(struct_to_hash).finalize();
              return self.claims.read(hash);
                
            }
  
   
        fn isValidClaim(self:@ContractState,issuer:ContractAddress,claim_topic:u256) ->bool{
            let struct_to_hash = StructForHash { issuer:issuer,topic:claim_topic };
            let hash = PoseidonTrait::new().update_with(struct_to_hash).finalize();
            
           let claim = self.get_claim(hash);
           let timestamp = get_block_timestamp();
          self.isAuthorizedIssuer(issuer) && claim.issuer == issuer && claim.active == true &&(claim.expires == 0 || claim.expires <= timestamp)
        }
       
    } 

     // Standalone public function
    #[external(v0)]
    fn get_contract_name(self: @ContractState) -> felt252 {
        'IdentityContract'
    } 

   #[generate_trait]
    impl PrivateMethods of PrivateMethodsTrait {
        fn only_owner(self: @ContractState) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Caller is not the owner');
        }
            fn isAuthorizedIssuer (self:@ContractState,issuer_address: ContractAddress) ->bool {
            
            self.authorized_issuers.read(issuer_address).active 
            }

   
            fn is_issuer_authorized(self:@ContractState,issuer_address: ContractAddress) {
            
               assert(self.authorized_issuers.read(issuer_address).active == true,'Unauthorized Issuer');
            }

   
  
    }
}