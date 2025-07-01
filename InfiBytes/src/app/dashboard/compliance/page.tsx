'use client';

import { ComplianceChecker } from './compliance-checker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function CompliancePage() {
  const { t } = useLanguage();

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t('aiPoweredCompliance')}</CardTitle>
            <CardDescription>
            {t('aiPoweredComplianceDesc')}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ComplianceChecker />
        </CardContent>
    </Card>
  );
}
