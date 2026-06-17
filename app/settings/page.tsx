'use client';

export const dynamic = 'force-dynamic';

import { Layout } from '@/components/Layout';
import { SettingsPage } from '@/components/settings/SettingsPage';

export default function SettingsRoute() {
  return (
    <Layout title="Settings" subtitle="Manage your account and preferences">
      <SettingsPage />
    </Layout>
  );
}
