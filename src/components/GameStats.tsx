
import { Coins } from 'lucide-react';
import { GameState } from '@/pages/Index';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  return (
    <div className="flex justify-center items-center gap-6 mb-4">
      <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
        <Coins className="w-5 h-5 text-yellow-600" />
        <span className="font-bold text-yellow-800">{gameState.coins}</span>
      </div>
      
      <div className="text-sm text-green-700 space-y-1">
        <div>Speed Boost: Level {gameState.cropTimeUpgrade}</div>
        <div>Sell Boost: Level {gameState.sellMultiplierUpgrade}</div>
      </div>
    </div>
  );
};

export default GameStats;
