import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import Supabase client
import FarmGrid from '@/components/FarmGrid';
import Shop from '@/components/Shop';
import GameStats from '@/components/GameStats';
import RebirthShop from '@/components/RebirthShop';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, ShoppingCart, Sprout, RotateCcw, Trophy } from 'lucide-react';

const Index = () => {
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

  // Load game data from Supabase on mount
  useEffect(() => {
    const fetchGameData = async () => {
      const user = supabase.auth.user();
      if (!user) {
        console.error('No user is logged in!');
        return;
      }

      try {
        // Fetch game state from the database
        const { data: gameData } = await supabase
          .from('game_state')
          .select('*')
          .eq('user_id', user.id)
          .single(); // assuming one game_state per user

        // Fetch crops from the database
        const { data: userCrops } = await supabase
          .from('crops')
          .select('*')
          .eq('user_id', user.id);

        if (gameData) {
          setGameState(gameData);
        }

        if (userCrops) {
          const cropsMap: { [key: string]: Crop } = {};
          userCrops.forEach(crop => {
            cropsMap[crop.id] = crop;
          });
          setCrops(cropsMap);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load game data from Supabase:', error);
      }
    };

    fetchGameData();
  }, []);

  // Save game state and crops to Supabase whenever it changes
  useEffect(() => {
    const saveGameData = async () => {
      const user = supabase.auth.user();
      if (!user) {
        console.error('No user is logged in!');
        return;
      }

      try {
        // Save game state
        const { data: gameData, error: gameError } = await supabase
          .from('game_state')
          .upsert({ ...gameState, user_id: user.id }, { onConflict: ['user_id'] });

        if (gameError) {
          console.error('Error saving game state:', gameError);
        }

        // Save crops
        const cropEntries = Object.values(crops);
        const { data: cropsData, error: cropsError } = await supabase
          .from('crops')
          .upsert(cropEntries.map(crop => ({ ...crop, user_id: user.id })), { onConflict: ['id'] });

        if (cropsError) {
          console.error('Error saving crops:', cropsError);
        }
      } catch (error) {
        console.error('Error saving game data to Supabase:', error);
      }
    };

    if (isLoaded) {
      saveGameData();
    }
  }, [gameState, crops, isLoaded]);

  // Plant crop logic
  const plantCrop = (tileId: string) => {
    const seedType = seedTypes[selectedSeed];
    if (gameState.coins >= seedType.cost && !crops[tileId]) {
      const speedMultiplier = 1 - Math.min(gameState.cropTimeUpgrade * 0.05, 0.5);
      const adjustedGrowthTime = seedType.growthTime * speedMultiplier;

      const newCrop = {
        id: tileId,
        type: selectedSeed,
        plantedAt: Date.now(),
        growthTime: adjustedGrowthTime,
        isReady: false,
        baseValue: seedType.baseValue,
      };

      setCrops(prev => ({ ...prev, [tileId]: newCrop }));
      setGameState(prev => ({ ...prev, coins: prev.coins - seedType.cost }));
    }
  };

  // Harvest crop logic
  const harvestCrop = (tileId: string) => {
    const crop = crops[tileId];
    if (crop && crop.isReady) {
      const upgradeMultiplier = Math.pow(1.1, gameState.sellMultiplierUpgrade);
      const rebirthMultiplier = 1 + (gameState.rebirthSellBonus / 100);
      const sellValue = crop.baseValue * upgradeMultiplier * rebirthMultiplier;

      setGameState(prev => ({ ...prev, coins: prev.coins + Math.floor(sellValue) }));
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
  if (!isLoaded) {
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
          <h1 className="text-4xl font-bold text-green-800 mb-2">Farm Valley</h1>
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
    </div>
  );
};

export default Index;
