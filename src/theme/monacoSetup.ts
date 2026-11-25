/**
 * Configuração offline do Monaco Editor via workers nativos do Vite (new URL).
 */
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { hookforgeDark } from './monacoTheme';

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') {
      return new Worker(
        new URL('../../node_modules/monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
        { type: 'module' }
      );
    }
    return new Worker(
      new URL('../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
      { type: 'module' }
    );
  },
};

monaco.editor.defineTheme('hookforge-dark', hookforgeDark);
loader.config({ monaco });

void document.fonts?.ready.then(() => monaco.editor.remeasureFonts());

export const MONACO_THEME = 'hookforge-dark';
