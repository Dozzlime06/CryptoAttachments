import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Loader2 } from 'lucide-react';
import contractAbi from '../abi/contractAbi.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '999');

export default function AdminPanel() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { toast } = useToast();

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [newMintPrice, setNewMintPrice] = useState('');
  const [newMaxMint, setNewMaxMint] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (authenticated && wallets.length > 0) {
        try {
          const wallet = wallets[0];
          await wallet.switchChain(CHAIN_ID);
          const provider = await wallet.getEthereumProvider();
          const ethersProvider = new ethers.providers.Web3Provider(provider);
          const signer = ethersProvider.getSigner();
          const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
          
          setContract(nftContract);

          setCheckingOwner(true);
          const walletAddress = await signer.getAddress();
          const ownerAddress = await nftContract.owner();
          
          console.log('Wallet Address:', walletAddress);
          console.log('Contract Owner:', ownerAddress);
          
          setIsOwner(walletAddress.toLowerCase() === ownerAddress.toLowerCase());
          setCheckingOwner(false);
        } catch (err) {
          console.error('Error initializing admin:', err);
          setCheckingOwner(false);
        }
      }
    };
    initContract();
  }, [authenticated, wallets]);

  const handleSetMintPrice = async () => {
    if (!contract || !newMintPrice) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a valid mint price.',
      });
      return;
    }

    setLoading(true);
    try {
      const priceInWei = ethers.utils.parseEther(newMintPrice);
      const tx = await contract.setHypeCost(priceInWei);
      
      toast({
        title: 'Transaction Submitted',
        description: 'Setting mint price...',
      });

      await tx.wait();

      toast({
        title: 'Success!',
        description: `Mint price set to ${newMintPrice} $HYPE`,
      });

      setNewMintPrice('');
    } catch (err: any) {
      console.error('Set price error:', err);
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: err.message || 'Failed to set mint price.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaxMint = async () => {
    if (!contract || !newMaxMint || parseInt(newMaxMint) < 1) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a valid max mint amount.',
      });
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.setMaxMintAmount(parseInt(newMaxMint));
      
      toast({
        title: 'Transaction Submitted',
        description: 'Setting max mint amount...',
      });

      await tx.wait();

      toast({
        title: 'Success!',
        description: `Max mint per transaction set to ${newMaxMint}`,
      });

      setNewMaxMint('');
    } catch (err: any) {
      console.error('Set max mint error:', err);
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: err.message || 'Failed to set max mint amount.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <Card className="w-full max-w-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Panel
          </CardTitle>
          <CardDescription>Connect wallet to access admin controls</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (checkingOwner) {
    return (
      <Card className="w-full max-w-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!isOwner) {
    return (
      <Card className="w-full max-w-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Panel
          </CardTitle>
          <CardDescription className="text-destructive">
            You are not the contract owner. Only the deployer can access admin controls.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <Settings className="w-5 h-5" />
          Admin Panel
        </CardTitle>
        <CardDescription>Configure contract settings (Owner Only)</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mint-price">Set Mint Price (in $HYPE)</Label>
            <div className="flex gap-2">
              <Input
                id="mint-price"
                type="number"
                step="0.001"
                min="0"
                placeholder="e.g., 0.1"
                value={newMintPrice}
                onChange={(e) => setNewMintPrice(e.target.value)}
                disabled={loading}
                data-testid="input-admin-price"
              />
              <Button
                onClick={handleSetMintPrice}
                disabled={loading || !newMintPrice}
                data-testid="button-set-price"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set Price'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-mint">Set Max Mint Per Transaction</Label>
            <div className="flex gap-2">
              <Input
                id="max-mint"
                type="number"
                min="1"
                placeholder="e.g., 20"
                value={newMaxMint}
                onChange={(e) => setNewMaxMint(e.target.value)}
                disabled={loading}
                data-testid="input-admin-max-mint"
              />
              <Button
                onClick={handleSetMaxMint}
                disabled={loading || !newMaxMint}
                data-testid="button-set-max-mint"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set Max'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
          <p className="text-sm text-muted-foreground">
            <strong>Contract:</strong> {CONTRACT_ADDRESS}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Connected as contract owner ✓
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
