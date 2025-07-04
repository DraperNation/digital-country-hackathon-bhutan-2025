import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlockchainVerification } from '@/components/blockchain-verification';
import { Download, ExternalLink } from 'lucide-react';
import { Dataset } from '@/types';

interface DatasetTableProps {
  datasets: Dataset[];
}

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function StatusBadge({ status }: { status: Dataset['status'] }) {
  const variants = {
    verified: { variant: 'default' as const, icon: '✓', color: 'text-green-600' },
    processing: { variant: 'secondary' as const, icon: '⏳', color: 'text-yellow-600' },
    pending: { variant: 'outline' as const, icon: '⏳', color: 'text-gray-600' },
    failed: { variant: 'destructive' as const, icon: '✗', color: 'text-red-600' },
  };
  
  const config = variants[status];
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <span className={config.color}>{config.icon}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

const DatasetRow = memo(function DatasetRow({ dataset }: { dataset: Dataset }) {
  return (
    <TableRow key={dataset.id}>
      <TableCell>
        <div>
          <div className="font-medium">{dataset.name}</div>
          {dataset.metadata.domain && (
            <div className="text-sm text-muted-foreground">
              {dataset.metadata.domain}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {dataset.type}
        </Badge>
      </TableCell>
      <TableCell>{formatFileSize(dataset.size)}</TableCell>
      <TableCell>
        <StatusBadge status={dataset.status} />
      </TableCell>
      <TableCell>{dataset.license}</TableCell>
      <TableCell>
        {dataset.uploadedAt.toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <BlockchainVerification dataset={dataset} />
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

export const DatasetTable = memo(function DatasetTable({ datasets }: DatasetTableProps) {
  const memoizedRows = useMemo(() => 
    datasets.map(dataset => (
      <DatasetRow key={dataset.id} dataset={dataset} />
    )), 
    [datasets]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>License</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memoizedRows}
      </TableBody>
    </Table>
  );
});