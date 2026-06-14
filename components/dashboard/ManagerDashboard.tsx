'use client';

import { Briefcase, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { KPICard } from './KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ManagerDashboardProps {
  stats?: {
    assignedProjects: number;
    completedThisMonth: number;
    pendingTasks: number;
    assignedWorkers: number;
  };
  assignedProjects?: any[];
  workers?: any[];
}

export function ManagerDashboard({
  stats = {
    assignedProjects: 12,
    completedThisMonth: 8,
    pendingTasks: 5,
    assignedWorkers: 8,
  },
  assignedProjects = [],
  workers = [],
}: ManagerDashboardProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Assigned Projects"
          value={stats.assignedProjects}
          icon={<Briefcase className="w-6 h-6" />}
          color="blue"
          change={{ value: 3, isPositive: true }}
        />
        <KPICard
          title="Completed This Month"
          value={stats.completedThisMonth}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          change={{ value: 10, isPositive: true }}
        />
        <KPICard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
        <KPICard
          title="Team Members"
          value={stats.assignedWorkers}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Projects & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Projects</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedProjects.length ? (
                assignedProjects.slice(0, 6).map((project) => (
                  <div key={project.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{project.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{project.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600">{project.assignedWorkers?.length || 0} workers</span>
                      <Badge variant="info" className="text-xs">{project.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No assigned projects</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Button variant="ghost" size="sm">Manage</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workers.length ? (
                workers.slice(0, 6).map((worker) => (
                  <div key={worker.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                        {worker.displayName?.[0] || 'W'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{worker.displayName}</p>
                        <p className="text-xs text-gray-500">{worker.activeProjects || 0} active</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No team members</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: 'Today', project: 'Glass Installation', status: 'in_progress' },
                { date: 'Tomorrow', project: 'Measurement Visit', status: 'scheduled' },
                { date: 'In 2 days', project: 'Installation', status: 'scheduled' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 py-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.project}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <Badge variant={item.status === 'in_progress' ? 'info' : 'default'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button fullWidth variant="primary" size="sm">Assign Worker</Button>
            <Button fullWidth variant="outline" size="sm">Create Project</Button>
            <Button fullWidth variant="outline" size="sm">View Quotations</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"