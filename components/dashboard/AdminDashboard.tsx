'use client';

import { Users, Briefcase, FileText, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { KPICard } from './KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface AdminDashboardProps {
  stats?: {
    totalCustomers: number;
    totalProjects: number;
    totalQuotations: number;
    completedProjects: number;
    pendingProjects: number;
    revenueThisMonth: number;
  };
  recentProjects?: any[];
  recentLeads?: any[];
}

export function AdminDashboard({
  stats = {
    totalCustomers: 124,
    totalProjects: 45,
    totalQuotations: 32,
    completedProjects: 28,
    pendingProjects: 17,
    revenueThisMonth: 450000,
  },
  recentProjects = [],
  recentLeads = [],
}: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          change={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Projects"
          value={stats.totalProjects}
          icon={<Briefcase className="w-6 h-6" />}
          color="green"
          change={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Pending Quotations"
          value={stats.totalQuotations}
          icon={<FileText className="w-6 h-6" />}
          color="orange"
          change={{ value: 8, isPositive: false }}
        />
        <KPICard
          title="Completed Projects"
          value={stats.completedProjects}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          change={{ value: 15, isPositive: true }}
        />
        <KPICard
          title="Pending Projects"
          value={stats.pendingProjects}
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
          change={{ value: 3, isPositive: false }}
        />
        <KPICard
          title="Revenue (This Month)"
          value="₹45L"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          change={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Recent Projects & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length ? (
                recentProjects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.customerName}</p>
                    </div>
                    <Badge variant={project.status === 'completed' ? 'success' : 'info'}>
                      {project.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No recent projects</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.length ? (
                recentLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{lead.customerName}</p>
                      <p className="text-xs text-gray-500">{lead.customerPhone}</p>
                    </div>
                    <Badge variant={lead.status === 'qualified' ? 'success' : lead.status === 'contacted' ? 'info' : 'default'}>
                      {lead.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No recent leads</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New project created</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Project completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Quotation approved</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-sm font-semibold text-gray-900">62%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Project On-Time</p>
                <p className="text-sm font-semibold text-gray-900">85%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
