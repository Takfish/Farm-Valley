import { useState, useEffect } from 'react';
import FarmGrid from '@/components/FarmGrid';
import Shop from '@/components/Shop';
import GameStats from '@/components/GameStats';
import RebirthShop from '@/components/RebirthShop';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, ShoppingCart, Sprout, RotateCcw, Trophy, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GameState {
  coins: number;
  cropTimeUpgrade: number;
  sellMultiplierUpgrade: number;
  rebirths: number;
  rebirthTokens: number;
  startingCoinsUpgrade: number;
  rebirthSpeedBonus: number;
  rebirthSellBonus: number;
  farmRowsUpgrade: number;
  extraTokenUpgrade: number;
}

export interface Crop {
  id: string;
  type: 'carrot' | 'wheat' | 'corn' | 'potato' | 'tomato' | 'pepper' | 'eggplant' | 'cucumber' | 'pumpkin' | 'strawberry' | 'blueberry' | 'grape' | 'apple' | 'orange' | 'mango' | 'pineapple' | 'coconut' | 'dragon-fruit' | 'passion-fruit' | 'kiwi';
  plantedAt: number;
  growthTime: number;
  isReady: boolean;
  baseValue: number;
}

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    coins: 25,
    cropTimeUpgrade: 0,
    sellMultiplierUpgrade: 0,
    rebirths: 0,
    rebirthTokens: 0,
    startingCoinsUpgrade: 0,
    rebirthSpeedBonus: 0,
    rebirthSellBonus: 0,
    farmRowsUpgrade: 0,
    extraTokenUpgrade: 0,
  });

  const [crops, setCrops] = useState<{ [key: string]: Crop }>({});
  const [selectedSeed, setSelectedSeed] = useState<'carrot' | 'wheat' | 'corn' | 'potato' | 'tomato' | 'pepper' | 'eggplant' | 'cucumber' | 'pumpkin' | 'strawberry' | 'blueberry' | 'grape' | 'apple' | 'orange' | 'mango' | 'pineapple' | 'coconut' | 'dragon-fruit' | 'passion-fruit' | 'kiwi'>('carrot');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  const seedTypes = {
    carrot: { name: 'Carrot', growthTime: 30000, baseValue: 10, cost: 5, emoji: '🥕' },
    wheat: { name: 'Wheat', growthTime: 45000, baseValue: 15, cost: 8, emoji: '🌾' },
    corn: { name: 'Corn', growthTime: 60000, baseValue: 25, cost: 15, emoji: '🌽' },
    potato: { name: 'Potato', growthTime: 75000, baseValue: 35, cost: 25, emoji: '🥔' },
    tomato: { name: 'Tomato', growthTime: 90000, baseValue: 50, cost: 40, emoji: '🍅' },
    pepper: { name: 'Pepper', growthTime: 105000, baseValue: 75, cost: 60, emoji: '🌶️' },
    eggplant: { name: 'Eggplant', growthTime: 120000, baseValue: 110, cost: 90, emoji: '🍆' },
    cucumber: { name: 'Cucumber', growthTime: 135000, baseValue: 160, cost: 130, emoji: '🥒' },
    pumpkin: { name: 'Pumpkin', growthTime: 150000, baseValue: 230, cost: 190, emoji: '🎃' },
    strawberry: { name: 'Strawberry', growthTime: 165000, baseValue: 340, cost: 280, emoji: '🍓' },
    blueberry: { name: 'Blueberry', growthTime: 180000, baseValue: 500, cost: 410, emoji: '🫐' },
    grape: { name: 'Grape', growthTime: 195000, baseValue: 740, cost: 610, emoji: '🍇' },
    apple: { name: 'Apple', growthTime: 210000, baseValue: 1100, cost: 900, emoji: '🍎' },
    orange: { name: 'Orange', growthTime: 225000, baseValue: 1600, cost: 1320, emoji: '🍊' },
    mango: { name: 'Mango', growthTime: 240000, baseValue: 2400, cost: 1950, emoji: '🥭' },
    pineapple: { name: 'Pineapple', growthTime: 300000, baseValue: 3500, cost: 2900, emoji: '🍍' },
    coconut: { name: 'Coconut', growthTime: 360000, baseValue: 5200, cost: 4300, emoji: '🥥' },
    'dragon-fruit': { name: 'Dragon Fruit', growthTime: 420000, baseValue: 7800, cost: 6400, emoji: '🐲' },
    'passion-fruit': { name: 'Passion Fruit', growthTime: 480000, baseValue: 11500, cost: 9500, emoji: '💜' },
    kiwi: { name: 'Kiwi', growthTime: 540000, baseValue: 17000, cost: 14000, emoji: '🥝' },
  };

  // Save game data to database
  const saveGameData = async () => {
    if (!user) return;
    
    try {
      const gameData = {
        gameState,
        crops,
        selectedSeed,
        lastSaved: Date.now()
      };

const { error } = await supabase
  .from('game_saves')
  .upsert({
    user_id: user.id,
    game_data: gameData as any
  }, { onConflict: 'user_id' });


      if (error) {
        console.error('Failed to save game data:', error);
      } else {
        console.log('Game data saved to database');
      }
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  // Load game data from database
  const loadGameData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('game_data')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('No saved game data found');
        return;
      }

    if (data?.game_data) {
      const gameData = data.game_data as any;
      const { gameState: savedGameState, crops: savedCrops, selectedSeed: savedSelectedSeed } = gameData;
    
      if (savedGameState) setGameState(savedGameState);
      if (savedCrops) setCrops(savedCrops);
      if (savedSelectedSeed) setSelectedSeed(savedSelectedSeed);
    
      setHasSavedData(true); // ✅ mark that save exists
    
      console.log('Game data loaded from database');
    }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  // Load game data when user logs in
  useEffect(() => {
    if (user && !authLoading) {
      loadGameData().then(() => setIsLoaded(true));
    } else if (!user && !authLoading) {
      setIsLoaded(true);
    }
  }, [user, authLoading]);

  // Save game data when it changes (only for logged in users)
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    saveGameData();
  }, [gameState, crops, selectedSeed, isLoaded, user]);


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
const speedMultiplier = 1 - Math.min(gameState.cropTimeUpgrade * 0.05, 0.5);

      const adjustedGrowthTime = seedType.growthTime * speedMultiplier;
      
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
      const upgradeMultiplier = Math.pow(1.1, gameState.sellMultiplierUpgrade);
      const rebirthMultiplier = 1 + (gameState.rebirthSellBonus / 100);
      const sellValue = crop.baseValue * upgradeMultiplier * rebirthMultiplier;
      
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

  const performRebirth = () => {
    const rebirthCost = 2000 * Math.pow(2, gameState.rebirths);
    if (gameState.coins >= rebirthCost) {
      const startingCoins = 25 + (gameState.startingCoinsUpgrade * 50);
      const extraTokens = 1 + gameState.extraTokenUpgrade;
      
      setGameState(prev => ({
        ...prev,
        coins: startingCoins,
        cropTimeUpgrade: 0,
        sellMultiplierUpgrade: 0,
        rebirths: prev.rebirths + 1,
        rebirthTokens: prev.rebirthTokens + extraTokens,
        rebirthSpeedBonus: prev.rebirthSpeedBonus + 0,
        rebirthSellBonus: prev.rebirthSellBonus + 50,
      }));

      setCrops({});
    }
  };

  const upgradeStartingCoins = () => {
    if (gameState.rebirthTokens >= 1) {
      setGameState(prev => ({
        ...prev,
        rebirthTokens: prev.rebirthTokens - 1,
        startingCoinsUpgrade: prev.startingCoinsUpgrade + 1,
      }));
    }
  };

  const upgradeFarmRows = () => {
    const cost = 2 + (gameState.farmRowsUpgrade * 2);
    if (gameState.rebirthTokens >= cost) {
      setGameState(prev => ({
        ...prev,
        rebirthTokens: prev.rebirthTokens - cost,
        farmRowsUpgrade: prev.farmRowsUpgrade + 1,
      }));
    }
  };
  const upgradeExtraTokens = () => {
    const cost = 2 + (gameState.extraTokenUpgrade * 2);
    if (gameState.rebirthTokens >= cost) {
      setGameState(prev => ({
        ...prev,
        rebirthTokens: prev.rebirthTokens - cost,
        extraTokenUpgrade: prev.extraTokenUpgrade + 1,
      }));
    }
  };

  const getRebirthCost = () => {
    return 2000 * Math.pow(2, gameState.rebirths);
  };

  // Don't render until data is loaded
  if (!isLoaded || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 flex items-center justify-center">
        <div className="text-2xl font-bold text-green-800">Loading Farm Valley...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-green-800">Farm Valley</h1>
            <div className="flex gap-2">
              {user ? (
                <Button onClick={signOut} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
          <GameStats gameState={gameState} />
        </div>

        <Tabs defaultValue="farm" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="farm" className="flex items-center gap-2">
              <Sprout className="w-4 h-4" />
              Farm
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="rebirth" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Rebirth
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farm" className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-800">Select Seed</h3>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {Object.entries(seedTypes).map(([key, seed]) => (
                  <Button
                    key={key}
                    variant={selectedSeed === key ? "default" : "outline"}
                    onClick={() => setSelectedSeed(key as any)}
                    className="flex flex-col p-3 h-auto"
                    disabled={gameState.coins < seed.cost}
                  >
                    <span className="text-lg mb-1">{seed.emoji}</span>
                    <span className="font-medium text-xs">{seed.name}</span>
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

          <TabsContent value="rebirth">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Rebirth System</h2>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Rebirths: {gameState.rebirths}</p>
                  <p>Speed Bonus: +{gameState.rebirthSpeedBonus}%</p>
                  <p>Sell Bonus: +{gameState.rebirthSellBonus}%</p>
                  <p>Tokens per Rebirth: {1 + gameState.extraTokenUpgrade}</p>
                </div>
                <p className="text-gray-700">
                  Reset everything and gain permanent +50% sell bonus!
                </p>
                <Button
                  onClick={performRebirth}
                  disabled={gameState.coins < getRebirthCost()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rebirth for {getRebirthCost()} coins
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tokens">
            <RebirthShop 
              gameState={gameState} 
              onUpgradeStartingCoins={upgradeStartingCoins}
              onUpgradeFarmRows={upgradeFarmRows}
              onUpgradeExtraTokens={upgradeExtraTokens}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;
