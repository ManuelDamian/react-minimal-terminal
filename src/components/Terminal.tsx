import React, { createContext, useContext, useImperativeHandle, forwardRef, useState, useEffect, useRef } from 'react';
import { TerminalLine, TerminalOptions, TerminalTheme, TerminalSize } from '../types';
import '../styles/index.css';

// --- CONTEXT & TYPES ---
interface TerminalContextType {
  options: TerminalOptions;
  theme: { bg: string; text: string };
  mode: 'dark' | 'light';
  registerLine: (line: TerminalLine) => void;
  clearTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

const useTerminalContext = () => {
  const context = useContext(TerminalContext);
  if (!context) throw new Error('Terminal components must be wrapped in <Terminal />');
  return context;
};

// --- HELPERS ---
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const validateColor = (color: string, forbidden: string[]) => {
  const normalized = color.toLowerCase().trim();
  return forbidden.some(f => f.toLowerCase() === normalized) ? 'transparent' : color;
};

// --- SUB-COMPONENTS ---

const TerminalLineComponent: React.FC<{
  line: TerminalLine;
  index: number;
  activeLine: number;
  text: string;
  isComplete: boolean;
  options: TerminalOptions;
}> = ({ line, index, activeLine, text, isComplete, options }) => {
  const type = line.type || 'text';
  const isCurrent = index === activeLine;
  const showPrompt = type === 'input' || line.prompt !== undefined;
  const promptValue = line.prompt || '$';
  const promptColor = line.promptColor || options.promptColor;

  if (type === 'progress') {
    return (
      <div className="terminal-line">
        {text}
      </div>
    );
  }

  return (
    <div className={`terminal-line ${type === 'input' ? 'terminal-line-input' : 'terminal-line-text'}`}>
      {showPrompt && (
        <span className="terminal-prompt" style={{ color: promptColor }}>
          {promptValue}
        </span>
      )}
      {text}
      {isCurrent && !isComplete && <span className="terminal-cursor">{options.cursor || '▋'}</span>}
    </div>
  );
};

const Line = forwardRef(({ children, ...props }: Partial<TerminalLine> & { children?: React.ReactNode }, ref: React.ForwardedRef<unknown>) => {
  const { registerLine } = useTerminalContext();
  useEffect(() => {
    const lineData: TerminalLine = {
      value: typeof children === 'string' ? children : '',
      ...props
    };
    registerLine(lineData);
  }, [registerLine, children, props]);
  return null;
});
Line.displayName = 'Terminal.Line';

const Progress = forwardRef(({ children, ...props }: Partial<TerminalLine> & { children?: React.ReactNode }, ref: React.ForwardedRef<unknown>) => {
  const { registerLine } = useTerminalContext();
  useEffect(() => {
    const lineData: TerminalLine = {
      value: typeof children === 'string' ? children : '',
      type: 'progress',
      ...props
    };
    registerLine(lineData);
  }, [registerLine, children, props]);
  return null;
});
Progress.displayName = 'Terminal.Progress';

const Text = forwardRef(({ children, ...props }: Partial<TerminalLine> & { children?: React.ReactNode }, ref: React.ForwardedRef<unknown>) => {
  const { registerLine } = useTerminalContext();
  useEffect(() => {
    const lineData: TerminalLine = {
      value: typeof children === 'string' ? children : '',
      type: 'text',
      ...props
    };
    registerLine(lineData);
  }, [registerLine, children, props]);
  return null;
});
Text.displayName = 'Terminal.Text';

// --- MAIN COMPONENT ---

export interface TerminalProps {
  children?: React.ReactNode;
  lines?: TerminalLine[];
  options?: TerminalOptions;
  theme?: TerminalTheme;
  mode?: 'dark' | 'light';
  title?: string;
  size?: TerminalSize;
  className?: string;
  autoExpanding?: boolean;
}

export type TerminalComponent = React.ForwardRefExoticComponent<TerminalProps & React.RefAttributes<any>> & {
  Line: typeof Line;
  Progress: typeof Progress;
  Text: typeof Text;
};

const TerminalInner = forwardRef<unknown, TerminalProps>(({
  children,
  lines: propsLines,
  options = {},
  theme,
  mode = 'dark',
  title = 'bash',
  size = 'M',
  className = '',
  autoExpanding = true,
}, ref) => {
  const [allLines, setAllLines] = useState<TerminalLine[]>([]);
  const [visibleLines, setVisibleLines] = useState<{ line: TerminalLine; text: string; isComplete: boolean }[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const animationRef = useRef<boolean>(true);
  const isInitialized = useRef(false);

  const forbiddenColors = ['#ff5f56', '#ffbd2e', '#27c93f', 'red', 'yellow', 'green'];
  const bgColor = theme?.bg ? validateColor(theme.bg, forbiddenColors) : (mode === 'dark' ? '#252a33' : '#ffffff');
  const textColor = theme?.text ? validateColor(theme.text, forbiddenColors) : (mode === 'dark' ? '#eee' : '#1d1d1f');

  const registerLine = (line: TerminalLine) => {
    setAllLines(prev => {
      if (prev.some(l => l.value === line.value && l.type === line.type && l.delay === line.delay)) return prev;
      return [...prev, line];
    });
  };

  const clearTerminal = () => {
    setVisibleLines([]);
    setActiveLineIndex(-1);
    setIsAnimationComplete(true);
    animationRef.current = true;
    // NO vaciamos allLines aquí para evitar que el useEffect lo detecte como un cambio
    // y reinicie la animación en modo declarativo.
  };

  const runAnimation = async () => {
    animationRef.current = true;
    setVisibleLines([]);
    setIsAnimationComplete(false);

    const config = {
      startDelay: 600,
      typeDelay: 90,
      lineDelay: 1500,
      progressLength: 40,
      progressChar: '█',
      progressPercent: 100,
      cursor: '▋',
      ...options
    };

    await wait(config.startDelay!);

    const linesToProcess = propsLines || allLines;

    for (let i = 0; i < linesToProcess.length; i++) {
      if (!animationRef.current) break;

      const line = linesToProcess[i];
      const delay = line.delay || config.lineDelay!;
      const type = line.type || 'text';

      setActiveLineIndex(i);

      if (type === 'input') {
        const fullText = line.value || '';
        const charDelay = line.typeDelay || config.typeDelay!;
        setVisibleLines(prev => [...prev, { line, text: '', isComplete: false }]);

        for (let charIndex = 0; charIndex < fullText.length; charIndex++) {
          if (!animationRef.current) break;
          await wait(charDelay);
          setVisibleLines(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], text: fullText.slice(0, charIndex + 1) };
            return updated;
          });
        }
        setVisibleLines(prev => {
          const updated = [...prev];
          updated[updated.length - 1].isComplete = true;
          return updated;
        });
        await wait(delay);
      } else if (type === 'progress') {
        const pLength = line.progressLength || config.progressLength!;
        const pChar = line.progressChar || config.progressChar!;
        const pMaxPercent = line.progressPercent || config.progressPercent!;
        setVisibleLines(prev => [...prev, { line, text: '', isComplete: false }]);

        for (let j = 1; j <= pLength; j++) {
          if (!animationRef.current) break;
          await wait(config.typeDelay!);
          const percent = Math.round((j / pLength) * 100);
          const bar = pChar.repeat(j);
          setVisibleLines(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], text: `${bar} ${percent}%` };
            return updated;
          });
          if (percent >= (line.percent || line.progressPercent || pMaxPercent)) break;
        }
        setVisibleLines(prev => {
          const updated = [...prev];
          updated[updated.length - 1].isComplete = true;
          return updated;
        });
        await wait(delay);
      } else if (type === 'clear') {
        const fullText = 'clear';
        const charDelay = options.typeDelay || config.typeDelay!;
        setVisibleLines(prev => [...prev, { line, text: '', isComplete: false }]);

        for (let charIndex = 0; charIndex < fullText.length; charIndex++) {
          if (!animationRef.current) break;
          await wait(charDelay);
          setVisibleLines(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], text: fullText.slice(0, charIndex + 1) };
            return updated;
          });
        }
        setVisibleLines(prev => {
          const updated = [...prev];
          updated[updated.length - 1].isComplete = true;
          return updated;
        });
        await wait(delay);
        clearTerminal();
        return;
      } else {
        setVisibleLines(prev => [...prev, { line, text: line.value || '', isComplete: true }]);
        await wait(delay);
      }
    }

    const lastLine = (propsLines || allLines).slice(-1)[0];
    if (lastLine && lastLine.value?.toLowerCase().trim() === 'clear') {
        await wait(config.lineDelay!);
        clearTerminal();
    } else {
        setActiveLineIndex((propsLines || allLines).length);
        // Solo añadimos el cursor final si NO hay una línea de 'clear' al final
        // y si la animación realmente terminó.
        setVisibleLines(prev => [...prev, { line: { value: '', type: 'input' }, text: '', isComplete: false }]);
        setIsAnimationComplete(true);
    }
  };

  useEffect(() => {
    if (!isInitialized.current) {
      // Si hay propsLines, la animación debe iniciar inmediatamente
      if (propsLines && propsLines.length > 0) {
        runAnimation();
      } else {
        // Si es modo declarativo, damos un pequeño margen para que los hijos se registren
        const timer = setTimeout(() => {
          if (allLines.length > 0) {
            runAnimation();
          }
        }, 100);
        return () => clearTimeout(timer);
      }
      isInitialized.current = true;
    }
  }, [propsLines]);

  useEffect(() => {
    // Solo ejecutamos la animación si:
    // 1. No hay líneas pasadas por props (estamos en modo declarativo)
    // 2. Hay líneas registradas por los hijos
    // 3. La animación no ha empezado aún (activeLineIndex === -1)
    // 4. No hemos terminado la animación
    if (!propsLines && allLines.length > 0 && !isAnimationComplete && activeLineIndex === -1) {
        runAnimation();
    }
  }, [allLines, propsLines, isAnimationComplete, activeLineIndex]);

  useImperativeHandle(ref, () => ({
    clear: clearTerminal
  }));

  const sizeStyles: Record<TerminalSize, { width: string; minHeight: string; padding: string }> = {
    S: { width: '500px', minHeight: '250px', padding: '60px 30px 20px' },
    M: { width: '750px', minHeight: '450px', padding: '75px 45px 35px' },
    L: { width: '1000px', minHeight: '650px', padding: '90px 60px 40px' },
  };

  return (
    <TerminalContext.Provider value={{ options: options || {}, theme: { bg: bgColor, text: textColor }, mode, registerLine, clearTerminal }}>
      <div
        className={`terminal-window ${className}`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          ...sizeStyles[size],
          overflowY: autoExpanding ? 'auto' : 'hidden',
          height: autoExpanding ? 'auto' : sizeStyles[size].minHeight
        }}
      >
        <div className="terminal-window-title">{title}</div>
        <div className="terminal-content">
          {visibleLines.map((item, index) => (
            <TerminalLineComponent
              key={index}
              line={item.line}
              index={index}
              text={item.text}
              isComplete={item.isComplete}
              activeLine={activeLineIndex}
              options={options || {}}
            />
          ))}
          {children}
        </div >
      </div>
    </TerminalContext.Provider>
  );
});

const TerminalComponent = TerminalInner as unknown as TerminalComponent;

TerminalComponent.Line = Line;
TerminalComponent.Progress = Progress;
TerminalComponent.Text = Text;

export { TerminalComponent as Terminal };
