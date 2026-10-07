/**
 * Campus Glow IndexedDB Offline Storage Layer
 * Manages cached read data (poles, repairs) and offline mutation queues (pending reports, pending repairs).
 */

const DB_NAME = 'campus_glow_offline_db';
const DB_VERSION = 1;

export interface CachedPole {
  id: string;
  zone: string;
  status: string;
  daysOutage: number;
  lastInspected: string;
  installDate: string;
  assignedTechId?: string | null;
  assignedTechName?: string | null;
  assignedAt?: string | null;
  reports?: any[];
  cachedAt?: string;
}

export interface CachedRepair {
  id: string;
  poleId: string;
  techName: string;
  faultCategory: string;
  workNotes?: string;
  status: string;
  timestamp: string;
  cachedAt?: string;
}

export interface PendingReport {
  id: string;
  poleId: string;
  faultType: string;
  severity: string;
  description: string;
  photoUrl: string;
  contactInfo: string;
  timestamp: string;
  retries: number;
}

export interface PendingRepair {
  id: string;
  action: 'startRepair' | 'submitRepair' | 'markRepaired';
  poleId: string;
  payload: any;
  timestamp: string;
  retries: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB is not supported in this browser.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Cached Poles Store
      if (!db.objectStoreNames.contains('cached_poles')) {
        db.createObjectStore('cached_poles', { keyPath: 'id' });
      }

      // 2. Cached Repairs Store
      if (!db.objectStoreNames.contains('cached_repairs')) {
        db.createObjectStore('cached_repairs', { keyPath: 'id' });
      }

      // 3. Pending Reports Queue
      if (!db.objectStoreNames.contains('pending_reports')) {
        const store = db.createObjectStore('pending_reports', { keyPath: 'id' });
        store.createIndex('by_timestamp', 'timestamp', { unique: false });
      }

      // 4. Pending Repairs Queue
      if (!db.objectStoreNames.contains('pending_repairs')) {
        const store = db.createObjectStore('pending_repairs', { keyPath: 'id' });
        store.createIndex('by_timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// -------------------------------------------------------------
// CACHED POLES (READ DATA)
// -------------------------------------------------------------

export async function savePolesToCache(poles: any[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('cached_poles', 'readwrite');
    const store = tx.objectStore('cached_poles');

    const now = new Date().toISOString();
    poles.forEach((p) => {
      store.put({
        ...p,
        lastInspected: p.lastInspected instanceof Date ? p.lastInspected.toISOString() : p.lastInspected,
        installDate: p.installDate instanceof Date ? p.installDate.toISOString() : p.installDate,
        assignedAt: p.assignedAt instanceof Date ? p.assignedAt.toISOString() : p.assignedAt,
        cachedAt: now
      });
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[OfflineDB] Failed to cache poles:', err);
  }
}

export async function getCachedPoles(): Promise<any[]> {
  try {
    const db = await openDB();
    const tx = db.transaction('cached_poles', 'readonly');
    const store = tx.objectStore('cached_poles');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = (request.result || []).map((p) => ({
          ...p,
          lastInspected: p.lastInspected ? new Date(p.lastInspected) : new Date(),
          installDate: p.installDate ? new Date(p.installDate) : new Date(),
          assignedAt: p.assignedAt ? new Date(p.assignedAt) : null,
          reports: (p.reports || []).map((r: any) => ({
            ...r,
            timestamp: r.timestamp ? new Date(r.timestamp) : new Date()
          }))
        }));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[OfflineDB] Failed to read cached poles:', err);
    return [];
  }
}

// -------------------------------------------------------------
// CACHED REPAIRS (READ DATA)
// -------------------------------------------------------------

export async function saveRepairsToCache(repairs: any[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('cached_repairs', 'readwrite');
    const store = tx.objectStore('cached_repairs');

    const now = new Date().toISOString();
    repairs.forEach((r) => {
      store.put({
        ...r,
        timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : r.timestamp,
        cachedAt: now
      });
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[OfflineDB] Failed to cache repairs:', err);
  }
}

export async function getCachedRepairs(): Promise<any[]> {
  try {
    const db = await openDB();
    const tx = db.transaction('cached_repairs', 'readonly');
    const store = tx.objectStore('cached_repairs');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = (request.result || []).map((r) => ({
          ...r,
          timestamp: r.timestamp ? new Date(r.timestamp) : new Date()
        }));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[OfflineDB] Failed to read cached repairs:', err);
    return [];
  }
}

// -------------------------------------------------------------
// PENDING REPORTS (MUTATION QUEUE)
// -------------------------------------------------------------

export async function queueOfflineReport(report: {
  poleId: string;
  faultType: string;
  severity: string;
  description: string;
  photoUrl: string;
  contactInfo: string;
}): Promise<string> {
  const db = await openDB();
  const tx = db.transaction('pending_reports', 'readwrite');
  const store = tx.objectStore('pending_reports');

  const pendingItem: PendingReport = {
    id: `offline_rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...report,
    timestamp: new Date().toISOString(),
    retries: 0
  };

  store.put(pendingItem);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(pendingItem.id);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingReports(): Promise<PendingReport[]> {
  try {
    const db = await openDB();
    const tx = db.transaction('pending_reports', 'readonly');
    const store = tx.objectStore('pending_reports');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function removePendingReport(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('pending_reports', 'readwrite');
  const store = tx.objectStore('pending_reports');
  store.delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// -------------------------------------------------------------
// PENDING REPAIRS (MUTATION QUEUE)
// -------------------------------------------------------------

export async function queueOfflineRepair(repair: {
  action: 'startRepair' | 'submitRepair' | 'markRepaired';
  poleId: string;
  payload: any;
}): Promise<string> {
  const db = await openDB();
  const tx = db.transaction('pending_repairs', 'readwrite');
  const store = tx.objectStore('pending_repairs');

  const pendingItem: PendingRepair = {
    id: `offline_act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...repair,
    timestamp: new Date().toISOString(),
    retries: 0
  };

  store.put(pendingItem);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(pendingItem.id);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingRepairs(): Promise<PendingRepair[]> {
  try {
    const db = await openDB();
    const tx = db.transaction('pending_repairs', 'readonly');
    const store = tx.objectStore('pending_repairs');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function removePendingRepair(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('pending_repairs', 'readwrite');
  const store = tx.objectStore('pending_repairs');
  store.delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// -------------------------------------------------------------
// QUEUE SUMMARY
// -------------------------------------------------------------

export async function getOfflineQueueSummary(): Promise<{ reports: number; repairs: number; total: number }> {
  try {
    const [reports, repairs] = await Promise.all([
      getPendingReports(),
      getPendingRepairs()
    ]);
    return {
      reports: reports.length,
      repairs: repairs.length,
      total: reports.length + repairs.length
    };
  } catch {
    return { reports: 0, repairs: 0, total: 0 };
  }
}
