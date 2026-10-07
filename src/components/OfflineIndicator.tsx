import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { getOfflineQueueSummary } from '@/lib/offline-db';
import { syncOfflineQueue } from '@/lib/offline-sync';
import { Button } from '@/components/ui/button';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const updateQueueStatus = async () => {
    try {
      const summary = await getOfflineQueueSummary();
      setPendingCount(summary.total);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    updateQueueStatus();

    const handleOnline = () => {
      setIsOnline(true);
      updateQueueStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateQueueStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check every 4 seconds to reflect newly queued items
    const interval = setInterval(updateQueueStatus, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncOfflineQueue();
      await updateQueueStatus();
    } finally {
      setIsSyncing(false);
    }
  };

  // If online and nothing in the queue, do not clutter screen
  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Network status banner"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
    >
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border text-xs font-medium transition-all ${
          !isOnline
            ? 'bg-[#0F1D33]/95 border-amber-500/40 text-amber-200 shadow-amber-950/20'
            : 'bg-[#0F1D33]/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/20'
        }`}
      >
        {!isOnline ? (
          <>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">Offline Mode:</span>
              <span className="text-slate-300">
                {pendingCount > 0
                  ? `${pendingCount} item${pendingCount > 1 ? 's' : ''} stored locally`
                  : 'Changes will save to device'}
              </span>
            </div>
          </>
        ) : (
          <>
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">Back Online:</span>
              <span className="text-slate-300">
                {pendingCount} item{pendingCount > 1 ? 's' : ''} ready to sync
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={isSyncing}
              onClick={handleManualSync}
              className="h-6 px-2.5 text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border-emerald-500/40 rounded-full ml-1"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};

export default OfflineIndicator;
