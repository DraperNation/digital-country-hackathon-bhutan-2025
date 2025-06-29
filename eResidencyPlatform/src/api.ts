import { User, Company, KYCDocument, GovernmentService, TaxBenefit } from '../types';

// Mock API delays for realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockAPI {
  private users: Map<string, User> = new Map();
  private companies: Map<string, Company> = new Map();

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await delay(1500);
    
    const user: User = {
      ...userData,
      id: `user_${Date.now()}`,
      kycLevel: 'basic',
      eResidencyStatus: 'not_applied',
      companies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    await delay(1000);
    
    // Find user by email (mock)
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  }

  async submitKYCDocument(userId: string, document: KYCDocument): Promise<{ success: boolean; extractedData?: any }> {
    await delay(2000);
    
    // Mock AI document verification
    const mockExtractedData = {
      documentNumber: 'P123456789',
      fullName: 'John Smith',
      dateOfBirth: '1990-01-01',
      nationality: 'US',
      expiryDate: '2030-01-01',
      verificationScore: 0.95,
    };

    return {
      success: Math.random() > 0.1, // 90% success rate
      extractedData: mockExtractedData,
    };
  }

  async submitEResidencyApplication(userId: string): Promise<{ success: boolean; applicationId: string }> {
    await delay(3000);
    
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.eResidencyStatus = 'pending';
    user.updatedAt = new Date().toISOString();
    this.users.set(userId, user);

    return {
      success: true,
      applicationId: `app_${Date.now()}`,
    };
  }

  async incorporateCompany(userId: string, companyData: any): Promise<Company> {
    await delay(5000);
    
    const company: Company = {
      id: `comp_${Date.now()}`,
      name: companyData.companyName,
      type: companyData.companyType,
      registrationNumber: `BT${Date.now()}`,
      status: 'forming',
      incorporationDate: new Date().toISOString(),
      virtualOffice: {
        address: 'Thimphu Tech Park, Building A, Suite 100',
        city: 'Thimphu',
        postalCode: '11001',
        country: 'Bhutan',
      },
      documents: [],
    };

    this.companies.set(company.id, company);
    
    const user = this.users.get(userId);
    if (user) {
      user.companies.push(company);
      this.users.set(userId, user);
    }

    return company;
  }

  async getGovernmentServices(): Promise<GovernmentService[]> {
    await delay(500);
    
    return [
      {
        id: 'business_license',
        name: 'Business License Application',
        description: 'Apply for various business licenses and permits',
        category: 'licensing',
        status: 'available',
        processingTime: '5-7 business days',
        fee: 500,
      },
      {
        id: 'tax_registration',
        name: 'Tax Registration',
        description: 'Register for corporate income tax and GST',
        category: 'tax',
        status: 'available',
        processingTime: '2-3 business days',
        fee: 200,
      },
      {
        id: 'import_permit',
        name: 'Import/Export Permit',
        description: 'Apply for import and export permits',
        category: 'permits',
        status: 'available',
        processingTime: '7-10 business days',
        fee: 1000,
      },
    ];
  }

  async calculateTaxBenefits(country: string): Promise<TaxBenefit[]> {
    await delay(1000);
    
    const mockBenefits: TaxBenefit[] = [
      {
        country: 'United States',
        treatyExists: true,
        corporateTaxRate: 25,
        witholdingTaxRate: 10,
        estimatedSavings: 15000,
      },
      {
        country: 'United Kingdom',
        treatyExists: true,
        corporateTaxRate: 25,
        witholdingTaxRate: 5,
        estimatedSavings: 12000,
      },
      {
        country: 'Singapore',
        treatyExists: true,
        corporateTaxRate: 25,
        witholdingTaxRate: 0,
        estimatedSavings: 18000,
      },
    ];

    return mockBenefits;
  }

  async generateBusinessName(industry: string, keywords: string[]): Promise<string[]> {
    await delay(800);
    
    const suggestions = [
      `${keywords[0]} Bhutan Ventures Ltd`,
      `Thunder Dragon ${industry} Corp`,
      `Himalayan ${keywords[0]} Solutions`,
      `Druk ${industry} Enterprises`,
      `${keywords[0]} Innovation Hub Bhutan`,
    ];

    return suggestions;
  }

  async checkNameAvailability(name: string): Promise<{ available: boolean; alternatives?: string[] }> {
    await delay(1200);
    
    const isAvailable = Math.random() > 0.3; // 70% availability rate
    
    if (isAvailable) {
      return { available: true };
    }

    return {
      available: false,
      alternatives: [
        `${name} Ltd`,
        `${name} Corp`,
        `${name} Ventures`,
        `New ${name}`,
        `${name} International`,
      ],
    };
  }
}

export const api = new MockAPI();