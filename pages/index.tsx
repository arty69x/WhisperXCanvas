import React from 'react';
import AppShell from '@/components/Layout/AppShell';
import Workspace from '@/components/Modules/Workspace';
import Overview from '@/components/Modules/Overview';
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

export default function HomePage() {
  return (
    <AppShell>
      <Overview activeModule="" />
      <Workspace activeModule="" />
      <Forge activeModule="" />
      <Vault activeModule="" />
      <Archive activeModule="" />
      <Reader activeModule="" />
      <Summary activeModule="" />
      <AI activeModule="" />
      <Docs activeModule="" />
      <Slides activeModule="" />
      <History activeModule="" />
      <Readiness activeModule="" />
      <Topology activeModule="" />
      <Contacts activeModule="" />
      <Budget activeModule="" />
    </AppShell>
  );
}
