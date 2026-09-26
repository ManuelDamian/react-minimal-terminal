import React from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ children, title = 'bash' }) => {
  return (
    <div className="terminal-window">
      <div className="terminal-window-title">{title}</div>
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
};
