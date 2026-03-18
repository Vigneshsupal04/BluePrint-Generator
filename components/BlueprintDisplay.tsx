
import React, { useState } from 'react';
import { ProjectBlueprint } from '../types';
import { CodeBracketIcon, FlagIcon, LightbulbIcon, PaintBrushIcon, CheckCircleIcon, ShareIcon } from './Icons';

interface BlueprintDisplayProps {
  blueprint: ProjectBlueprint;
  onShare: () => void;
  isGeneratingMockups: boolean;
  onGenerateMockups: (prompts: { [key: string]: string }) => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
    <div className="p-5 bg-gray-800 border-b border-gray-700 flex items-center space-x-3">
        <div className="text-cyan-400">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
    </div>
    <div className="p-6 text-gray-300 space-y-4 flex-grow">
      {children}
    </div>
  </div>
);

const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ blueprint, onShare, isGeneratingMockups }) => {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 mt-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">{blueprint.projectName}</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto md:mx-0">{blueprint.description}</p>
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end flex-shrink-0">
            <button 
                onClick={handleShareClick}
                className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-cyan-300'}`}
                aria-label="Share blueprint"
            >
                <ShareIcon className="w-5 h-5" />
                {copied ? 'Copied!' : 'Share'}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionCard title="Key Features" icon={<LightbulbIcon className="w-7 h-7" />}>
          <ul className="space-y-4">
            {blueprint.features.map((feature, index) => (
              <li key={index} className="p-4 bg-gray-700/50 rounded-lg">
                <strong className="font-semibold text-cyan-300 block">{feature.name}</strong>
                <p className="text-gray-400">{feature.description}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Tech Stack" icon={<CodeBracketIcon className="w-7 h-7" />}>
           <div className="space-y-4">
            {blueprint.techStack.map((tech, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">
                      {tech.category}
                    </span>
                    <strong className="text-cyan-300">{tech.recommendation}</strong>
                </div>
                <p className="text-gray-400 mt-2">{tech.reason}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Project Milestones" icon={<FlagIcon className="w-7 h-7" />}>
          <ul className="space-y-4">
            {blueprint.milestones.map((milestone, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                    <strong className="font-semibold text-cyan-300 block">{milestone.name} <span className="text-gray-500 font-normal">({milestone.duration})</span></strong>
                    <p className="text-gray-400">{milestone.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="UI Design Prototype" icon={<PaintBrushIcon className="w-7 h-7" />}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong className="font-semibold text-cyan-300 block">Concept</strong>
                        <p className="text-gray-400 text-sm">{blueprint.uiDesignPrototype.concept}</p>
                    </div>
                     <div>
                        <strong className="font-semibold text-cyan-300 block">Layout</strong>
                        <p className="text-gray-400 text-sm">{blueprint.uiDesignPrototype.layout}</p>
                    </div>
                </div>
                <div>
                    <strong className="font-semibold text-cyan-300 block">Color Palette</strong>
                    <div className="flex space-x-2 mt-2">
                        {blueprint.uiDesignPrototype.colorPalette.map((color, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-inner" style={{ backgroundColor: color }}></div>
                                <span className="text-[10px] text-gray-500 mt-1">{color}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default BlueprintDisplay;
