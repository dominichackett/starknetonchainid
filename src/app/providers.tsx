'use client'
import {
    DynamicContextProvider,
    
  } from "@dynamic-labs/sdk-react-core";
  import { EthersExtension } from "@dynamic-labs/ethers-v5";
  import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
  import {
    createConfig,
    WagmiProvider,
  } from 'wagmi';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { http } from 'viem';
  import { mainnet } from 'viem/chains';
  
  import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
  
  const config = createConfig({
    chains: [mainnet],
    multiInjectedProviderDiscovery: false,
    transports: {
      [mainnet.id]: http(),
    },
  });
    
  const queryClient = new QueryClient();
  

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: 'e7115d81-fd19-49f6-aba3-febe81d5bbb0',
        walletConnectorExtensions: [EthersExtension],
        walletConnectors: [
          StarknetWalletConnectors
        ],
      }}
    >
          
          {children}
    </DynamicContextProvider>
 
    );
  }