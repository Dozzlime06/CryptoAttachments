import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Activity, Box, Users, TrendingUp, Clock } from 'lucide-react';
import contractAbi from '@/abi/contractAbi.json';
import seadropAbi from '@/abi/seadropAbi.json';

const CONTRACT_ADDRESS = '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';
const SEADROP_ADDRESS = '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://rpc.hyperliquid.xyz/evm';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  quantity: number;
}

interface Stats {
  totalSupply: number;
  maxSupply: number;
  mintPrice: string;
  recentMints: number;
  uniqueHolders: number;
}

export default function Scan() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);
      const seadropContract = new ethers.Contract(SEADROP_ADDRESS, seadropAbi, provider);

      const [totalSupply, maxSupply, publicDrop] = await Promise.all([
        contract.totalSupply(),
        contract.maxSupply(),
        seadropContract.getPublicDrop(CONTRACT_ADDRESS)
      ]);

      const mintPrice = ethers.utils.formatEther(publicDrop.mintPrice);

      const filter = contract.filters.Transfer(ethers.constants.AddressZero, null);
      const events = await contract.queryFilter(filter, -1000);
      
      const txPromises = events.slice(-10).reverse().map(async (event) => {
        const block = await provider.getBlock(event.blockNumber);
        return {
          hash: event.transactionHash,
          from: event.args?.to || '',
          to: CONTRACT_ADDRESS,
          value: mintPrice,
          timestamp: block.timestamp,
          quantity: 1
        };
      });

      const transactions = await Promise.all(txPromises);
      
      const uniqueAddresses = new Set(events.map(e => e.args?.to).filter(Boolean));

      setStats({
        totalSupply: totalSupply.toNumber(),
        maxSupply: maxSupply.toNumber(),
        mintPrice,
        recentMints: events.slice(-24).length,
        uniqueHolders: uniqueAddresses.size
      });

      setRecentTransactions(transactions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const url = searchQuery.startsWith('0x') && searchQuery.length === 66
        ? `https://hyperevmscan.io/tx/${searchQuery}`
        : `https://hyperevmscan.io/address/${searchQuery}`;
      window.open(url, '_blank');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Liminal Dreams Explorer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time blockchain analytics for Liminal Dreams NFT Collection
            </p>
          </div>

          {stats && (
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Supply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-supply">
                    {stats.totalSupply} / {stats.maxSupply}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stats.totalSupply / stats.maxSupply) * 100).toFixed(1)}% minted
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Unique Holders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-holders">
                    {stats.uniqueHolders}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Wallet addresses</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Recent Mints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-recent-mints">
                    {stats.recentMints}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Mint Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-mint-price">
                    {stats.mintPrice} HYPE
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Per NFT</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Transactions
              </CardTitle>
              <CardDescription>
                Enter transaction hash or wallet address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="0x... (transaction hash or address)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  data-testid="input-search"
                />
                <Button onClick={handleSearch} data-testid="button-search">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Mints
              </CardTitle>
              <CardDescription>
                Latest NFT minting transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading transactions...
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent transactions found
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((tx, index) => (
                    <div
                      key={tx.hash}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40 hover-elevate"
                      data-testid={`transaction-${index}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(tx.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </span>
                          <span className="text-xs text-muted-foreground">minted</span>
                          <span className="text-sm font-semibold text-primary">
                            {tx.quantity} NFT
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold">{tx.value} HYPE</div>
                          <div className="text-xs text-muted-foreground">
                            {tx.hash.slice(0, 8)}...
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://hyperevmscan.io/tx/${tx.hash}`, '_blank')}
                          data-testid={`button-view-tx-${index}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Box className="w-5 h-5 text-primary" />
                  NFT Contract
                </CardTitle>
                <CardDescription>
                  Liminal Dreams NFT Collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Contract Address</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                    {CONTRACT_ADDRESS}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open(`https://hyperevmscan.io/address/${CONTRACT_ADDRESS}`, '_blank')}
                  data-testid="button-view-nft-contract"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on HyperEVM Scan
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-primary" />
                  SeaDrop Protocol
                </CardTitle>
                <CardDescription>
                  Minting infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Protocol Address</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                    {SEADROP_ADDRESS}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open(`https://hyperevmscan.io/address/${SEADROP_ADDRESS}`, '_blank')}
                  data-testid="button-view-seadrop"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on HyperEVM Scan
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Quick Links
              </CardTitle>
              <CardDescription>
                Explore HyperEVM blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open('https://hyperevmscan.io', '_blank')}
                  data-testid="button-hyperevm-home"
                >
                  <ExternalLink className="w-4 h-4" />
                  HyperEVM Scan Home
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open('https://hyperevmscan.io/blocks', '_blank')}
                  data-testid="button-hyperevm-blocks"
                >
                  <Box className="w-4 h-4" />
                  Latest Blocks
                </Button>

                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open('https://hyperevmscan.io/txs', '_blank')}
                  data-testid="button-hyperevm-txs"
                >
                  <Activity className="w-4 h-4" />
                  Recent Transactions
                </Button>

                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open(`https://hyperevmscan.io/token/${CONTRACT_ADDRESS}`, '_blank')}
                  data-testid="button-hyperevm-token"
                >
                  <Search className="w-4 h-4" />
                  Liminal Dreams NFTs
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/40 mt-6">
                <h3 className="font-semibold mb-2 text-sm">Network Information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Chain ID:</span>
                    <span className="font-mono">999</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Network:</span>
                    <span>Hyperliquid</span>
                  </li>
                  <li className="flex justify-between">
                    <span>RPC URL:</span>
                    <span className="font-mono text-xs">https://rpc.hyperliquid.xyz/evm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Currency:</span>
                    <span>HYPE</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
