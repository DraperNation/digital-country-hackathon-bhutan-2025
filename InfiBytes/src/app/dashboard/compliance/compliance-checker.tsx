'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { assessComplianceRisk, ComplianceRiskAssessmentOutput } from '@/ai/flows/compliance-risk-assessment';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, ListChecks, Loader2, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

const formSchema = z.object({
  applicantData: z.string().min(50, {
    message: 'Applicant data must be at least 50 characters.',
  }),
});

export function ComplianceChecker() {
  const [assessment, setAssessment] = useState<ComplianceRiskAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setAssessment(null);
    try {
      const result = await assessComplianceRisk(values);
      setAssessment(result);
    } catch (e) {
      setError('An error occurred during the assessment. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const getRiskBadgeVariant = (level: 'low' | 'medium' | 'high'): BadgeProps['variant'] => {
    switch (level) {
      case 'low':
        return 'outline';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch(level) {
        case 'low': return <CheckCircle2 className="h-5 w-5 text-chart-2" />;
        case 'medium': return <AlertTriangle className="h-5 w-5 text-chart-4" />;
        case 'high': return <MinusCircle className="h-5 w-5 text-destructive" />;
    }
  }
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="applicantData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('applicantData')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('applicantDataPlaceholder')}
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('assessRisk')}
          </Button>
        </form>
      </Form>

      {error && <p className="text-destructive">{error}</p>}

      {assessment && (
        <div className="grid gap-6 pt-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        {getRiskIcon(assessment.overallRiskLevel)}
                        <CardTitle>{t('overallRiskLevel')}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Badge variant={getRiskBadgeVariant(assessment.overallRiskLevel)} className={cn("text-lg capitalize", assessment.overallRiskLevel === 'low' && "border-chart-2 text-chart-2")}>
                        {t(assessment.overallRiskLevel)}
                    </Badge>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-primary" />
                        <CardTitle>{t('assessmentSummary')}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{assessment.riskAssessmentSummary}</p>
                </CardContent>
            </Card>
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>{t('flaggedIssues')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {assessment.flaggedIssues.length > 0 ? (
                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                        {assessment.flaggedIssues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No issues flagged.</p>
                    )}
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>{t('suggestedActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{assessment.suggestedActions}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
