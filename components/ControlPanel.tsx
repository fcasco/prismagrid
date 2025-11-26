import React from 'react';
import { GridConfig, ColumnMode } from '../types';

interface ControlPanelProps {
  config: GridConfig;
  onChange: (newConfig: GridConfig) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = React.useState('');

  const handleChange = (key: keyof GridConfig, value: number | string) => {
    onChange({ ...config, [key]: value });
  };

  const handleGenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto">
      
      {/* AI Generator Section */}
      <div className="p-6 border-b border-gray-800 bg-gray-850">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          PrismaGrid AI
        </h2>
        <form onSubmit={handleGenSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Describe a mood or theme</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Cyberpunk Neon, Pastel Spring..."
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            />
          </div>
          <button
            type="button"
            onClick={handleGenSubmit}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all flex items-center justify-center
              ${isGenerating || !prompt.trim() 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/25'}`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Dreaming...
              </>
            ) : 'Generate Theme'}
          </button>
        </form>
      </div>

      {/* Manual Controls */}
      <div className="p-6 space-y-8 flex-1">
        
        {/* Base Color Section */}
        <section className="space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Base Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-400">Base Hue</label>
                <span className="text-xs text-purple-400 font-mono">{config.baseHue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={config.baseHue}
                onChange={(e) => handleChange('baseHue', Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-400">Saturation</label>
                  <span className="text-xs text-purple-400 font-mono">{config.baseSat}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.baseSat}
                  onChange={(e) => handleChange('baseSat', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-400">Lightness</label>
                  <span className="text-xs text-purple-400 font-mono">{config.baseLight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.baseLight}
                  onChange={(e) => handleChange('baseLight', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Steps & Dimensions</h3>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-gray-400">Hue Step (Row)</label>
              <span className="text-xs text-purple-400 font-mono">{config.hueStep}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              value={config.hueStep}
              onChange={(e) => handleChange('hueStep', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="p-3 bg-gray-800 rounded-lg space-y-3">
             <label className="text-xs font-semibold text-gray-300 block mb-2">Column Variation Mode</label>
             <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => handleChange('columnMode', 'lightness')}
                  className={`px-4 py-2 text-xs font-medium rounded-l-lg border border-gray-600 
                  ${config.columnMode === 'lightness' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Lightness
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('columnMode', 'saturation')}
                  className={`px-4 py-2 text-xs font-medium rounded-r-lg border border-gray-600
                  ${config.columnMode === 'saturation' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Saturation
                </button>
             </div>
             
             <div className="pt-2">
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-400">
                    {config.columnMode === 'lightness' ? 'Lightness Step' : 'Saturation Step'}
                  </label>
                  <span className="text-xs text-purple-400 font-mono">
                     {config.columnMode === 'lightness' ? config.lightStep : config.satStep}
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={config.columnMode === 'lightness' ? config.lightStep : config.satStep}
                  onChange={(e) => handleChange(config.columnMode === 'lightness' ? 'lightStep' : 'satStep', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
             </div>
          </div>
        </section>

        {/* Grid Size */}
        <section className="space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Grid Size</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.rows}
                onChange={(e) => handleChange('rows', Math.min(20, Math.max(1, Number(e.target.value))))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
               <label className="block text-xs text-gray-400 mb-1">Columns</label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.cols}
                onChange={(e) => handleChange('cols', Math.min(20, Math.max(1, Number(e.target.value))))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ControlPanel;