import { PrivyProvider } from '@privy-io/react-auth';

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;

  if (!appId) {
    console.warn('VITE_PRIVY_APP_ID not set. Privy authentication will not work.');
  }

  return (
    <PrivyProvider
      appId={appId || 'placeholder-app-id'}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#7c3aed',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
