
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GameState, Crop } from '@/pages/Index';
import { Sprout, Package } from 'lucide-react';

interface CropTileProps {
  tileId: string;
  crop?: Crop;
  onPlant: () => void;
  onHarvest: () => void;
  gameState: GameState;
}

const CropTile = ({ tileId, crop, onPlant, onHarvest, gameState }: CropTileProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (crop && !crop.isReady) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - crop.plantedAt;
        const remaining = Math.max(0, crop.growthTime - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [crop]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCropEmoji = (type: string) => {
    switch (type) {
      case 'carrot': return '🥕';
      case 'wheat': return '🌾';
      case 'corn': return '🌽';
      default: return '🌱';
    }
  };

  if (!crop) {
    return (
      <Button
        onClick={onPlant}
        variant="outline"
        className="aspect-square h-20 w-full border-2 border-dashed border-green-300 hover:border-green-500 bg-green-50 hover:bg-green-100 flex flex-col items-center justify-center"
      >
        <Sprout className="w-6 h-6 text-green-500 mb-1" />
        <span className="text-xs text-green-600">Plant</span>
      </Button>
    );
  }

  if (crop.isReady) {
    const sellValue = crop.baseValue * Math.pow(1.5, gameState.sellMultiplierUpgrade);
    
    return (
      <Button
        onClick={onHarvest}
        className="aspect-square h-20 w-full bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 flex flex-col items-center justify-center text-yellow-800"
      >
        <div className="text-2xl mb-1">{getCropEmoji(crop.type)}</div>
        <div className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          <span className="text-xs font-bold">+{Math.floor(sellValue)}</span>
        </div>
      </Button>
    );
  }

  return (
    <div className="aspect-square h-20 w-full bg-brown-100 border-2 border-brown-300 rounded-md flex flex-col items-center justify-center">
      <div className="text-lg mb-1">🌱</div>
      <div className="text-xs text-brown-700 font-mono text-center">
        <div>{formatTime(timeRemaining)}</div>
        <div className="text-xs opacity-75">{crop.type}</div>
      </div>
    </div>
  );
};

export default CropTile;
