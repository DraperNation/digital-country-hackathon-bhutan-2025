"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { AgentBuilder } from './components/agent-builder';
import { AgentDeployments } from './components/agent-deployments';
import { AgentTemplates } from './components/agent-templates';
import { mockAgents, mockAgentTemplates } from '@/lib/mock-agents';
import { Bot, Plus, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { Agent } from '@/types/agents';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [showBuilder, setShowBuilder] = useState(false);

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalInteractions = agents.reduce((sum, a) => sum + (a.metrics?.totalInteractions || 0), 0);
  const avgSatisfaction = agents.reduce((sum, a) => sum + (a.metrics?.satisfactionScore || 0), 0) / agents.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-jomolhari">Digital Civil Servants</h1>
              <div className="text-lg dzongkha-text text-muted-foreground mb-2">
                ཨང་རྟགས་ཞབས་ཏོག་པ།
              </div>
              <p className="text-muted-foreground">
                AI agents serving Bhutanese citizens with cultural sensitivity and expertise
              </p>
            </div>
            <Button 
              className="bg-crimson-950 hover:bg-crimson-800"
              onClick={() => setShowBuilder(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {activeAgents}
                </div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {totalInteractions.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Interactions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-crimson-950 dark:text-crimson-400 mb-2">
                  {Math.round(avgSatisfaction * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Satisfaction Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gold-950 dark:text-gold-400 mb-2">
                  {agents.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Agents</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="deployments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="deployments">
              <AgentDeployments agents={agents} setAgents={setAgents} />
            </TabsContent>

            <TabsContent value="templates">
              <AgentTemplates templates={mockAgentTemplates} onCreateAgent={() => setShowBuilder(true)} />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {agents.filter(a => a.status === 'active').map(agent => (
                        <div key={agent.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-crimson-700" />
                            <span className="text-sm font-medium">{agent.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agent.metrics?.dailyInteractions || 0} interactions today
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Top Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Citizenship Services</span>
                        <Badge variant="secondary">45%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Document Processing</span>
                        <Badge variant="secondary">32%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cultural Information</span>
                        <Badge variant="secondary">15%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Legal Assistance</span>
                        <Badge variant="secondary">8%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Agent Builder Modal */}
      {showBuilder && (
        <AgentBuilder 
          onClose={() => setShowBuilder(false)}
          onSave={(newAgent) => {
            setAgents(prev => [...prev, newAgent]);
            setShowBuilder(false);
          }}
        />
      )}
    </div>
  );
}