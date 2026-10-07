/**
 * Campus Glow Offline Synchronization Manager
 * Automatically flushes queued reports & repairs to Supabase when network connectivity returns.
 */

import { supabase } from '@/lib/supabase';
import {
  getPendingReports,
  removePendingReport,
  getPendingRepairs,
  removePendingRepair,
  getOfflineQueueSummary,
  PendingReport,
  PendingRepair
} from './offline-db';
import { toast } from 'sonner';

let isSyncing = false;

export interface SyncResult {
  syncedReports: number;
  syncedRepairs: number;
  failedReports: number;
  failedRepairs: number;
}

export async function syncOfflineQueue(silent = false): Promise<SyncResult> {
  if (isSyncing || !navigator.onLine) {
    return { syncedReports: 0, syncedRepairs: 0, failedReports: 0, failedRepairs: 0 };
  }

  isSyncing = true;
  let syncedReports = 0;
  let syncedRepairs = 0;
  let failedReports = 0;
  let failedRepairs = 0;

  try {
    const summary = await getOfflineQueueSummary();
    if (summary.total === 0) {
      isSyncing = false;
      return { syncedReports: 0, syncedRepairs: 0, failedReports: 0, failedRepairs: 0 };
    }

    if (!silent) {
      toast.loading(`Syncing ${summary.total} offline item${summary.total > 1 ? 's' : ''}...`, {
        id: 'sync-in-progress'
      });
    }

    // 1. Process Pending Reports (Fault Reports submitted by Students/Staff)
    const reports = await getPendingReports();
    for (const report of reports) {
      try {
        const { error: repError } = await supabase.from('reports').insert([
          {
            pole_id: report.poleId,
            fault_type: report.faultType,
            severity: report.severity,
            description: report.description ? `${report.description} [Submitted Offline]` : '[Submitted Offline]',
            photo_url: report.photoUrl,
            reported_by: 'Student (Offline Sync)',
            contact_info: report.contactInfo,
            timestamp: report.timestamp
          }
        ]);

        if (repError) throw repError;

        // Mark pole defective
        await supabase
          .from('poles')
          .update({ status: 'Defective', days_outage: 0 })
          .eq('id', report.poleId);

        await removePendingReport(report.id);
        syncedReports++;
      } catch (err) {
        console.error(`[OfflineSync] Failed to sync report ${report.id}:`, err);
        failedReports++;
      }
    }

    // 2. Process Pending Repairs (Maintenance actions by Field Technicians)
    const repairs = await getPendingRepairs();
    for (const repair of repairs) {
      try {
        if (repair.action === 'startRepair') {
          const { error } = await supabase
            .from('poles')
            .update({
              status: 'In Progress',
              current_repair_before_photo: repair.payload.beforePhoto
            })
            .eq('id', repair.poleId);
          if (error) throw error;
        } else if (repair.action === 'submitRepair') {
          const { error: logErr } = await supabase.from('repairs').insert([
            {
              pole_id: repair.payload.poleId,
              tech_name: repair.payload.techName,
              fault_category: repair.payload.faultCategory,
              work_notes: repair.payload.workNotes,
              before_photo_url: repair.payload.beforePhotoUrl,
              after_photo_url: repair.payload.afterPhotoUrl,
              status: 'Success'
            }
          ]);
          if (logErr) throw logErr;

          // Set pole to Operational
          await supabase
            .from('poles')
            .update({
              status: 'Operational',
              days_outage: 0,
              last_inspected: new Date().toISOString(),
              current_repair_before_photo: null
            })
            .eq('id', repair.poleId);
        } else if (repair.action === 'markRepaired') {
          const { error } = await supabase
            .from('poles')
            .update({
              status: 'Operational',
              days_outage: 0,
              last_inspected: new Date().toISOString(),
              current_repair_before_photo: null
            })
            .eq('id', repair.poleId);
          if (error) throw error;
        }

        await removePendingRepair(repair.id);
        syncedRepairs++;
      } catch (err) {
        console.error(`[OfflineSync] Failed to sync repair ${repair.id}:`, err);
        failedRepairs++;
      }
    }

    const totalSynced = syncedReports + syncedRepairs;
    if (totalSynced > 0) {
      toast.success(`Offline sync complete!`, {
        id: 'sync-in-progress',
        description: `Successfully uploaded ${totalSynced} pending item${totalSynced > 1 ? 's' : ''} to database.`
      });
    } else {
      toast.dismiss('sync-in-progress');
    }
  } catch (err) {
    console.error('[OfflineSync] Unexpected sync failure:', err);
    toast.error('Offline sync encountered an issue. Will retry.', { id: 'sync-in-progress' });
  } finally {
    isSyncing = false;
  }

  return { syncedReports, syncedRepairs, failedReports, failedRepairs };
}

/**
 * Initializes automatic background synchronization when browser reconnects to internet
 */
export function initOfflineSync(onSyncSuccess?: () => void): () => void {
  const handleOnline = async () => {
    toast.info('Internet connection restored. Checking offline queue...', { duration: 3000 });
    const result = await syncOfflineQueue();
    if (result.syncedReports > 0 || result.syncedRepairs > 0) {
      if (onSyncSuccess) onSyncSuccess();
    }
  };

  const handleOffline = () => {
    toast.warning('You are currently offline. Changes will be saved locally.', { duration: 4000 });
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Initial check on load
  if (navigator.onLine) {
    syncOfflineQueue(true).then((res) => {
      if ((res.syncedReports > 0 || res.syncedRepairs > 0) && onSyncSuccess) {
        onSyncSuccess();
      }
    });
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
