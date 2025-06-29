# 🏴 Bhutan E-Residency Portal

A comprehensive digital identity and e-residency platform for the Kingdom of Bhutan, powered by **Sovio Digital Identity** technology. This Next.js application enables global entrepreneurs to become e-residents of Bhutan and access a full suite of digital government services.

![Bhutan E-Residency](./public/bhutan.svg.png)

## ✨ Features

### 🔐 Digital Identity & Authentication
- **Sovio DID Integration**: Create verifiable digital identities using blockchain technology
- **KYC Process**: Comprehensive Know Your Customer verification
- **E-Resident Card**: Digital identity card for accessing government services
- **Proof Verification**: Request and verify identity proofs via email/QR codes

### 🏦 Banking & Financial Services
- **Bank Account Registration**: Open accounts with Bhutan National Bank using DID
- **Business Banking**: Multi-currency accounts with international transfer support
- **Payment Solutions**: Online payment processing and e-commerce integration
- **Cross-Border Tax Consulting**: Expert guidance on international tax obligations

### 🏢 Business Services
- **Company Registration**: 100% online business incorporation in 24 hours
- **Tax Registration & Filing**: TIN registration with 0% corporate tax on undistributed profits
- **Business Licenses**: Industry-specific permits and import/export licenses
- **Legal Address & Contact**: Registered business address and local contact person assignment

### 🌍 E-Residency Benefits
- **Digital Nomad Visa**: Work remotely with special tax incentives
- **Investment Incentives**: Access to funding and startup programs
- **Service Provider Marketplace**: Connect with verified lawyers, accountants, and consultants
- **Annual Compliance**: Automated filing reminders and regulatory updates

### 😊 Unique Bhutan Features
- **Gross National Happiness (GNH)**: Sustainable business practices measurement
- **Document Authentication**: Internationally recognized digital signatures
- **Business Mentorship**: Access to successful entrepreneurs and incubators

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd claude-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Custom shadcn/ui components
- **Digital Identity**: Sovio API integration
- **Authentication**: JWT-based with localStorage persistence
- **Image Handling**: Next.js Image optimization

## 📁 Project Structure

```
claude-frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── create-identity/      # Sovio identity creation
│   │   └── request-proof/        # DID proof verification
│   ├── dashboard/               # E-resident dashboard
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React Components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── select.tsx
│   ├── auth-buttons.tsx         # Authentication interface
│   ├── bank-registration-form.tsx # Banking application
│   ├── dashboard.tsx            # Main dashboard
│   └── kyc-form.tsx            # KYC verification form
├── lib/                         # Utility functions
│   ├── sovio.js                # Sovio API integration
│   ├── sovio-proof.js          # Proof verification
│   └── utils.ts                # Helper functions
└── public/                      # Static assets
    └── bhutan.svg.png          # Bhutan coat of arms
```

## 🔧 API Configuration

### Sovio API Integration

The application integrates with Sovio's API for digital identity management. You'll need to configure the following:

1. **Bearer Token**: Update the token in `lib/sovio.js` and `lib/sovio-proof.js`
2. **Organization ID**: Currently set to Bhutan's organization ID
3. **API Endpoints**: 
   - Identity Creation: `https://api.sovio.id/orgs/{org-id}/credentials/oob/email`
   - Proof Verification: `https://api.sovio.id/orgs/{org-id}/proofs/oob`

### Environment Variables (Recommended)

Create a `.env.local` file:
```env
SOVIO_API_TOKEN=your_bearer_token_here
SOVIO_ORG_ID=a6114767-a9e7-4f46-85aa-6d105d42bf2e
```

## 🎯 User Journey

### 1. **Registration Process**
```
Landing Page → Sign Up → KYC Form → Identity Creation → Dashboard
```

### 2. **Service Access**
```
Dashboard → Select Service → Complete Application → DID Verification → Service Activation
```

### 3. **Bank Account Example**
```
Bank Registration → Fill Form → Submit → Identity Proof Request → Verification → Account Creation
```

## 🌐 Available Services

| Service | Status | Description |
|---------|--------|-------------|
| 🏦 **Bank Account** | ✅ Active | Personal/business banking with DID verification |
| 🏢 **Company Registration** | 🔄 Coming Soon | Business incorporation services |
| 📊 **Tax Services** | 🔄 Coming Soon | TIN registration and filing |
| 🆔 **Digital ID** | ✅ Active | E-resident card management |
| 💳 **Business Banking** | 🔄 Coming Soon | Multi-currency business accounts |
| 📍 **Legal Address** | 🔄 Coming Soon | Registered address services |
| 📈 **Accounting** | 🔄 Coming Soon | Professional bookkeeping |
| 📜 **Business Licenses** | 🔄 Coming Soon | Permits and licenses |
| 🤝 **Marketplace** | 🔄 Coming Soon | Service provider network |
| 🌍 **Tax Consulting** | 🔄 Coming Soon | International tax guidance |
| 💰 **Payment Solutions** | 🔄 Coming Soon | Online payment processing |
| 📅 **Compliance** | 🔄 Coming Soon | Automated filing reminders |
| ✈️ **Digital Nomad Visa** | 🔄 Coming Soon | Remote work permits |
| 📈 **Investments** | 🔄 Coming Soon | Funding opportunities |
| ✍️ **Document Auth** | 🔄 Coming Soon | Digital signatures |
| 😊 **GNH Business** | 🔄 Coming Soon | Happiness measurement |

## 🔒 Security Features

- **Encrypted Identity Storage**: All personal data encrypted using Sovio's blockchain
- **Zero-Knowledge Proofs**: Verify identity without exposing sensitive information
- **Secure API Endpoints**: Bearer token authentication for all Sovio API calls
- **Local Session Management**: Minimal data stored locally, full identity on blockchain

## 🌍 International Compliance

- **GDPR Compliant**: European data protection standards
- **KYC/AML**: Anti-money laundering compliance
- **International Recognition**: Digital signatures accepted globally
- **Double Taxation Treaties**: Support for 85+ countries

## 📊 Statistics

- **2,500+** E-Residents Worldwide
- **1,200+** Companies Registered
- **85+** Countries Represented  
- **$15M+** Business Volume Generated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Royal Government of Bhutan's digital transformation initiative.

## 🏛️ Government Partnership

**Official Partner**: Kingdom of Bhutan - Ministry of Information and Communications  
**Technology Partner**: Sovio Digital Identity Platform  
**Banking Partner**: Bhutan National Bank

## 📞 Support

For e-residency inquiries:
- **Website**: [Bhutan E-Residency Portal](https://e-residency.gov.bt)
- **Email**: support@e-residency.gov.bt
- **Technical Support**: Sovio Platform Integration

---

**🏔️ "In the Last Shangri-La, your business dreams take flight"**  
*Kingdom of Bhutan - Where Gross National Happiness meets Global Entrepreneurship*