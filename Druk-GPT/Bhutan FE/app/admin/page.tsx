"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation';
import { mockJobs, mockDatasets, mockIntegrations } from '@/lib/mock-data';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  MessageCircle,
  Send,
  Users,
  Hash,
  FileText,
  MessageSquare,
  Webhook,
  ExternalLink,
  ChevronRight,
  Check,
  RefreshCw
} from 'lucide-react';
import { Job, Integration } from '@/types';

function JobStatusBadge({ status }: { status: Job['status'] }) {
  const variants = {
    completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
    running: { variant: 'secondary' as const, icon: Play, color: 'text-blue-600' },
    pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
    failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
  };
  
  const config = variants[status];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function IntegrationStatusBadge({ status }: { status: Integration['status'] }) {
  const variants = {
    connected: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
    disconnected: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' },
    'requires-setup': { variant: 'secondary' as const, icon: Settings, color: 'text-yellow-600' },
    error: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
  };
  
  const config = variants[status];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status === 'requires-setup' ? 'Setup Required' : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function getIntegrationIcon(iconName: string) {
  const icons = {
    MessageCircle,
    Send,
    Users,
    Hash,
    FileText,
    MessageSquare,
    Webhook,
  };
  return icons[iconName as keyof typeof icons] || MessageCircle;
}

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleCancelJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'failed' as const } : job
    ));
  };

  const handleStartJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'running' as const } : job
    ));
  };

  const runningJobs = jobs.filter(job => job.status === 'running').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const failedJobs = jobs.filter(job => job.status === 'failed').length;
  
  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const totalIntegrations = integrations.length;
  const dailyMessages = integrations.reduce((acc, i) => acc + (i.usage?.dailyMessages || 0), 0);
  const activeUsers = integrations.reduce((acc, i) => acc + (i.usage?.activeUsers || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-jomolhari">Admin Dashboard</h1>
              <div className="text-lg dzongkha-text text-muted-foreground mb-2">
                འཛིན་སྐྱོང་ལས་ཁུངས།
              </div>
              <p className="text-muted-foreground">
                Manage fine-tuning jobs and model deployments
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-crimson-950 hover:bg-crimson-800">
                  <Plus className="h-4 w-4 mr-2" />
                  New Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Fine-tuning Job</DialogTitle>
                  <DialogDescription>
                    Configure a new fine-tuning job for model adaptation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="job-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="job-name"
                      placeholder="Job name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="base-model" className="text-right">
                      Base Model
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="druk-gpt-base">DrukGPT Base</SelectItem>
                        <SelectItem value="druk-gpt-large">DrukGPT Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dataset" className="text-right">
                      Dataset
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select dataset" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDatasets
                          .filter(d => d.status === 'verified')
                          .map(dataset => (
                            <SelectItem key={dataset.id} value={dataset.id}>
                              {dataset.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-crimson-950 hover:bg-crimson-800">
                    Create Job
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {runningJobs}
                </div>
                <div className="text-sm text-muted-foreground">Running Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {completedJobs}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {failedJobs}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-crimson-950 dark:text-crimson-400 mb-2">
                  {jobs.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Jobs</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList>
              <TabsTrigger value="jobs">Fine-tuning Jobs</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Fine-tuning Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div className="font-medium">{job.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {job.type.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <JobStatusBadge status={job.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={job.progress} className="w-20" />
                              <span className="text-sm text-muted-foreground">
                                {job.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{job.config.model}</TableCell>
                          <TableCell>
                            {job.startedAt ? job.startedAt.toLocaleDateString() : 'Not started'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {job.status === 'pending' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStartJob(job.id)}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              {job.status === 'running' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCancelJob(job.id)}
                                >
                                  <Square className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedJob(job)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models">
              <Card>
                <CardHeader>
                  <CardTitle>Model Registry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">DrukGPT Base</h3>
                            <Badge>Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Foundation model for Dzongkha language
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Version: v1.0 • Parameters: 7B
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">DrukGPT Large</h3>
                            <Badge variant="secondary">Training</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Enhanced model with extended context
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Version: v2.0 • Parameters: 13B
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">DrukGPT Cultural</h3>
                            <Badge variant="outline">Development</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Specialized for cultural heritage content
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Version: v0.5 • Parameters: 7B
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="space-y-6">
                {/* Integration Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {connectedIntegrations}
                      </div>
                      <div className="text-sm text-muted-foreground">Connected</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-crimson-950 dark:text-crimson-400 mb-1">
                        {totalIntegrations}
                      </div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gold-950 dark:text-gold-400 mb-1">
                        {integrations.reduce((sum, int) => sum + (int.usage?.dailyMessages || 0), 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Daily Messages</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-crimson-950 dark:text-crimson-400 mb-1">
                        {integrations.reduce((sum, int) => sum + (int.usage?.activeUsers || 0), 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Integrations Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Integrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {integrations.map((integration) => {
                        const Icon = getIntegrationIcon(integration.icon);
                        return (
                          <Card key={integration.id} className="relative hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-crimson-700" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{integration.name}</h3>
                                    <p className="text-xs text-muted-foreground">{integration.provider}</p>
                                  </div>
                                </div>
                                <IntegrationStatusBadge status={integration.status} />
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {integration.description}
                              </p>
                              
                              {integration.status === 'connected' && integration.usage && (
                                <div className="flex justify-between text-xs text-muted-foreground mb-3">
                                  <span>{integration.usage.dailyMessages} msgs today</span>
                                  <span>{integration.usage.activeUsers} users</span>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {integration.type}
                                </Badge>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setSelectedIntegration(integration)}
                                    >
                                      Manage
                                      <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Icon className="h-5 w-5" />
                                        {integration.name} Integration
                                      </DialogTitle>
                                      <DialogDescription>
                                        Configure {integration.name} integration settings for DrukGPT
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="space-y-6">
                                      {/* Status Section */}
                                      <div>
                                        <div className="flex items-center justify-between mb-4">
                                          <h3 className="font-medium">Connection Status</h3>
                                          <IntegrationStatusBadge status={integration.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {integration.description}
                                        </p>
                                      </div>

                                      {/* Configuration */}
                                      <div className="space-y-4">
                                        <h3 className="font-medium">Configuration</h3>
                                        <div className="grid gap-4">
                                          {Object.entries(integration.config).map(([key, value]) => (
                                            <div key={key} className="grid grid-cols-4 items-center gap-4">
                                              <Label htmlFor={key} className="text-right capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                              </Label>
                                              <Input
                                                id={key}
                                                value={typeof value === 'string' ? value : JSON.stringify(value)}
                                                className="col-span-3"
                                                type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('token') || key.toLowerCase().includes('key') ? 'password' : 'text'}
                                                readOnly
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Usage Stats */}
                                      {integration.usage && (
                                        <div className="space-y-4">
                                          <h3 className="font-medium">Usage Statistics</h3>
                                          <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-blue-600">
                                                {integration.usage.dailyMessages}
                                              </div>
                                              <div className="text-xs text-muted-foreground">Daily Messages</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-green-600">
                                                {integration.usage.monthlyMessages}
                                              </div>
                                              <div className="text-xs text-muted-foreground">Monthly Messages</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-purple-600">
                                                {integration.usage.activeUsers}
                                              </div>
                                              <div className="text-xs text-muted-foreground">Active Users</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Features */}
                                      <div className="space-y-4">
                                        <h3 className="font-medium">Features</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                          {integration.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                              <Check className="h-4 w-4 text-green-600" />
                                              {feature}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Setup Instructions */}
                                      {integration.setupInstructions && (
                                        <div className="space-y-4">
                                          <h3 className="font-medium">Setup Instructions</h3>
                                          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                            {integration.setupInstructions.map((instruction, index) => (
                                              <li key={index}>{instruction}</li>
                                            ))}
                                          </ol>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex justify-end gap-2">
                                      {integration.status === 'connected' && (
                                        <Button variant="outline" size="sm">
                                          <RefreshCw className="h-4 w-4 mr-2" />
                                          Sync Now
                                        </Button>
                                      )}
                                      <Button 
                                        className="bg-crimson-950 hover:bg-crimson-800"
                                        size="sm"
                                      >
                                        {integration.status === 'connected' ? 'Update' : 'Connect'}
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Model Accuracy</span>
                          <span className="text-sm font-medium">89.1%</span>
                        </div>
                        <Progress value={89.1} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Response Quality</span>
                          <span className="text-sm font-medium">92.5%</span>
                        </div>
                        <Progress value={92.5} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Dzongkha Fluency</span>
                          <span className="text-sm font-medium">87.3%</span>
                        </div>
                        <Progress value={87.3} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Uptime</span>
                        <Badge variant="default">99.9%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <Badge variant="secondary">1.2s</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Requests</span>
                        <Badge variant="outline">2.1K</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Storage Usage</span>
                        <Badge variant="outline">73%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}