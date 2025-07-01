// src/ai/flows/compliance-risk-assessment.ts
'use server';

/**
 * @fileOverview An AI agent for compliance and risk assessment of e-residency applicants.
 *
 * - assessComplianceRisk - A function that handles the compliance risk assessment process.
 * - ComplianceRiskAssessmentInput - The input type for the assessComplianceRisk function.
 * - ComplianceRiskAssessmentOutput - The return type for the assessComplianceRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplianceRiskAssessmentInputSchema = z.object({
  applicantData: z.string().describe('Comprehensive data about the applicant, including personal information, business history, and financial details.'),
});
export type ComplianceRiskAssessmentInput = z.infer<typeof ComplianceRiskAssessmentInputSchema>;

const ComplianceRiskAssessmentOutputSchema = z.object({
  riskAssessmentSummary: z.string().describe('A summary of the risk assessment, highlighting potential compliance and risk issues.'),
  flaggedIssues: z.array(z.string()).describe('A list of specific compliance or risk issues flagged for further review.'),
  suggestedActions: z.string().describe('Suggested actions for addressing the identified risks or compliance issues.'),
  overallRiskLevel: z.enum(['low', 'medium', 'high']).describe('The overall risk level associated with the applicant.'),
});
export type ComplianceRiskAssessmentOutput = z.infer<typeof ComplianceRiskAssessmentOutputSchema>;

export async function assessComplianceRisk(input: ComplianceRiskAssessmentInput): Promise<ComplianceRiskAssessmentOutput> {
  return assessComplianceRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'complianceRiskAssessmentPrompt',
  input: {schema: ComplianceRiskAssessmentInputSchema},
  output: {schema: ComplianceRiskAssessmentOutputSchema},
  prompt: `You are an AI assistant specialized in compliance and risk assessment.

You will receive applicant data, and your task is to analyze the data for potential compliance and risk issues.

Based on your analysis, provide a risk assessment summary, flag any specific issues, suggest actions for addressing the risks, and determine the overall risk level (low, medium, or high).

Applicant Data: {{{applicantData}}}`,
});

const assessComplianceRiskFlow = ai.defineFlow(
  {
    name: 'assessComplianceRiskFlow',
    inputSchema: ComplianceRiskAssessmentInputSchema,
    outputSchema: ComplianceRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
