"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Settings, ExternalLink, MessageSquare, Bot, Users } from 'lucide-react';
import { Agent } from '@/types/agents';

interface AgentDeploymentsProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

function AgentStatusBadge({ status }: { status: Agent['status'] }) {
  const variants = {
    active: { variant: 'default' as const, icon: '●', color: 'text-green-600' },
    draft: { variant: 'secondary' as const, icon: '○', color: 'text-gray-600' },
    inactive: { variant: 'outline' as const, icon: '◐', color: 'text-yellow-600' },
    error: { variant: 'destructive' as const, icon: '✗', color: 'text-red-600' },
  };
  
  const config = variants[status];
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <span className={config.color}>{config.icon}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function AgentDeployments({ agents, setAgents }: AgentDeploymentsProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleActivateAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status: 'active' as const } : agent
    ));
  };

  const handleDeactivateAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status: 'inactive' as const } : agent
    ));
  };

  return (
    <div className="space-y-6">
      
      {/* Featured Active Agents */}
      <div className="grid md:grid-cols-3 gap-4">
        {agents.filter(a => a.status === 'active').slice(0, 3).map(agent => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-crimson-700" />
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{agent.role.replace('-', ' ')}</p>
                  </div>
                </div>
                <AgentStatusBadge status={agent.status} />
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {agent.description}
              </p>
              
              {agent.metrics && (
                <div className="flex justify-between text-xs text-muted-foreground mb-3">
                  <span>{agent.metrics.dailyInteractions} today</span>
                  <span>{Math.round(agent.metrics.satisfactionScore * 100)}% satisfaction</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {agent.config.languages.map(lang => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang === 'dz' ? 'རྫོང་ཁ' : 'EN'}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(agent)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Digital Civil Servants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Interactions</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-crimson-700" />
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {agent.knowledgeSources.length} knowledge source(s)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {agent.role.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <AgentStatusBadge status={agent.status} />
                  </TableCell>
                  <TableCell>
                    {agent.metrics?.dailyInteractions || 0}
                  </TableCell>
                  <TableCell>
                    {agent.metrics ? Math.round(agent.metrics.satisfactionScore * 100) + '%' : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {agent.updatedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {agent.status === 'draft' || agent.status === 'inactive' ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleActivateAgent(agent.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeactivateAgent(agent.id)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedAgent(agent)}
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

      {/* Agent Details Modal */}
      {selectedAgent && (
        <Dialog open onOpenChange={() => setSelectedAgent(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {selectedAgent.name}
              </DialogTitle>
              <DialogDescription>
                Digital Civil Servant Agent Configuration and Analytics
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="capitalize">{selectedAgent.role.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <AgentStatusBadge status={selectedAgent.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Languages:</span>
                      <div className="flex gap-1">
                        {selectedAgent.config.languages.map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang === 'dz' ? 'Dzongkha' : 'English'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Performance Metrics</h3>
                  {selectedAgent.metrics ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interactions:</span>
                        <span>{selectedAgent.metrics.totalInteractions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Average:</span>
                        <span>{selectedAgent.metrics.dailyInteractions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Satisfaction Score:</span>
                        <span>{Math.round(selectedAgent.metrics.satisfactionScore * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Response Time:</span>
                        <span>{selectedAgent.metrics.averageResponseTime}ms</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No metrics available</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
              </div>

              {/* Knowledge Sources */}
              <div>
                <h3 className="font-medium mb-2">Knowledge Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.knowledgeSources.map(sourceId => (
                    <Badge key={sourceId} variant="outline">
                      Dataset {sourceId}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Deployment Options */}
              <div>
                <h3 className="font-medium mb-2">Deployment Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">Chat Interface</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Deploy to the DrukGPT Console for direct citizen interaction
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Deploy to Console
                    </Button>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink className="h-4 w-4" />
                      <span className="font-medium">External Integrations</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect to WhatsApp, Telegram, or other platforms
                    </p>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                        <SelectItem value="telegram">Telegram Bot</SelectItem>
                        <SelectItem value="slack">Slack</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAgent(null)}>
                Close
              </Button>
              <Button className="bg-crimson-950 hover:bg-crimson-800">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}