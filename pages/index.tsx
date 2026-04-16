import React from 'react';
import AppShell from '@/components/Layout/AppShell';
import { useAppStore } from '@/lib/store';

// Modules
import Overview from '@/components/Modules/Overview';
import Workspace from '@/components/Modules/Workspace';
import Forge from '@/components/Modules/Forge';
import Vault from '@/components/Modules/Vault';
import Archive from '@/components/Modules/Archive';
import Reader from '@/components/Modules/Reader';
import Summary from '@/components/Modules/Summary';
import AI from '@/components/Modules/AI';
import Docs from '@/components/Modules/Docs';
import Slides from '@/components/Modules/Slides';
import History from '@/components/Modules/History';
import Readiness from '@/components/Modules/Readiness';
import Topology from '@/components/Modules/Topology';
import Contacts from '@/components/Modules/Contacts';
import Budget from '@/components/Modules/Budget';

const MODULE_COMPONENTS: Record<string, React.ComponentType<{ activeModule: string }>> = {
  overview: Overview,
  workspace: Workspace,
  forge: Forge,
  vault: Vault,
  archive: Archive,
  reader: Reader,
  summary: Summary,
  history: History,
  readiness: Readiness,
  docs: Docs,
  slides: Slides,
  topology: Topology,
  ai: AI,
  contacts: Contacts,
  budget: Budget,
};

export default function HomePage() {
  const activeModule = useAppStore((state) => state.activeModule);

  return (
    <AppShell>
      {Object.entries(MODULE_COMPONENTS).map(([id, Component]) => (
        <Component key={id} activeModule={activeModule} />
      ))}
    </AppShell>
  );
}
