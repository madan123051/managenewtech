'use client';

import { Briefcase, MapPin, Clock, CheckCircle } from 'lucide-react';
import { KPICard } from './KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface WorkerDashboardProps {
  stats?: {
    todayJobs: number;
    completedJobs: number;
    totalHours: number;
    rating: number;
  };
  todayJobs?: any[];
  completedJobs?: any[];
}

export function WorkerDashboard({
  stats = {
    todayJobs: 3,
    completedJobs: 142,
    totalHours: 856,
    rating: 4.8,
  },
  todayJobs = [],
  completedJobs = [],
}: WorkerDashboardProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Today's Jobs"
          value={stats.todayJobs}
          icon={<Briefcase className="w-6 h-6" />}
          color="blue"
          change={{ value: 20, isPositive: true }}
        />
        <KPICard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          change={{ value: 15, isPositive: true }}
        />
        <KPICard
          title="Total Hours"
          value={Math.round(stats.totalHours / 40) + ' wks'}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
        <KPICard
          title="Rating"
          value={stats.rating + '★'}
          icon={<CheckCircle className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Today's Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Jobs</CardTitle>
          <Badge variant="success">2 Completed</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayJobs.length ? (
              todayJobs.map((job, idx) => (
                <div key={job.id || idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{job.title || job.projectTitle}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.siteAddress || 'Site Location'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.time || '10:00 AM'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">Customer: {job.customerName}</span>
                    <Badge variant={job.status === 'completed' ? 'success' : 'info'}>
                      {job.status || 'pending'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No jobs scheduled for today</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Completions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedJobs.length ? (
                completedJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.customerName}</p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No completed jobs yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-sm font-semibold text-gray-900">95%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">On-Time Arrival</p>
                <p className="text-sm font-semibold text-gray-900">92%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Quality Rating</p>
                <p className="text-sm font-semibold text-gray-900">4.8/5</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
