
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState } from '@/pages/Index';
import { Trophy, Coins } from 'lucide-react';

interface RebirthShopProps {
  gameState: GameState;
  onUpgradeStartingCoins: () => void;
}

const RebirthShop = ({ gameState, onUpgradeStartingCoins }: RebirthShopProps) => {
  const currentStartingCoins = 100 + (gameState.startingCoinsUpgrade * 50);
  const nextStartingCoins = currentStartingCoins + 50;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">Rebirth Token Shop</h2>
      
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
    </div>
  );
};

export default RebirthShop;
