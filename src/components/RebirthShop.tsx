
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState } from '@/pages/Index';
import { Trophy, Coins, Grid3x3, Plus } from 'lucide-react';

interface RebirthShopProps {
  gameState: GameState;
  onUpgradeStartingCoins: () => void;
  onUpgradeFarmRows: () => void;
  onUpgradeExtraTokens: () => void;
}

const RebirthShop = ({ gameState, onUpgradeStartingCoins, onUpgradeFarmRows, onUpgradeExtraTokens }: RebirthShopProps) => {
  const currentStartingCoins = 25 + (gameState.startingCoinsUpgrade * 50);
  const nextStartingCoins = currentStartingCoins + 50;
  
  const farmRowsCost = 2 + (gameState.farmRowsUpgrade * 2);
  const extraTokenCost = 2 + (gameState.extraTokenUpgrade * 2);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">Rebirth Token Shop</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              Starting Coins Upgrade
            </CardTitle>
            <CardDescription>
              Increase your starting coins after rebirth by 50
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Current: {currentStartingCoins} coins → Next: {nextStartingCoins} coins
              </div>
              <div className="text-sm text-muted-foreground">
                Level: {gameState.startingCoinsUpgrade}
              </div>
              
              <Button
                onClick={onUpgradeStartingCoins}
                disabled={gameState.rebirthTokens < 1}
                className="w-full"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Upgrade for 1 Token
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3x3 className="w-5 h-5 text-green-600" />
              Farm Expansion
            </CardTitle>
            <CardDescription>
              Add an extra row to your farm grid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Current: {4 + gameState.farmRowsUpgrade}x4 grid
              </div>
              <div className="text-sm text-muted-foreground">
                Next: {5 + gameState.farmRowsUpgrade}x4 grid
              </div>
              <div className="text-sm text-muted-foreground">
                Level: {gameState.farmRowsUpgrade}
              </div>
              
              <Button
                onClick={onUpgradeFarmRows}
                disabled={gameState.rebirthTokens < farmRowsCost}
                className="w-full"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Upgrade for {farmRowsCost} Tokens
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Extra Rebirth Tokens
            </CardTitle>
            <CardDescription>
              Get +1 extra token per rebirth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Current: {1 + gameState.extraTokenUpgrade} tokens per rebirth
              </div>
              <div className="text-sm text-muted-foreground">
                Next: {2 + gameState.extraTokenUpgrade} tokens per rebirth
              </div>
              <div className="text-sm text-muted-foreground">
                Level: {gameState.extraTokenUpgrade}
              </div>
              
              <Button
                onClick={onUpgradeExtraTokens}
                disabled={gameState.rebirthTokens < extraTokenCost}
                className="w-full"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Upgrade for {extraTokenCost} Tokens
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RebirthShop;
