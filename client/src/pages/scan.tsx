import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, Activity, TrendingUp } from 'lucide-react';

export default function Scan() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              x402Scan Explorer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track AI agent deployments, $LD payments, and on-chain activity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-primary" />
                  Agent Activity
                </CardTitle>
                <CardDescription>
                  Real-time agent operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <div className="text-xs text-muted-foreground mt-1">Active Agents</div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Total Payments
                </CardTitle>
                <CardDescription>
                  $LD tokens spent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0 LD</div>
                <div className="text-xs text-muted-foreground mt-1">Lifetime Volume</div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5 text-primary" />
                  Deployments
                </CardTitle>
                <CardDescription>
                  Agents created
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <div className="text-xs text-muted-foreground mt-1">Total Deployed</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Explorer Integration
              </CardTitle>
              <CardDescription>
                View detailed analytics on x402Scan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                x402Scan automatically detects $LD payments, deploys AI agents, and tracks all on-chain activity. 
                Visit the explorer to view comprehensive transaction history, agent deployment logs, and real-time monitoring.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open('https://x402scan.io', '_blank')}
                  data-testid="button-x402scan-main"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit x402Scan
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open('https://x402scan.io/agents', '_blank')}
                  data-testid="button-x402scan-agents"
                >
                  <Activity className="w-4 h-4" />
                  View AI Agents
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/40 mt-6">
                <h3 className="font-semibold mb-2 text-sm">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Real-time payment detection and agent deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Complete transaction history with timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Agent activity monitoring and performance metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Transparent payment tracking and analytics</span>
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
