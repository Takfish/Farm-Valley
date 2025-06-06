
import { Coins, Trophy, RotateCcw } from 'lucide-react';
import { GameState } from '@/pages/Index';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
      <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
        <Coins className="w-5 h-5 text-yellow-600" />
        <span className="font-bold text-yellow-800">{gameState.coins}</span>
      </div>
      
      <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg">
        <RotateCcw className="w-5 h-5 text-purple-600" />
        <span className="font-bold text-purple-800">{gameState.rebirths}</span>
      </div>
      
      <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
        <Trophy className="w-5 h-5 text-blue-600" />
        <span className="font-bold text-blue-800">{gameState.rebirthTokens}</span>
      </div>
      
      <div className="text-sm text-green-700 space-y-1">
        <div>Speed: Lv{gameState.cropTimeUpgrade} (+{gameState.rebirthSpeedBonus}%)</div>
        <div>Sell: Lv{gameState.sellMultiplierUpgrade} (+{gameState.rebirthSellBonus}%)</div>
      </div>
    </div>
  );
};

export default GameStats;
