import React from 'react';
import { TerminalLine as LineType } from '../types';

interface TerminalLineProps {
  line: LineType;
  text: string;
  isComplete: boolean;
  cursorChar?: string;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({ line, text, isComplete, cursorChar = '▋' }) => {
  const type = line.type || 'text';

  if (type === 'progress') {
    return (
      <div className="terminal-line">
        {text}
      </div>
    );
  }

  if (type === 'input') {
    return (
      <div className="terminal-line terminal-line-input">
        {line.prompt ? <span className="terminal-prompt">{line.prompt}</span> : '$ '}
        {text}
        {!isComplete && <span className="terminal-cursor">{cursorChar}</span>}
      </div>
    );
  }

  return (
    <div className="terminal-line">
      {text}
    </div>
  );
};
