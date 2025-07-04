"use client";

"use client";

import React, { useState, memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation';
import { mockDatasets } from '@/lib/mock-data';
import { DatasetTable } from './components/dataset-table';
import { Search, Upload } from 'lucide-react';
import { Dataset } from '@/types';

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export default function DataCommonsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>(mockDatasets);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDatasets = useMemo(() => datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.metadata.domain?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || dataset.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  }), [datasets, searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    verified: datasets.filter(d => d.blockchain && d.blockchain.confirmations >= 32).length,
    total: datasets.length,
    totalSize: formatFileSize(datasets.reduce((acc, d) => acc + d.size, 0)),
    onBlockchain: datasets.filter(d => d.blockchain).length,
  }), [datasets]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-jomolhari">Data Commons</h1>
              <div className="text-lg dzongkha-text text-muted-foreground mb-2">
                གཞི་གྲངས་སྤྱི་ཚོགས།
              </div>
              <p className="text-muted-foreground">
                Blockchain-verified datasets for Bhutan's AI ecosystem
              </p>
            </div>
            <Button className="bg-crimson-950 hover:bg-crimson-800">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search datasets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {stats.verified}
                </div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-crimson-950 dark:text-crimson-400 mb-2">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">Total Datasets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-crimson-950 dark:text-crimson-400 mb-2">
                  {stats.totalSize}
                </div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gold-950 dark:text-gold-400 mb-2">
                  {stats.onBlockchain}
                </div>
                <div className="text-sm text-muted-foreground">On Blockchain</div>
              </CardContent>
            </Card>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Datasets ({filteredDatasets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DatasetTable datasets={filteredDatasets} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}