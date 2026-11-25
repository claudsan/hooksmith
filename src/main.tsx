import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import './i18n';
import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root not found');

createRoot(container).render(<App />);
