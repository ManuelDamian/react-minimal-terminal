export type TerminalSize = 'S' | 'M' | 'L';

export interface TerminalLine {
  value: string;
  type?: 'input' | 'progress' | 'text' | 'clear';
  delay?: number;
  typeDelay?: number;
  progressLength?: number;
  progressChar?: string;
  progressPercent?: number;
  percent?: number;
  cursor?: string;
  prompt?: string;
  promptColor?: string;
}

export interface TerminalOptions {
  startDelay?: number;
  typeDelay?: number;
  lineDelay?: number;
  progressLength?: number;
  progressChar?: string;
  progressPercent?: number;
  cursor?: string;
  promptColor?: string;
}

export interface TerminalTheme {
  bg?: string;
  text?: string;
}
