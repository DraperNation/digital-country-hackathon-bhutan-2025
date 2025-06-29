import { GoogleGenerativeAI } from "@google/generative-ai";

export class ClassifierService {
    private geminiApiKey = 'AIzaSyAxHALyUu4eOvCE6NgAuoETTyFPGhBrAio';
    private gemini: GoogleGenerativeAI;
    private emailJSConfig: {
        serviceId: string;
        templateId: string;
        publicKey: string;
    };
    private alertEmail: string;

    constructor(geminiApiKey: string, emailJSConfig: {
        serviceId: string;
        templateId: string;
        publicKey: string;
    }, alertEmail: string) {
        this.gemini = new GoogleGenerativeAI(this.geminiApiKey);
        this.emailJSConfig = emailJSConfig;
        this.alertEmail = alertEmail;
    }

    /**
     * Send email alert using EmailJS REST API for classified social problem
     * @param socialProblem The classified social problem
     * @param originalText The original Dzongkha text
     * @param translatedText The English translation
     */
    private async sendEmailAlert(socialProblem: string, originalText: string, translatedText: string): Promise<void> {
        try {
            const templateParams = {
                to_email: this.alertEmail,
                to_name: 'Alert Recipient',
                from_name: 'Social Problem Classification System',
                subject: `🚨 Social Problem Alert: ${socialProblem.replace(/_/g, ' ').toUpperCase()}`,
                social_problem: socialProblem.replace(/_/g, ' ').toUpperCase(),
                original_text: originalText,
                translated_text: translatedText,
                timestamp: new Date().toLocaleString(),
                classification_system: 'Bhindi AI',
                country: 'Bhutan',
                
                // HTML formatted content for rich email templates
                html_content: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
                            Social Problem Classification Alert
                        </h2>
                        
                        <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #f57c00; margin-top: 0;">Classified Problem:</h3>
                            <p style="font-size: 18px; font-weight: bold; color: #d32f2f;">
                                ${socialProblem.replace(/_/g, ' ').toUpperCase()}
                            </p>
                        </div>

                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Original Text (Dzongkha):</h3>
                            <p style="font-style: italic; color: #555;">${originalText}</p>
                        </div>

                        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #2e7d32; margin-top: 0;">English Translation:</h3>
                            <p style="color: #333;">${translatedText}</p>
                        </div>

                        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #1976d2; margin-top: 0;">Alert Details:</h3>
                            <ul style="color: #333;">
                                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                                <li><strong>Classification System:</strong> Bhindi AI</li>
                                <li><strong>Country:</strong> Bhutan</li>
                            </ul>
                        </div>

                        <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 30px; text-align: center;">
                            <p style="color: #666; font-size: 12px;">
                                This is an automated alert from the Social Problem Classification System
                            </p>
                        </div>
                    </div>
                `,
                
                // Plain text version
                plain_text_content: `
Social Problem Classification Alert

Classified Problem: ${socialProblem.replace(/_/g, ' ').toUpperCase()}

Original Text (Dzongkha): ${originalText}

Timestamp: ${new Date().toLocaleString()}
Classification System: Bhindi AI
Country: Bhutan

This is an automated alert from the Social Problem Classification System.
                `
            };

            // Use EmailJS REST API with fetch
            const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: this.emailJSConfig.serviceId,
                    template_id: this.emailJSConfig.templateId,
                    user_id: this.emailJSConfig.publicKey,
                    template_params: templateParams
                })
            });
            console.log("Email Res:",response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
            }

            const result = await response.text();
            console.log('Email alert sent successfully:', result);
            console.log('Alert sent to:', this.alertEmail);
            
        } catch (error) {
            console.error('Failed to send email alert:', error);
            if (error instanceof Error) {
                throw new Error(`EmailJS sending failed: ${error.message}`);
            } else {
                throw new Error('EmailJS sending failed: Unknown error');
            }
        }
    }

    /**
     * Classify a given text into categories and send email alert
     * @param text The text to classify
     * @returns The classified social problem category
     */
    async classify(question: string): Promise<string> {
        console.log('Classifying question:', question);
        
        const socialProblemsBhutan = [
            'youth_unemployment',
            'brain_drain',
            'substance_abuse_among_youth',
            'mental_health_stigma_and_limited_services',
            'poverty_disparities_rural_urban',
            'access_to_quality_education_and_skill_gap',
            'housing_shortages_and_affordability_in_urban_areas',
            'domestic_violence_and_gender_based_violence',
            'limited_social_protection_for_informal_sector_workers',
            'elder_abuse_and_neglect',
            'inadequate_support_for_persons_with_severe_disabilities',
            'food_insecurity_in_remote_areas',
            'limited_access_to_clean_water_and_sanitation_in_some_areas',
            'waste_management_challenges',
            'non_communicable_diseases_rise',
            'road_safety_issues_and_accidents',
            'climate_change_vulnerability_and_impacts',
            'land_and_property_disputes',
            'limited_diversification_of_economy',
            'rural_urban_migration_and_social_dislocation',
            'issues_with_quality_and_inclusiveness_of_social_services',
            'insufficient_data_for_vulnerable_groups',
            'capacity_and_retention_of_civil_servants',
            'limited_private_sector_development',
            'balancing_development_with_gnh_principles',
        ];

        const model = this.gemini.getGenerativeModel({
            model: 'gemini-2.0-flash'
        });
        
        console.log('Using Gemini model:', model.model);
        
        // Enhanced prompt to get both translation and classification
        const prompt = `
        I am giving you some text in Dzongkha. Please:
        1. Convert it to English
        2. Match it with the following list of social problems in Bhutan
        3. Return the response in this exact format: "TRANSLATION: [English translation] | INDEX: [number]"

        ${socialProblemsBhutan.map((p, i) => `${i + 1}. ${p}`).join('\n')}

        Return the most relevant problem index (just the number) and the English translation.

        Dzongkha text: """${question}"""
        `;
        
        try {
            const result = await model.generateContent(prompt);
            console.log('Classification result:', result);
            
            const responseText = await result.response.text();
            console.log('Response text:', responseText);
            
            // Extract translation and index from response
            let translation = '';
            let index = '';
            
            if (responseText.includes('TRANSLATION:') && responseText.includes('INDEX:')) {
                const parts = responseText.split('|');
                translation = parts[0].replace('TRANSLATION:', '').trim();
                const indexPart = parts[1].replace('INDEX:', '').trim();
                
                for (let i = 0; i < indexPart.length; i++) {
                    if (indexPart[i] >= '0' && indexPart[i] <= '9') {
                        index += indexPart[i];
                    }
                }
            } else {
                // Fallback: extract numbers from response
                for (let i = 0; i < responseText.length; i++) {
                    if (responseText[i] >= '0' && responseText[i] <= '9') {
                        index += responseText[i];
                    }
                }
                translation = 'Translation not available';
            }
            
            console.log('Extracted index:', parseInt(index));
            const classifiedProblem = socialProblemsBhutan[parseInt(index) - 1];
            console.log('Classified problem:', classifiedProblem || 'Unknown category');
            
            if (classifiedProblem) {
                // Send email alert using EmailJS
                await this.sendEmailAlert(classifiedProblem, question, translation);
                return classifiedProblem;
            } else {
                throw new Error('Could not classify the social problem');
            }
            
        } catch (error) {
            console.error('Classification error:', error);
            throw error;
        }
    }
}

// Usage example:
/*
// First, set up EmailJS:
// 1. Create account at https://www.emailjs.com/
// 2. Create email service (Gmail, Outlook, etc.)
// 3. Create email template
// 4. Get your Public Key, Service ID, and Template ID

const emailJSConfig = {
    serviceId: 'your_service_id',      // From EmailJS dashboard
    templateId: 'your_template_id',    // From EmailJS dashboard  
    publicKey: 'your_public_key'       // From EmailJS dashboard
};

const classifier = new ClassifierService(
    'your-gemini-api-key',
    emailJSConfig,
    'alert-recipient@example.com'
);

// Usage
classifier.classify('དཀའ་ངལ་ཞིག་ཡོད།') // Example Dzongkha text
    .then(result => console.log('Classification:', result))
    .catch(error => console.error('Error:', error));
*/

/* 
EmailJS Template Variables (use these in your EmailJS template):
- {{to_email}} - Recipient email
- {{to_name}} - Recipient name
- {{from_name}} - Sender name
- {{subject}} - Email subject
- {{social_problem}} - Classified problem
- {{original_text}} - Original Dzongkha text
- {{translated_text}} - English translation
- {{timestamp}} - When alert was generated
- {{html_content}} - Rich HTML content
- {{plain_text_content}} - Plain text version

Example EmailJS Template:
Subject: {{subject}}

To: {{to_name}} <{{to_email}}>
From: {{from_name}}

{{{html_content}}}

If HTML doesn't display properly:
{{{plain_text_content}}}
*/