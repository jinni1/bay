import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'

import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
//import { Theme } from '@radix-ui/themes';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl('devnet')},
  testnet: { url: getFullnodeUrl('testnet')},
  mainnet: { url: getFullnodeUrl('mainnet')},
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
    
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
          <WalletProvider>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
  
	</React.StrictMode>,
);
