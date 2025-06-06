
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState } from '@/pages/Index';
import { Clock, TrendingUp, Coins } from 'lucide-react';

interface ShopProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

const Shop = ({ gameState, setGameState }: ShopProps) => {
  const upgrades = {
    cropTime: {
      name: 'Faster Growth',
      description: 'Reduce crop growth time by 5%',
      icon: Clock,
      baseCost: 150,
      maxLevel: 10,
    },
    sellMultiplier: {
      name: 'Better Prices',
      description: 'Increase sell price by 5%',
      icon: TrendingUp,
      baseCost: 75,
      maxLevel: 100,
    },
  };

  const calculateUpgradeCost = (baseCost: number, currentLevel: number) => {
    return Math.floor(baseCost * Math.pow(2, currentLevel));
  };

  const purchaseUpgrade = (upgradeType: 'cropTime' | 'sellMultiplier') => {
    const upgrade = upgrades[upgradeType === 'cropTime' ? 'cropTime' : 'sellMultiplier'];
    const currentLevel = upgradeType === 'cropTime' ? gameState.cropTimeUpgrade : gameState.sellMultiplierUpgrade;
    const cost = calculateUpgradeCost(upgrade.baseCost, currentLevel);

    if (gameState.coins >= cost && currentLevel < upgrade.maxLevel) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - cost,
        [upgradeType === 'cropTime' ? 'cropTimeUpgrade' : 'sellMultiplierUpgrade']: currentLevel + 1,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Upgrade Shop</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              {upgrades.cropTime.name}
            </CardTitle>
            <CardDescription>{upgrades.cropTime.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Current Level: {gameState.cropTimeUpgrade}/{upgrades.cropTime.maxLevel}
              </div>
              
              {gameState.cropTimeUpgrade < upgrades.cropTime.maxLevel ? (
                <Button
                  onClick={() => purchaseUpgrade('cropTime')}
                  disabled={gameState.coins < calculateUpgradeCost(upgrades.cropTime.baseCost, gameState.cropTimeUpgrade)}
                  className="w-full"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Upgrade for {calculateUpgradeCost(upgrades.cropTime.baseCost, gameState.cropTimeUpgrade)}
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Max Level Reached
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              {upgrades.sellMultiplier.name}
            </CardTitle>
            <CardDescription>{upgrades.sellMultiplier.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Current Level: {gameState.sellMultiplierUpgrade}/{upgrades.sellMultiplier.maxLevel}
              </div>
              
              {gameState.sellMultiplierUpgrade < upgrades.sellMultiplier.maxLevel ? (
                <Button
                  onClick={() => purchaseUpgrade('sellMultiplier')}
                  disabled={gameState.coins < calculateUpgradeCost(upgrades.sellMultiplier.baseCost, gameState.sellMultiplierUpgrade)}
                  className="w-full"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Upgrade for {calculateUpgradeCost(upgrades.sellMultiplier.baseCost, gameState.sellMultiplierUpgrade)}
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Max Level Reached
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shop;
