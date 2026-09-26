import React from 'react';
import ReactDOM from 'react-dom/client';
import { Terminal, TerminalLine } from './index';
import './styles/index.css';

const demoLines: TerminalLine[] = [
  { value: 'Initializing system...', type: 'input', prompt: '~/user >', promptColor: '#00ff00', delay: 500 },
  { value: 'Checking dependencies', type: 'progress', progressPercent: 100, delay: 1000 },
  { value: 'Connection established. Welcome, User.', type: 'text', delay: 500 },
  { value: 'Loading portfolio data...', type: 'input', typeDelay: 50, delay: 800 },
  { value: 'Parsing assets', type: 'progress', progressPercent: 80, progressChar: '>', delay: 1200 },
  { value: 'ERROR: Missing coffee.exe', type: 'input', delay: 1000 },
  { value: 'Just kidding. Everything is ready!', type: 'text', delay: 500 },
  // { value: 'clear', type: 'clear', delay: 1500 },
];

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '50px',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '40px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'white'
    }}>

      {/* EXAMPLE 1: Array of Objects approach */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px' }}>Forma 1: Array de Objetos (Props)</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Terminal
            lines={demoLines}
            title="prop-based-terminal"
            mode="dark"
          />
        </div>
      </div>

      <hr style={{ width: '100%', opacity: 0.1 }} />

      {/* EXAMPLE 2: Declarative Component approach */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px' }}>Forma 2: Componentes Anidados (Declarativo)</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Terminal
            title="declarative-terminal"
            mode="dark"
            size="M"
            autoExpanding={false}
          >
            <Terminal.Text prompt="~/user >"
              promptColor="#00ff00" delay={500}>Initializing system...</Terminal.Text>
            <Terminal.Progress percent={100} delay={1000} />
            <Terminal.Text delay={500}>System started</Terminal.Text>
            <Terminal.Line type="input" prompt="USER >"
              promptColor="#00ff00" typeDelay={50} delay={800}>cat portafolio.md</Terminal.Line>
            <Terminal.Line type="input" typeDelay={50} delay={800}>Loading portfolio data...</Terminal.Line>
            <Terminal.Progress percent={80} progressChar=">" delay={1200} />
            <Terminal.Line type="input" delay={1000}>ERROR: Missing coffee.exe</Terminal.Line>
            <Terminal.Text delay={500}>Just kidding. Everything is ready!</Terminal.Text>
            <Terminal.Text delay={500}>Testing autoExpanding</Terminal.Text>
            <Terminal.Text delay={500}>Everything is fine</Terminal.Text>
            <Terminal.Line type="clear" delay={1500} />
          </Terminal>
        </div>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
