"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Users, FileText, Scale, Heart, Landmark } from 'lucide-react';
import { AgentTemplate } from '@/types/agents';

interface AgentTemplatesProps {
  templates: AgentTemplate[];
  onCreateAgent: () => void;
}

function getTemplateIcon(role: string) {
  const icons = {
    'citizen-service': Users,
    'document-assistant': FileText,
    'policy-advisor': Landmark,
    'cultural-guide': Bot,
    'legal-helper': Scale,
    'health-advisor': Heart,
  };
  return icons[role as keyof typeof icons] || Bot;
}

export function AgentTemplates({ templates, onCreateAgent }: AgentTemplatesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Agent Templates</h2>
        <p className="text-muted-foreground">
          Pre-configured templates for common government services and citizen assistance
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = getTemplateIcon(template.role);
          
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-crimson-50 dark:bg-crimson-950/20 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-crimson-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {template.role.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Template
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {template.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Key Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.capabilities.slice(0, 3).map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {template.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Languages:</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">English</Badge>
                      <Badge variant="outline" className="text-xs">རྫོང་ཁ</Badge>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-crimson-950 hover:bg-crimson-800"
                  onClick={onCreateAgent}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Template Option */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">Create Custom Agent</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Build a specialized agent from scratch with custom capabilities and knowledge sources
          </p>
          <Button variant="outline" onClick={onCreateAgent}>
            Start from Scratch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}