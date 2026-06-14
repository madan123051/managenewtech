'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProjectList } from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getProjects } from '@/lib/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProjects({});
        setProjects(p);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <MainLayout>
      <PageHeader 
        title="Projects"
        description="View and manage all projects"
        action={
          <Link href="/projects/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </MainLayout>
  );
}
