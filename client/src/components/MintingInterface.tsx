import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Loader2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import contractAbi from '../abi/contractAbi.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '999');
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://rpc.hyperliquid.xyz/evm';

export default function MintingInterface() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { toast } = useToast();

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(10000);
  const [mintPrice, setMintPrice] = useState('0');
  const [maxMintAmount, setMaxMintAmount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchContractData = async () => {
      console.log('🔍 Fetching contract data...');
      console.log('📍 Contract Address:', CONTRACT_ADDRESS);
      console.log('🌐 RPC URL:', RPC_URL);
      console.log('⛓️ Chain ID:', CHAIN_ID);
      
      try {
        const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, rpcProvider);

        console.log('📡 Making contract calls...');
        const [total, max, price, maxMint] = await Promise.all([
          nftContract.totalSupply().catch((e: any) => {
            console.error('❌ totalSupply failed:', e);
            return ethers.BigNumber.from(0);
          }),
          nftContract.maxSupply().catch((e: any) => {
            console.error('❌ maxSupply failed:', e);
            return ethers.BigNumber.from(10000);
          }),
          nftContract.hypeCost().catch((e: any) => {
            console.error('❌ hypeCost failed:', e);
            return ethers.BigNumber.from(0);
          }),
          nftContract.maxMintAmount().catch((e: any) => {
            console.error('❌ maxMintAmount failed:', e);
            return ethers.BigNumber.from(20);
          })
        ]);

        console.log('✅ Contract data received:');
        console.log('  Total Supply:', total.toString());
        console.log('  Max Supply:', max.toString());
        console.log('  Mint Price (wei):', price.toString());
        console.log('  Max Mint Amount:', maxMint.toString());

        setTotalSupply(total.toNumber());
        setMaxSupply(max.toNumber());
        setMintPrice(ethers.utils.formatEther(price));
        setMaxMintAmount(maxMint.toNumber());
        
        console.log('✅ State updated successfully');
      } catch (err) {
        console.error('❌ Error fetching contract data:', err);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Unable to fetch contract data. Please check your connection.',
        });
      } finally {
        setFetchingData(false);
      }
    };
    fetchContractData();
  }, [toast]);

  useEffect(() => {
    if (authenticated && wallets.length > 0) {
      const wallet = wallets[0];

      const initContract = async () => {
        try {
          await wallet.switchChain(CHAIN_ID);
          const provider = await wallet.getEthereumProvider();
          const ethersProvider = new ethers.providers.Web3Provider(provider);
          const signer = ethersProvider.getSigner();
          const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
          setContract(nftContract);
        } catch (err) {
          console.error('Error initializing contract:', err);
          toast({
            variant: 'destructive',
            title: 'Wallet Error',
            description: 'Failed to connect wallet to contract.',
          });
        }
      };
      initContract();
    }
  }, [authenticated, wallets, toast]);

  const handleMint = async () => {
    if (!contract) {
      toast({
        variant: 'destructive',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to mint NFTs.',
      });
      return;
    }

    if (mintQuantity < 1 || mintQuantity > maxMintAmount) {
      toast({
        variant: 'destructive',
        title: 'Invalid Quantity',
        description: `Please mint between 1 and ${maxMintAmount} NFTs.`,
      });
      return;
    }

    setLoading(true);

    try {
      const totalHype = ethers.utils.parseEther(mintPrice).mul(mintQuantity);
      const tx = await contract.mintWithHype(mintQuantity, {
        value: totalHype,
        gasLimit: 300000,
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Your mint transaction is being processed...',
      });

      await tx.wait();

      const newTotal = await contract.totalSupply();
      setTotalSupply(newTotal.toNumber());

      toast({
        title: 'Success!',
        description: `Successfully minted ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}!`,
      });

      setMintQuantity(1);
    } catch (err: any) {
      console.error('Minting error:', err);
      toast({
        variant: 'destructive',
        title: 'Minting Failed',
        description: err.message || 'Transaction failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (mintQuantity < maxMintAmount) {
      setMintQuantity(mintQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (mintQuantity > 1) {
      setMintQuantity(mintQuantity - 1);
    }
  };

  const totalCost = (parseFloat(mintPrice) * mintQuantity).toFixed(4);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Mint Your NFT
          </CardTitle>
          <CardDescription className="text-center text-base">
            {authenticated ? 'Select quantity and mint your Liminal Dreams NFT' : 'Connect your wallet to begin minting'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {fetchingData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Collection Progress</span>
                  <span className="text-sm font-semibold" data-testid="text-supply-info">
                    {totalSupply} / {maxSupply} Minted
                  </span>
                </div>
                <ProgressBar current={totalSupply} max={maxSupply} />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Mint Price</div>
                  <div className="text-lg font-bold" data-testid="text-mint-price">
                    {mintPrice} $HYPE
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Max Per Transaction</div>
                  <div className="text-lg font-bold" data-testid="text-max-mint">
                    {maxMintAmount}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-base">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={!authenticated || loading || mintQuantity <= 1}
                    data-testid="button-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={maxMintAmount}
                    value={mintQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setMintQuantity(Math.min(Math.max(1, val), maxMintAmount));
                    }}
                    className="text-center text-2xl font-bold h-14"
                    disabled={!authenticated || loading}
                    data-testid="input-quantity"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={!authenticated || loading || mintQuantity >= maxMintAmount}
                    data-testid="button-increase"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg p-4 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-medium">Total Cost</span>
                <span className="text-2xl font-bold" data-testid="text-total-cost">
                  {totalCost} $HYPE
                </span>
              </div>

              <Button
                onClick={handleMint}
                disabled={!authenticated || loading}
                className="w-full h-14 text-lg font-semibold"
                data-testid="button-mint"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : authenticated ? (
                  `Mint ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}`
                ) : (
                  'Connect Wallet to Mint'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
