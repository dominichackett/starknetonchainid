export const identityAddress ="0x00dbb6cbc8cb47ae20e288308dca98352870392408530345281be7a034d0478c"
export const identityABI =   [
  {
    "type": "impl",
    "name": "IdentityImpl",
    "interface_name": "myidentity::myidentity::IdentityTrait"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "myidentity::myidentity::Identity::Claim",
    "members": [
      {
        "name": "claim_id",
        "type": "core::felt252"
      },
      {
        "name": "issuer",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "topic",
        "type": "core::integer::u256"
      },
      {
        "name": "content",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "active",
        "type": "core::bool"
      },
      {
        "name": "expires",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "interface",
    "name": "myidentity::myidentity::IdentityTrait",
    "items": [
      {
        "type": "function",
        "name": "get_owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "add_claim",
        "inputs": [
          {
            "name": "claim_topic",
            "type": "core::integer::u256"
          },
          {
            "name": "claim_content",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "expires",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "add_issuer",
        "inputs": [
          {
            "name": "issuer_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "remove_issuer",
        "inputs": [
          {
            "name": "issuer_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_claim",
        "inputs": [
          {
            "name": "claim_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "myidentity::myidentity::Identity::Claim"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_claimByIssuerAndTopic",
        "inputs": [
          {
            "name": "issuer",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "claim_topic",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "myidentity::myidentity::Identity::Claim"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "remove_claim",
        "inputs": [
          {
            "name": "claim_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "isValidClaim",
        "inputs": [
          {
            "name": "issuer",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "claim_topic",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "init_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "function",
    "name": "get_contract_name",
    "inputs": [],
    "outputs": [
      {
        "type": "core::felt252"
      }
    ],
    "state_mutability": "view"
  },
  {
    "type": "event",
    "name": "myidentity::myidentity::Identity::ClaimAdded",
    "kind": "struct",
    "members": [
      {
        "name": "claim_id",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "identity",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "issuer",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "date_added",
        "type": "core::integer::u64",
        "kind": "data"
      },
      {
        "name": "expires",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "myidentity::myidentity::Identity::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "ClaimAdded",
        "type": "myidentity::myidentity::Identity::ClaimAdded",
        "kind": "nested"
      }
    ]
  }
]