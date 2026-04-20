'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export default function ModuleSystemHandler() {
  const activeModule = useAppStore((state) => state.activeModule);
  const entities = useAppStore((state) => state.entities);
  const resetWorkspace = useAppStore((state) => state.resetWorkspace);
  const addEntity = useAppStore((state) => state.addEntity);
  const addLink = useAppStore((state) => state.addLink);
  const lastModule = useRef<string | null>(null);

  useEffect(() => {
    if (activeModule === lastModule.current) return;
    lastModule.current = activeModule;

    // Only auto-populate if workspace is empty or switching to a heavy module for the first time
    if (entities.length > 0 && activeModule !== 'vision' && activeModule !== 'forge') return;

    if (activeModule === 'vision') {
        resetWorkspace();
        // Create Vision Pipeline
        const id1 = 'v_upload';
        const id2 = 'v_extract';
        const id3 = 'v_analyze';
        const id4 = 'v_report';

        addEntity('media-preview', 'Source_Ingest', 400, 400, { agentLabel: 'VISION_CORE' });
        addEntity('ai-task-panel', 'Feature_Extraction', 900, 400, { agentLabel: 'NLP_ENGINE' });
        addEntity('ai-chat-panel', 'Semantic_DeepLink', 1400, 400, { agentLabel: 'SYNAPSE_AI' });
        addEntity('summary-panel', 'Executive_Briefing', 1900, 400, { agentLabel: 'ORACLE_CORE' });
        
        // We'll need to wait for IDs or use predictable ones if store allowed it
        // For now, we'll let the user manually link or implement a sync entity creator
    } else if (activeModule === 'forge') {
        resetWorkspace();
        // Create Forge Matrix
        addEntity('forge-matrix', 'Forge_Genesis', 400, 400, { agentLabel: 'FORGE_MASTER' });
        addEntity('ai-task-panel', 'System_Synthesis', 900, 200, { agentLabel: 'FORGE_WORKER' });
        addEntity('ai-task-panel', 'Memory_Injection', 900, 600, { agentLabel: 'FORGE_WORKER' });
        addEntity('forge-result', 'High_Fidelity_Output', 1400, 400, { agentLabel: 'SYNTHESIS_CORE' });
    }
  }, [activeModule, addEntity, addLink, entities.length, resetWorkspace]);

  return null;
}
