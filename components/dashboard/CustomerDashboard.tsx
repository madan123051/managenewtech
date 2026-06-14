'use client';

import { Briefcase, Clock, CheckCircle, ImageIcon } from 'lucide-react';
import { KPICard } from './KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CustomerDashboardProps {
  stats?: {
    activeProjects: number;
    completedProjects: number;
    totalSpent: number;
    warranty: number;
  };
  projects?: any[];
  quotations?: any[];
}

export function CustomerDashboard({
  stats = {
    activeProjects: 2,
    completedProjects: 5,
    totalSpent: 150000,
    warranty: 3,
  },
  projects = [],
  quotations = [],
}: CustomerDashboardProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Briefcase className="w-6 h-6" />}
          color="blue"
        />
        <KPICard
          title="Completed Projects"
          value={stats.completedProjects}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <KPICard
          title="Total Investment"
          value={`₹${(stats.totalSpent / 100000).toFixed(1)}L`}
          icon={<ImageIcon className="w-6 h-6" />}
          color="purple"
        />
        <KPICard
          title="Active Warranty"
          value={stats.warranty}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* My Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.length ? (
                projects.map((project) => (
                  <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{project.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Started: {project.createdAt}</p>
                      </div>
                      <Badge variant={project.status === 'completed' ? 'success' : project.status === 'installation_in_progress' ? 'info' : 'default'}>
                        {project.status?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    {project.progress && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{project.progress}% Complete</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quotations */}
        <Card>
          <CardHeader>
            <CardTitle>My Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quotations.length ? (
                quotations.map((quote) => (
                  <div key={quote.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">Quote #{quote.quotationNumber}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">₹{(quote.total / 100000).toFixed(1)}L</p>
                      </div>
                      <Badge variant={quote.status === 'approved' ? 'success' : quote.status === 'sent' ? 'info' : 'default'}>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <Button fullWidth variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No quotations</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Gallery & Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Installation Started', date: 'Today', project: 'Glass Installation - Project 1' },
              { title: 'Site Measurement Complete', date: '2 days ago', project: 'Blinds Installation' },
              { title: 'Quotation Approved', date: '1 week ago', project: 'Partition Installation' },
            ].map((update, idx) => (
              <div key={idx} className="flex gap-4 py-3 border-b last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{update.title}</p>
                  <p className="text-xs text-gray-500">{update.project} · {update.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"