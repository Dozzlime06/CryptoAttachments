import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Activity, Box } from 'lucide-react';

const CONTRACT_ADDRESS = '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';
const SEADROP_ADDRESS = '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';

export default function Scan() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const url = searchQuery.startsWith('0x') && searchQuery.length === 66
        ? `https://hyperevmscan.io/tx/${searchQuery}`
        : `https://hyperevmscan.io/address/${searchQuery}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              HyperEVM Scan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Blockchain explorer for Liminal Dreams on HyperEVM (Chain 999)
            </p>
          </div>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search HyperEVM
              </CardTitle>
              <CardDescription>
                Enter transaction hash or address
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
