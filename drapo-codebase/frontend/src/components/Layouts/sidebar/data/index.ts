import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "eResidency",
        url: "/dashboard/eresidency",
        icon: Icons.User,
        items: [
          {
            title: "Digital Certificate",
            url: "/dashboard/eresidency/certificate",
          },
          {
            title: "Digital Identity",
            url: "/dashboard/eresidency/identity",
          },
          {
            title: "NFT Certificates",
            url: "/dashboard/eresidency/nft",
          },
          {
            title: "Tax Services",
            url: "/dashboard/eresidency/tax",
          },
        ],
      },
      {
        title: "Digital Identity",
        url: "/dashboard/identity",
        icon: Icons.User,
        items: [
          {
            title: "My DID",
            url: "/dashboard/identity/did",
          },
          {
            title: "Digital Passport",
            url: "/dashboard/identity/passport",
          },
          {
            title: "Verifiable Credentials",
            url: "/dashboard/identity/credentials",
          },
          {
            title: "Biometric Auth",
            url: "/dashboard/identity/biometric",
          },
          {
            title: "KYC Verification",
            url: "/dashboard/identity/kyc",
          },
        ],
      },
      {
        title: "Reputation & Trust",
        url: "/dashboard/reputation",
        icon: Icons.User,
        items: [
          {
            title: "My Reputation Score",
            url: "/dashboard/reputation/score",
          },
          {
            title: "Proof of Personhood",
            url: "/dashboard/reputation/pop",
          },
          {
            title: "Attestations",
            url: "/dashboard/reputation/attestations",
          },
          {
            title: "Community Contributions",
            url: "/dashboard/reputation/contributions",
          },
        ],
      },
      {
        title: "Documents & Certificates",
        url: "/dashboard/documents",
        icon: Icons.User,
        items: [
          {
            title: "Request Documents",
            url: "/dashboard/documents/request",
          },
          {
            title: "Apply by Category",
            url: "/dashboard/documents/apply",
          },
          {
            title: "eSign Documents",
            url: "/dashboard/documents/esign",
          },
          {
            title: "My Issued Documents",
            url: "/dashboard/documents/issued",
          },
        ],
      },
      {
        title: "My Wallet",
        url: "/dashboard/wallet",
        icon: Icons.PieChart,
        items: [
          {
            title: "Send & Receive",
            url: "/dashboard/wallet/transfer",
          },
          {
            title: "Transaction History",
            url: "/dashboard/wallet/transactions",
          },
          {
            title: "Currency Exchange",
            url: "/dashboard/wallet/exchange",
          },
        ],
      },
      {
        title: "Business Services",
        url: "/dashboard/business",
        icon: Icons.User,
        items: [
          {
            title: "My Business",
            url: "/dashboard/business",
          },
          {
            title: "Register Company",
            url: "/dashboard/business/register",
          },
          {
            title: "Tax Services",
            url: "/dashboard/business/tax",
          },
          {
            title: "Business Documents",
            url: "/dashboard/business/documents",
          },
        ],
      },
      {
        title: "AI Assistant",
        url: "/dashboard/assistant",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Ask Questions",
            url: "/dashboard/assistant/chat",
          },
          {
            title: "Legal Help",
            url: "/dashboard/assistant/legal",
          },
          {
            title: "Law FAQ",
            url: "/dashboard/assistant/bhutanese-law-faq",
          },
          {
            title: "Dzongkha Support",
            url: "/dashboard/assistant/dzongkha",
          },
        ],
      },
    ],
  },
  {
    label: "ADMIN PANEL",
    items: [
      {
        title: "System Overview",
        url: "/admin/overview",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Currency Management",
        url: "/admin/currency",
        icon: Icons.PieChart,
        items: [
          {
            title: "Reserve Dashboard",
            url: "/admin/currency/reserves",
          },
          {
            title: "Stablecoin Control",
            url: "/admin/currency/stablecoin",
          },
          {
            title: "Treasury Management",
            url: "/admin/currency/treasury",
          },
          {
            title: "Peg Monitoring",
            url: "/admin/currency/peg",
          },
        ],
      },
      {
        title: "User Management",
        url: "/admin/users",
        icon: Icons.User,
        items: [
          {
            title: "All Users",
            url: "/admin/users/list",
          },
          {
            title: "DID Verification",
            url: "/admin/users/did",
          },
          {
            title: "KYC Approvals",
            url: "/admin/users/kyc",
          },
          {
            title: "Reputation Management",
            url: "/admin/users/reputation",
          },
          {
            title: "User Analytics",
            url: "/admin/users/analytics",
          },
        ],
      },
      {
        title: "Smart Contracts",
        url: "/admin/contracts",
        icon: Icons.User,
        items: [
          {
            title: "Contract Dashboard",
            url: "/admin/contracts/dashboard",
          },
          {
            title: "Attestation Issuers",
            url: "/admin/contracts/issuers",
          },
          {
            title: "Trust Scores",
            url: "/admin/contracts/trust",
          },
          {
            title: "Contract Analytics",
            url: "/admin/contracts/analytics",
          },
        ],
      },
      {
        title: "Business Admin",
        url: "/admin/business",
        icon: Icons.User,
        items: [
          {
            title: "Company Registrations",
            url: "/admin/business/registrations",
          },
          {
            title: "Tax Management",
            url: "/admin/business/tax",
          },
          {
            title: "Document Verification",
            url: "/admin/business/documents",
          },
        ],
      },
      {
        title: "AI Management",
        url: "/admin/ai",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Model Performance",
            url: "/admin/ai/performance",
          },
          {
            title: "Training Data",
            url: "/admin/ai/training",
          },
          {
            title: "Query Analytics",
            url: "/admin/ai/analytics",
          },
        ],
      },
      {
        title: "System Settings",
        url: "/admin/settings",
        icon: Icons.PieChart,
        items: [
          {
            title: "Security Settings",
            url: "/admin/settings/security",
          },
          {
            title: "API Management",
            url: "/admin/settings/api",
          },
          {
            title: "Audit Logs",
            url: "/admin/settings/audit",
          },
        ],
      },
    ],
  },
];
