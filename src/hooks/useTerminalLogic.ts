import { useState, useEffect, useRef } from 'react';
import { TerminalLine, TerminalOptions } from '../types';

interface UseTerminalLogicReturn {
  visibleLines: { line: TerminalLine; text: string; isComplete: boolean }[];
  isAnimationComplete: boolean;
  restart: () => void;
}

export function useTerminalLogic(
  lineData: TerminalLine[],
  options: TerminalOptions = {}
): UseTerminalLogicReturn {
  // Merge default options with provided ones
  const config = {
    startDelay: 600,
    typeDelay: 90,
    lineDelay: 1500,
    progressLength: 40,
    progressChar: '█',
    progressPercent: 100,
    cursor: '▋',
    ...options,
  };

  const [visibleLines, setVisibleLines] = useState<{ line: TerminalLine; text: string; isComplete: boolean }[]>([]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Ref to track animation state and prevent memory leaks/duplicate loops
  const animationRef = useRef<boolean>(true);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runAnimation = async () => {
    animationRef.current = true;
    setVisibleLines([]);
    setIsAnimationComplete(false);

    await wait(config.startDelay!);

    for (let i = 0; i < lineData.length; i++) {
      if (!animationRef.current) break;

      const line = lineData[i];
      const delay = line.delay || config.lineDelay!;
      const type = line.type || 'text';

      if (type === 'input') {
        // Animated Typing
        const fullText = line.value || '';
        const charDelay = line.typeDelay || config.typeDelay!;

        // Add line to visible list with empty text
        setVisibleLines((prev) => [...prev, { line, text: '', isComplete: false }]);

        for (let charIndex = 0; charIndex < fullText.length; charIndex++) {
          if (!animationRef.current) break;
          await wait(charDelay);

          setVisibleLines((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: fullText.slice(0, charIndex + 1)
            };
            return updated;
          });
        }

        setVisibleLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].isComplete = true;
          return updated;
        });

        await wait(delay);
      }
      else if (type === 'progress') {
        // Animated Progress Bar
        const pLength = line.progressLength || config.progressLength!;
        const pChar = line.progressChar || config.progressChar!;
        const pMaxPercent = line.progressPercent || config.progressPercent!;

        setVisibleLines((prev) => [...prev, { line, text: '', isComplete: false }]);

        for (let j = 1; j <= pLength; j++) {
          if (!animationRef.current) break;
          await wait(config.typeDelay!);

          const percent = Math.round((j / pLength) * 100);
          const bar = pChar.repeat(j);

          setVisibleLines((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: `${bar} ${percent}%`
            };
            return updated;
          });

          if (percent >= pMaxPercent) break;
        }

        setVisibleLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].isComplete = true;
          return updated;
        });

        await wait(delay);
      }
      else {
        // Instant Text
        setVisibleLines((prev) => [...prev, { line, text: line.value || '', isComplete: true }]);
        await wait(delay);
      }
    }

    setIsAnimationComplete(true);
  };

  useEffect(() => {
    runAnimation();
    return () => {
      animationRef.current = false;
    };
  }, [lineData]);

  return {
    visibleLines,
    isAnimationComplete,
    restart: runAnimation,
  };
}
