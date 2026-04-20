'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function AutoSaveManager() {
  const setAutoSaving = useAppStore((state) => state.setAutoSaving);
  const entities = useAppStore((state) => state.entities);
  const links = useAppStore((state) => state.links);

  useEffect(() => {
    // 30 seconds interval
    const interval = setInterval(() => {
      setAutoSaving(true);
      
      // Simulate persistence logic (e.g., localStorage or API call)
      const stateToSave = {
        entities,
        links,
        timestamp: Date.now()
      };
      
      localStorage.setItem('whisperx-autosave', JSON.stringify(stateToSave));
      
      // Keep "Saving..." status for 2 seconds for visual feedback
      setTimeout(() => {
        setAutoSaving(false);
      }, 2000);
      
    }, 30000);

    return () => clearInterval(interval);
  }, [entities, links, setAutoSaving]);

  return null;
}
