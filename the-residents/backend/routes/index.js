// Import routes
import authRoutes from './auth.js';
import usersRoutes from './users.js';
import kycRoutes from './kyc.js';
import residencyRoutes from './residency.js';
import vcRoutes from './vc.js';
import companyRoutes from './company.js';
import publicRoutes from './public.js';
import {protect} from '../middleware/auth.js';
import adminRoutes from './admin.js';
// import userRoutes from './users.js';
import applicationRoutes from './applicationRoutes.js';
import documentRoutes from './documents.js';

const initRoutes = (app) => {
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', usersRoutes);
    
    // KYC
    app.use('/api/kyc', kycRoutes);
    
    // Residency/NFT
    app.use('/api/residency', residencyRoutes);
    
    // Verifiable Credentials
    app.use('/api/vc', vcRoutes);
    
    // Company/Entity Registration
    app.use('/api/company', companyRoutes);
    
    // Public Directory
    app.use('/api/public', publicRoutes);
    
    // Admin routes
    app.use('/api/admin', adminRoutes);
    
    // app.use('/api/users', userRoutes);
    app.use('/api/applications', applicationRoutes);
    app.use('/api/documents', documentRoutes);
    
    // NFT Metadata endpoint
    app.get('/api/metadata/:eResidencyId', async (req, res) => {
        try {
            const { eResidencyId } = req.params;
            const backendBaseUrl = `${req.protocol}://${req.get('host')}`;
            
            // Find user by eResidencyId (preferred)
            let user = await User.findOne({ eResidencyId });
            if (!user) {
                // Fallback: look up via Residency collection
                const Residency = (await import('../models/Residency.js')).default;
                const residencyDoc = await Residency.findOne({ 'metadata.eResidencyId': eResidencyId }).populate('user');
                if (residencyDoc) {
                    user = residencyDoc.user;
                }
            }

            if (!user) {
                return res.status(404).json({ error: 'eResidency ID not found' });
            }

            const metadata = {
                name: `eResidency NFT - ${user.fullName || 'Unknown'}`,
                description: `Official eResidency NFT for ${user.fullName || 'Unknown'} with ID: ${eResidencyId}`,
                image: `${backendBaseUrl}/api/image/${eResidencyId}`,
                external_url: `${backendBaseUrl.replace(':8000', ':3000')}/verify/${eResidencyId}`,
                attributes: [
                    {
                        trait_type: "eResidency ID",
                        value: eResidencyId
                    },
                    {
                        trait_type: "Citizenship Country",
                        value: user.nationality || "Unknown"
                    },
                    {
                        trait_type: "Issue Date",
                        value: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "Unknown"
                    },
                    {
                        trait_type: "Type",
                        value: "eResidency NFT"
                    }
                ]
            };

            res.json(metadata);
        } catch (error) {
            console.error('Metadata fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Simple image placeholder endpoint
    app.get('/api/image/:eResidencyId', (req, res) => {
        const { eResidencyId } = req.params;
        
        // Create a simple SVG image
        const svg = `
            <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="400" fill="#4F46E5"/>
                <text x="200" y="150" font-family="Arial" font-size="24" fill="white" text-anchor="middle">eResidency NFT</text>
                <text x="200" y="200" font-family="Arial" font-size="16" fill="white" text-anchor="middle">ID: ${eResidencyId}</text>
                <text x="200" y="250" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Digital Identity</text>
                <text x="200" y="300" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Soulbound Token</text>
            </svg>
        `;
        
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
    });

    // Root route
    app.get("/", (req, res) => {
        res.json({
            message: "Welcome to Fanbase AI Developers Portal"
        });
    });

};

export default initRoutes;
