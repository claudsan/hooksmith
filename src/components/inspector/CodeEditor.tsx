import Editor, { type OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import type { editor } from 'monaco-editor';
import '@/theme/monacoSetup';
import { MONACO_THEME } from '@/theme/monacoSetup';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  minHeight?: string | number;
  height?: string | number;
}

export function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
  };

  return (
    <div className="h-full w-full overflow-hidden bg-shell">
      <Editor
        height={height}
        language={language}
        value={value}
        theme={MONACO_THEME}
        onChange={(v) => onChange?.(v ?? '')}
        onMount={handleMount}
        options={{
          readOnly,
          fontSize: 14,
          fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          renderLineHighlight: 'all',
          scrollbar: {
            verticalScrollbarSize: 7,
            horizontalScrollbarSize: 7,
          },
          padding: { top: 10, bottom: 10 },
          folding: true,
          contextmenu: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
