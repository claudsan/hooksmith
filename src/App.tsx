import { useAppStore } from '@/store/useAppStore';
import { useAppBootstrap, useGlobalShortcuts } from '@/hooks/useAppLifecycle';
import { useResizableWidth } from '@/hooks/useResizableWidth';
import { TitleBar } from '@/components/layout/TitleBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TrafficList } from '@/components/traffic/TrafficList';
import { RequestInspector } from '@/components/inspector/RequestInspector';
import { ResizeHandle } from '@/components/ui/ResizeHandle';
import { StatusBar } from '@/components/layout/StatusBar';
import { Toaster } from '@/components/ui/Toaster';
import { ListenerModal } from '@/components/layout/modals/ListenerModal';
import { MockEditorModal } from '@/components/layout/modals/MockEditorModal';

export function App() {
  useAppBootstrap();
  useGlobalShortcuts();

  const listenerModalOpen = useAppStore((s) => s.listenerModal.open);
  const mockModalOpen = useAppStore((s) => s.mockModal.open);

  const trafficColumn = useResizableWidth({
    storageKey: 'hooksmith:traffic-width',
    defaultWidth: 350,
    minWidth: 260,
    maxWidth: 750,
  });

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-shell select-none">
      {/* 1. Barra de Título Frameless (44px) */}
      <TitleBar />

      {/* 2. Área Central de Trabalho (3 Colunas) */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Coluna 1: Sidebar (250px) */}
        <Sidebar />

        {/* Coluna 2: Traffic Stream (Redimensionável) */}
        <TrafficList width={trafficColumn.width} />

        {/* Divisor Redimensionável da Coluna 2 */}
        <ResizeHandle
          onMouseDown={trafficColumn.onMouseDown}
          onDoubleClick={trafficColumn.resetWidth}
          isResizing={trafficColumn.isResizing}
        />

        {/* Coluna 3: Request & Response Inspector (flex-1) */}
        <RequestInspector />
      </div>

      {/* 3. Barra de Status Inferior (26px) */}
      <StatusBar />

      {/* Modais & Toasts */}
      {listenerModalOpen && <ListenerModal />}
      {mockModalOpen && <MockEditorModal />}
      <Toaster />
    </div>
  );
}
