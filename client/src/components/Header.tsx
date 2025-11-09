import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Settings, Home } from 'lucide-react';

export default function Header() {
  const { authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [location, setLocation] = useLocation();

  const wallet = wallets[0];

  return (
    <header className="flex items-center justify-between h-20 px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <h1 
        className="text-2xl font-bold tracking-tight cursor-pointer" 
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        onClick={() => setLocation('/')}
      >
        Liminal Dreams
      </h1>
      
      <div className="flex items-center gap-4">
        {location !== '/' && (
          <Button
            onClick={() => setLocation('/')}
            variant="ghost"
            size="icon"
            data-testid="button-nav-home"
          >
            <Home className="w-5 h-5" />
          </Button>
        )}
        
        {authenticated && location !== '/admin' && (
          <Button
            onClick={() => setLocation('/admin')}
            variant="ghost"
            size="icon"
            data-testid="button-nav-admin"
          >
            <Settings className="w-5 h-5" />
          </Button>
        )}
        
        {authenticated && wallet ? (
          <>
            <div className="text-sm text-muted-foreground font-mono" data-testid="text-wallet-address">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              data-testid="button-disconnect"
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            onClick={login}
            data-testid="button-connect"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
