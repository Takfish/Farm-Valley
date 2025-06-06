
import { useState, useEffect } from 'react';
import FarmGrid from '@/components/FarmGrid';
import Shop from '@/components/Shop';
import GameStats from '@/components/GameStats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, ShoppingCart, Sprout } from 'lucide-react';

export interface GameState {
  coins: number;
  cropTimeUpgrade: number;
  sellMultiplierUpgrade: number;
}

export interface Crop {
  id: string;
  type: 'carrot' | 'wheat' | 'corn';
  plantedAt: number;
  growthTime: number;
  isReady: boolean;
  baseValue: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    coins: 100,
    cropTimeUpgrade: 0,
    sellMultiplierUpgrade: 0,
  });

  const [crops, setCrops] = useState<{ [key: string]: Crop }>({});
  const [selectedSeed, setSelectedSeed] = useState<'carrot' | 'wheat' | 'corn'>('carrot');

  const seedTypes = {
    carrot: { name: 'Carrot', growthTime: 30000, baseValue: 10, cost: 5 },
    wheat: { name: 'Wheat', growthTime: 45000, baseValue: 15, cost: 8 },
    corn: { name: 'Corn', growthTime: 60000, baseValue: 25, cost: 12 },
  };

  // Update crop readiness every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCrops(prevCrops => {
        const updatedCrops = { ...prevCrops };
        Object.keys(updatedCrops).forEach(key => {
          const crop = updatedCrops[key];
          if (!crop.isReady) {
            const timeElapsed = Date.now() - crop.plantedAt;
            if (timeElapsed >= crop.growthTime) {
              updatedCrops[key] = { ...crop, isReady: true };
            }
          }
        });
        return updatedCrops;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const plantCrop = (tileId: string) => {
    const seedType = seedTypes[selectedSeed];
    if (gameState.coins >= seedType.cost && !crops[tileId]) {
      const adjustedGrowthTime = seedType.growthTime * Math.pow(0.8, gameState.cropTimeUpgrade);
      
      setCrops(prev => ({
        ...prev,
        [tileId]: {
          id: tileId,
          type: selectedSeed,
          plantedAt: Date.now(),
          growthTime: adjustedGrowthTime,
          isReady: false,
          baseValue: seedType.baseValue,
        }
      }));

      setGameState(prev => ({
        ...prev,
        coins: prev.coins - seedType.cost
      }));
    }
  };

  const harvestCrop = (tileId: string) => {
    const crop = crops[tileId];
    if (crop && crop.isReady) {
      const sellValue = crop.baseValue * Math.pow(1.5, gameState.sellMultiplierUpgrade);
      
      setGameState(prev => ({
        ...prev,
        coins: prev.coins + Math.floor(sellValue)
      }));

      setCrops(prev => {
        const newCrops = { ...prev };
        delete newCrops[tileId];
        return newCrops;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Farm Valley</h1>
          <GameStats gameState={gameState} />
        </div>

        <Tabs defaultValue="farm" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="farm" className="flex items-center gap-2">
              <Sprout className="w-4 h-4" />
              Farm
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Shop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farm" className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-800">Select Seed</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(seedTypes).map(([key, seed]) => (
                  <Button
                    key={key}
                    variant={selectedSeed === key ? "default" : "outline"}
                    onClick={() => setSelectedSeed(key as 'carrot' | 'wheat' | 'corn')}
                    className="flex flex-col p-3 h-auto"
                    disabled={gameState.coins < seed.cost}
                  >
                    <span className="font-medium">{seed.name}</span>
                    <span className="text-xs flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {seed.cost}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <FarmGrid
              crops={crops}
              onPlantCrop={plantCrop}
              onHarvestCrop={harvestCrop}
              gameState={gameState}
            />
          </TabsContent>

          <TabsContent value="shop">
            <Shop gameState={gameState} setGameState={setGameState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
