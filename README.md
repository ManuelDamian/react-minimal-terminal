# ⌨️ react-minimal-terminal

A professional, highly customizable, and animated terminal component for React. Inspired by the Apple aesthetic, it provides a seamless way to showcase terminal-like interactions in your portfolio or application.

This project is a modern, enhanced version of the original [termynal.js](https://github.com/ines/termynal) by **Ines Montani**, refactored for the React ecosystem with added TypeScript support, improved animations, and extensive customization options.

## ✨ Features

- **Dual Usage Patterns**: Use it via a simple array of configuration objects or through a declarative JSX component structure.
- **Animated Typing**: Realistic "typewriter" effect for input lines.
- **Progress Bars**: Animated progress bars with customizable characters and percentages.
- **Terminal Commands**: Support for a `clear` command that visually types "clear" before wiping the screen.
- **Custom Prompts**: Full control over the prompt symbol and color per line.
- **Fully Customizable**: Control themes, colors, sizes, and animation speeds.
- **TypeScript First**: Full type safety for all props and options.

---

## 🚀 Installation

```bash
pnpm add react-minimal-terminal
```

## 🛠 Usage

### 1. Array-based Approach (Prop-based)
Ideal for static sequences or data coming from an API.

```tsx
import { Terminal } from 'react-minimal-terminal';

const demoLines = [
  { 
    value: 'Initializing system...', 
    type: 'input', 
    prompt: '~/user >', 
    promptColor: '#00ff00', 
    delay: 500 
  },
  { 
    value: 'Checking dependencies', 
    type: 'progress', 
    percent: 100, 
    progressChar: '█', 
    delay: 1000 
  },
  { 
    value: 'Connection established.', 
    type: 'text', 
    prompt: '[INFO]', 
    promptColor: 'yellow', 
    delay: 500 
  },
  { value: 'clear', type: 'clear', delay: 1500 },
];

function App() {
  return <Terminal lines={demoLines} title="my-system" mode="dark" />;
}
```

### 2. Declarative Approach (Component-based)
Ideal for integrating terminal lines within a larger JSX structure.

```tsx
import { Terminal } from 'react-minimal-terminal';

function App() {
  return (
    <Terminal title="declarative-//react-minimal-terminal" mode="dark" size="M" autoExpanding={false}>
      <Terminal.Line 
        type="input" 
        prompt="~/user >" 
        promptColor="#00ff00" 
        delay={500}
      >
        Initializing system...
      </Terminal.Line>
      
      <Terminal.Progress 
        percent={100} 
        progressChar="█" 
        delay={1000} 
      />
      
      <Terminal.Text 
        prompt="[INFO]" 
        promptColor="yellow" 
        delay={500}
      >
        Connection established. Welcome, User.
      </Terminal.Text>
      
      <Terminal.Line type="clear" delay={1500} />
    </Terminal>
  );
}
```

---

## 📖 API Reference

### Main Terminal Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lines` | `TerminalLine[]` | `undefined` | Array of lines to animate (used in Array approach). |
| `children` | `ReactNode` | `undefined` | Declarative sub-components (`Line`, `Text`, `Progress`). |
| `options` | `TerminalOptions` | `{}` | Global animation settings (speed, delays, default prompt color). |
| `theme` | `TerminalTheme` | `undefined` | Custom colors `{ bg: string, text: string }`. |
| `mode` | `'dark' \| 'light'` | `'dark'` | Preset theme mode. |
| `title` | `string` | `'bash'` | Text displayed in the window title bar. |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Window size preset (Small, Medium, Large). |
| `autoExpanding` | `boolean` | `true` | If `false`, the window maintains fixed height with a scrollbar. |
| `className` | `string` | `''` | Additional CSS classes for the container. |

### Line Types & Components

#### 1. `input` / `<Terminal.Line type="input">`
Simulates a user typing into the terminal.
- **Behavior**: Types character by character with a blinking cursor.
- **Properties**:
  - `value` / `children` (string): The text to be typed.
  - `prompt` (string): Custom prompt symbol (e.g., `>>>`, `~/user >`). Default: `$`.
  - `promptColor` (string): Color of the prompt (Hex, RGB, or CSS color name).
  - `typeDelay` (number): Speed of each character in ms.
  - `delay` (number): Pause before starting this line in ms.

#### 2. `text` / `<Terminal.Text>`
Displays static system output.
- **Behavior**: Appears instantly.
- **Properties**:
  - `value` / `children` (string): The text to display.
  - `prompt` (string): Optional prompt symbol to prefix the output.
  - `promptColor` (string): Color of the prefix prompt.
  - `delay` (number): Pause before showing this line in ms.

#### 3. `progress` / `<Terminal.Progress>`
Displays an animated loading bar.
- **Behavior**: Fills the bar and updates percentage.
- **Properties**:
  - `percent` / `progressPercent` (number): Target percentage to reach (0-100).
  - `progressChar` (string): Character used for the bar (default: `█`).
  - `progressLength` (number): Total number of characters in the bar.
  - `delay` (number): Pause before starting the progress in ms.

#### 4. `clear` / `<Terminal.Line type="clear">`
Clears the terminal screen.
- **Behavior**: Types the word "clear" $\rightarrow$ waits $\rightarrow$ wipes all visible lines.
- **Props**: 
  - `delay` (number): Pause before typing "clear" in ms.

---

## 🎨 Theme & Options

### `TerminalOptions` (Global Settings)
Pass these to the `options` prop of the `<Terminal />` component.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `startDelay` | `number` | `600` | Delay before the very first line starts. |
| `typeDelay` | `number` | `90` | Default speed for typing effects. |
| `lineDelay` | `number` | `1500` | Default pause between lines. |
| `cursor` | `string` | `'▋'` | The character used for the blinking cursor. |
| `promptColor` | `string` | `undefined` | Default color for all prompts if not specified per line. |

### `TerminalTheme`
| Property | Type | Description |
| :--- | :--- | :--- |
| `bg` | `string` | Background color of the window. |
| `text` | `string` | Primary text color of the terminal. |

---

## 🛠 Compatibility

This library is compatible with **React 16.8.0** and above.

| React Version | Compatibility | Reason |
| :--- | :--- | :--- |
| **< 16.8** | ❌ No | Requires React Hooks. |
| **16.8 to 17** | ✅ Yes | Full support for Hooks. |
| **18** | ✅ Yes | Compatible with Concurrent Mode and `createRoot`. |
| **19** | ✅ Yes | Verified compatibility with the latest React version. |
