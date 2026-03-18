
import React, { useState } from 'react';

interface ProjectIdeaFormProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

const ProjectIdeaForm: React.FC<ProjectIdeaFormProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onSubmit(idea);
    }
  };

  const placeholderText = "e.g., A mobile app that uses AI to identify plants from photos and provides care instructions.";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder={placeholderText}
        className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 text-gray-200 min-h-[120px] resize-y"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !idea.trim()}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Blueprint'
        )}
      </button>
    </form>
  );
};

export default ProjectIdeaForm;
