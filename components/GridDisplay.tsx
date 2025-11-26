import React, { useState } from 'react';
import { HSL } from '../types';
import { hslToHex, getContrastColor, copyToClipboard } from '../utils/color';

interface GridDisplayProps {
  grid: HSL[][];
  themeName?: string;
  themeDescription?: string;
}

const GridDisplay: React.FC<GridDisplayProps> = ({ grid, themeName, themeDescription }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = async (hex: string) => {
    try {
      await copyToClipboard(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-gray-950 relative overflow-hidden">
      
      {/* Header Info */}
      <div className="p-6 pb-2 shrink-0 z-10 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {themeName || 'Custom Palette'}
        </h1>
        <p className="text-gray-400 mt-1 max-w-2xl text-sm">
          {themeDescription || 'Adjust settings to generate your color matrix.'}
        </p>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        <div className="inline-flex flex-col rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-800/50 bg-black">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {row.map((hsl, colIndex) => {
                const hex = hslToHex(hsl);
                const textColor = getContrastColor(hex);
                const isCopied = copiedColor === hex;

                return (
                  <button
                    key={`cell-${rowIndex}-${colIndex}`}
                    onClick={() => handleCopy(hex)}
                    className="group relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 transition-transform hover:z-10 hover:scale-105 focus:outline-none focus:z-10 focus:ring-2 focus:ring-white/50"
                    style={{ backgroundColor: hex }}
                    title={`H:${hsl.h} S:${hsl.s}% L:${hsl.l}%`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                      <span 
                        className="text-[10px] font-mono uppercase font-bold tracking-wider transition-all" 
                        style={{ color: textColor }}
                      >
                        {isCopied ? 'Copied!' : hex}
                      </span>
                      {/* Detailed info on hover */}
                      <span 
                        className="text-[9px] mt-0.5 opacity-0 group-hover:opacity-80 font-mono transition-opacity duration-200 whitespace-nowrap" 
                        style={{ color: textColor }}
                      >
                         {hsl.h}° {hsl.s}% {hsl.l}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend / Axis Labels (Optional floating) */}
      <div className="absolute bottom-6 left-8 pointer-events-none opacity-50 text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-4 h-4 border-l-2 border-b-2 border-gray-600 block"></span>
          <span>Rows: Hue Shift</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-4 h-4 border-t-2 border-r-2 border-gray-600 block"></span>
           <span>Columns: Value Shift</span>
        </div>
      </div>

    </div>
  );
};

export default GridDisplay;