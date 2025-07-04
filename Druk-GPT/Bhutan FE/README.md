# DrukGPT Console

A sophisticated Next.js 14 application providing a comprehensive AI console for the Kingdom of Bhutan's sovereign AI initiative. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🏛️ Landing Page
- Animated Thunder Dragon watermark
- Interactive feature showcase
- Bhutan-inspired design with crimson and gold color scheme
- Responsive hero section with compelling CTAs

### 💬 Console Interface
- Real-time chat with DrukGPT models
- Language toggle (English/Dzongkha)
- Model selection dropdown
- Sources citation with confidence scoring
- File upload and management
- Comprehensive audit logging

### 📊 Data Commons
- Blockchain-verified dataset management
- Advanced filtering and search capabilities
- File metadata and licensing information
- Upload tracking and verification status
- Dataset quality metrics

### ⚙️ Admin Dashboard
- Fine-tuning job management
- Model registry and deployment tracking
- Performance metrics and system health
- Protected routes with authentication
- Real-time job progress monitoring

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Bhutan color palette
- **Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Theme**: Dark mode support with next-themes
- **Fonts**: Inter font family

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd drukgpt-console
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values:
- Supabase credentials
- Polygon RPC URL
- API endpoints
- Authentication secrets

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
drukgpt-console/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard
│   ├── console/           # Main chat interface
│   ├── data-commons/      # Dataset management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   ├── theme-provider.tsx
│   └── thunder-dragon.tsx # Animated logo
├── lib/                  # Utility functions
│   ├── api.ts           # API client and hooks
│   ├── mock-data.ts     # Development data
│   └── utils.ts         # Helper functions
├── types/               # TypeScript definitions
│   └── index.ts        # Core type definitions
└── public/             # Static assets
```

## Environment Variables

### Required Configuration

```bash
# Supabase - Database and Authentication
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Blockchain - Polygon Network
POLYGON_RPC_URL=https://polygon-rpc.com

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DRUKGPT_API_KEY=your_drukgpt_api_key
```

## API Integration

The application includes a comprehensive API client with typed hooks:

### Chat API
```typescript
// Send a message to DrukGPT
const response = await apiClient.postChat(message, {
  model: 'druk-gpt-base',
  language: 'dz'
});

// Get chat history
const messages = await apiClient.getChatMessages(sessionId);
```

### Dataset Management
```typescript
// Upload a new dataset
const dataset = await apiClient.uploadFile(file, metadata);

// Get filtered datasets
const datasets = await apiClient.getDatasets({
  type: 'text',
  status: 'verified'
});
```

### Fine-tuning Jobs
```typescript
// Create a new fine-tuning job
const job = await apiClient.createJob({
  name: 'Literature Fine-tuning',
  type: 'fine-tuning',
  model: 'druk-gpt-base',
  dataset: 'literature-corpus'
});
```

## Design System

### Color Palette
- **Crimson**: `#a60d0d` (Bhutan's national color)
- **Gold**: `#d9b300` (Complementary accent)
- **Neutral tones**: Gray scale for backgrounds and text

### Typography
- **Primary Font**: Inter
- **Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 150% for body text, 120% for headings

### Components
All UI components are built with shadcn/ui and customized for the Bhutanese design aesthetic.

## Backend Integration Points

The application is designed for easy backend integration. Key integration points:

### TODO: API Endpoints
1. **Chat API** (`/api/chat`)
   - POST: Send messages to DrukGPT
   - GET: Retrieve chat history

2. **Upload API** (`/api/files/upload`)
   - POST: Upload datasets and documents
   - File validation and processing

3. **Datasets API** (`/api/datasets`)
   - GET: List and filter datasets
   - DELETE: Remove datasets

4. **Jobs API** (`/api/jobs`)
   - POST: Create fine-tuning jobs
   - GET: List jobs with status
   - POST: Cancel running jobs

5. **Audit API** (`/api/audit`)
   - GET: Retrieve audit logs
   - Filtering and pagination support

### TODO: Authentication
- Implement user authentication with Supabase Auth
- Role-based access control (admin, researcher, user)
- Protected route middleware

### TODO: Database Schema
- Chat messages and sessions
- User profiles and permissions
- Dataset metadata and blockchain records
- Fine-tuning job configurations and metrics
- Audit log entries

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Ensure all production environment variables are configured:
- Supabase production credentials
- Polygon mainnet RPC URL
- Production API endpoints
- Authentication secrets

### Static Export
The application is configured for static export:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Responsive design for all components
- Accessibility best practices
- Performance optimization

## License

This project is proprietary to the Kingdom of Bhutan's DrukGPT initiative.

## Support

For technical support or questions about integration:
- Email: support@drukgpt.bt
- Documentation: [Internal Wiki]
- Issues: [Internal Issue Tracker]