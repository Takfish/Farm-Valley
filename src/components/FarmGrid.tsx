
import { GameState, Crop } from '@/pages/Index';
import CropTile from './CropTile';

interface FarmGridProps {
  crops: { [key: string]: Crop };
  onPlantCrop: (tileId: string) => void;
  onHarvestCrop: (tileId: string) => void;
  gameState: GameState;
}

const FarmGrid = ({ crops, onPlantCrop, onHarvestCrop, gameState }: FarmGridProps) => {
  const gridSize = 4; // 4x4 grid
  const tiles = Array.from({ length: gridSize * gridSize }, (_, i) => i.toString());

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-green-800">Your Farm</h3>
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
        {tiles.map((tileId) => (
          <CropTile
            key={tileId}
            tileId={tileId}
            crop={crops[tileId]}
            onPlant={() => onPlantCrop(tileId)}
            onHarvest={() => onHarvestCrop(tileId)}
            gameState={gameState}
          />
        ))}
      </div>
    </div>
  );
};

export default FarmGrid;
