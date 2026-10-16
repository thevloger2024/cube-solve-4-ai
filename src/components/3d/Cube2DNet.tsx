import React from 'react';
import { CubeState, FaceName, ColorName, COLOR_HEX, FACES } from '../../core/cube/CubeState';

interface Cube2DNetProps {
  cube: CubeState;
  selectedSticker?: { face: FaceName; index: number } | null;
  highlightedStickers?: { face: FaceName; index: number }[];
  onStickerClick?: (face: FaceName, index: number) => void;
  interactive?: boolean;
}

export const Cube2DNet: React.FC<Cube2DNetProps> = ({
  cube,
  selectedSticker,
  highlightedStickers = [],
  onStickerClick,
  interactive = false,
}) => {
  const isSelected = (face: FaceName, index: number) =>
    selectedSticker?.face === face && selectedSticker?.index === index;

  const isHighlighted = (face: FaceName, index: number) =>
    highlightedStickers.some(h => h.face === face && h.index === index);

  const renderFace = (face: FaceName, label: string) => (
    <div className="flex flex-col items-center">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
        <span>{label}</span>
        <span className="text-[10px] uppercase text-gray-400">({face})</span>
      </div>
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-gray-900 rounded-lg shadow-inner border border-gray-800">
        {cube[face].map((color: ColorName, index: number) => {
          const selected = isSelected(face, index);
          const highlighted = isHighlighted(face, index);
          const isCenter = index === 4;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => onStickerClick && onStickerClick(face, index)}
              style={{ backgroundColor: COLOR_HEX[color] }}
              title={`${face}[${index}] - ${color}${isCenter ? ' (Fixed Center)' : ''}`}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[4px] border transition-all duration-150 flex items-center justify-center relative
                ${selected ? 'ring-4 ring-blue-500 scale-105 z-10 border-white' : 'border-gray-950/40'}
                ${highlighted ? 'ring-4 ring-red-500 animate-pulse z-10' : ''}
                ${interactive ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'}
              `}
            >
              {isCenter && (
                <div className="w-2 h-2 rounded-full bg-black/40 shadow-sm" />
              )}
              {selected && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping absolute" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      {/* Up Face */}
      <div className="mb-2">
        {renderFace('U', 'Up')}
      </div>

      {/* Middle Row: Left, Front, Right, Back */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 my-1">
        {renderFace('L', 'Left')}
        {renderFace('F', 'Front')}
        {renderFace('R', 'Right')}
        {renderFace('B', 'Back')}
      </div>

      {/* Down Face */}
      <div className="mt-2">
        {renderFace('D', 'Down')}
      </div>
    </div>
  );
};
