import { PortfolioThemeData, CustomThemeConfig } from '../utils/themeManager';
export type { PortfolioThemeData, CustomThemeConfig };

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
}

export interface ExpertiseItem {
  id: string;
  code: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  deliverables: string[];
  engagementModels?: string[];
  keyCapabilities: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  location: string;
  modules: string[];
  category: 'full-cycle' | 'operational-support' | 'it-systems';
  categoryLabel: string;
  engagementType: string;
  challenge: string;
  solution: string;
  outcome: string;
  metrics?: { label: string; value: string }[];
  featured?: boolean;
}

export interface TimelineItemData {
  year?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  role: string;
  company: string;
  description: string;
  keyHighlights?: string[];
}

export interface SkillItem {
  name: string;
  percentage: number;
  category: 'Core SAP' | 'Methodology & Integration' | 'IT Systems';
  details?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  badgeCode: string;
  issuedDate?: string;
  status: string;
  description: string;
  verificationPlaceholder: string;
  credentialIdPlaceholder: string;
}

export interface TestimonialItem {
  id: string;
  role: string;
  industry: string;
  location: string;
  quote: string;
}

export interface SocialLinkItem {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  company?: string;
  module: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  emailDeliveryStatus?: 'sent' | 'pending' | 'fallback_mailto' | 'failed';
  emailError?: string;
}

export interface EmailSettings {
  provider: 'formsubmit' | 'web3forms' | 'custom_webhook';
  recipientEmail?: string;
  web3FormsAccessKey?: string;
  webhookUrl?: string;
}

export interface EngagementStats {
  views: number;
  uniqueVisitors: number;
  likes: number;
  shares: number;
  lastUpdated?: string;
}

export const defaultEngagementStats: EngagementStats = {
  views: 1420,
  uniqueVisitors: 560,
  likes: 218,
  shares: 47,
};

export interface PortfolioData {
  consultant: {
    name: string;
    brandInitials: string;
    brandText: string;
    eyebrow: string;
    title: string;
    tagline: string;
    heroSummary: string;
    status: string;
    yearsOfExperience: string;
    careerStartDate?: string;
    location: string;
    geographicRegions?: string;
    geographicSupport?: string;
    availability: string;
    email: string;
    phone: string;
    linkedin: string;
    pullQuote: string;
    aboutProfile: string[];
    avatarUrl?: string;
  };
  statistics: StatItem[];
  expertise: ExpertiseItem[];
  caseStudies: CaseStudy[];
  timeline: TimelineItemData[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  testimonials: TestimonialItem[];
  industriesMarquee: string[];
  socialLinks?: SocialLinkItem[];
  contactModules?: string[];
  theme?: PortfolioThemeData;
  adminUsers?: AdminUser[];
  emailSettings?: EmailSettings;
  analytics?: EngagementStats;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role?: string;
  createdAt?: string;
}

export const defaultAdminUsers: AdminUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    password: '12345678',
    role: 'Lead Administrator',
    createdAt: '2025-01-01',
  },
];

export const defaultEmailSettings: EmailSettings = {
  provider: 'formsubmit',
};

export const defaultThemeData: PortfolioThemeData = {
  activeThemeId: 'navy-gold',
  customTheme: {
    bgPrimary: '#0A0E1A',
    accentPrimary: '#2F6FED',
    accentSecondary: '#D9A94E',
  },
};

export const defaultContactModules: string[] = [
  'PP (Production Planning)',
  'QM (Quality Management)',
  'PM (Plant Maintenance)',
  'Full PP / QM / PM Program',
  'IT Systems & M365 Administration',
  'Other / Not Sure Yet',
];

export const portfolioData: PortfolioData = {
  consultant: {
    name: "Syed M. Ahsan Shah",
    brandInitials: "SS",
    brandText: "Syed M. Ahsan Shah",
    eyebrow: "SAP CERTIFIED CONSULTANT",
    title: "Senior SAP PP / QM / PM Functional Consultant & IT Systems Lead",
    tagline: "Turning complex manufacturing operations into <strong>streamlined, SAP-driven processes</strong> — across {{TOTAL_YEARS_PLUS}} years, 3 full-cycle implementations, and multi-plant environments in Pakistan &amp; Saudi Arabia.",
    heroSummary: "Turning complex manufacturing operations into <strong>streamlined, SAP-driven processes</strong> — across {{TOTAL_YEARS_PLUS}} years, 3 full-cycle implementations, and multi-plant environments in Pakistan &amp; Saudi Arabia.",
    status: "Available for Engagements",
    yearsOfExperience: "{{TOTAL_YEARS_PLUS}} Years",
    careerStartDate: "2013-01",
    location: "Pakistan · Saudi Arabia · UAE",
    geographicRegions: "Pakistan · Saudi Arabia · UAE",
    geographicSupport: "Remote & On-Site Support across All Regions",
    availability: "Available for remote & on-site engagements",
    email: "smahsan52@hotmail.com",
    phone: "+92 300 2711390",
    linkedin: "https://linkedin.com/in/smahsan52",
    pullQuote: "Turning complex manufacturing operations into <strong>streamlined, SAP-driven processes</strong> across {{TOTAL_YEARS_PLUS}} years.",
    aboutProfile: [
      "I'm a SAP Certified Senior Functional Consultant with <strong>{{TOTAL_DURATION_SPELLED}}</strong> of overall experience across manufacturing operations and consulting engagements. I specialize in SAP PP alongside deep hands-on expertise in QM and PM, allowing me to support production, quality, and maintenance workflows as one connected system rather than separate silos.",
      "I've delivered end-to-end SAP S/4HANA and ECC implementations for PP, QM, and PM across multi-plant facilities in Pakistan and Saudi Arabia. My experience covers the entire project lifecycle, from initial blueprinting and configuration to UAT, data migration, cutover, and post-go-live stabilization.",
      "That work improved production planning efficiency by 15–20% and supported 500+ users, while strengthening configuration expertise across MRP scenarios (MTS/MTO), BOM, Routing, Production Versions, QM inspection plans and usage decisions, and PM functional locations, equipment, and preventive maintenance planning.",
      "Beyond SAP configuration, I manage core IT systems and user support, including Microsoft 365 administration, structured end-user training, infrastructure troubleshooting, and Windows environment maintenance."
    ],
    avatarUrl: ""
  },
  statistics: [
    {
      value: "12+",
      label: "Years Experience",
      sublabel: "Plant operations & consulting"
    },
    {
      value: "3+",
      label: "Full-Cycle Implementations",
      sublabel: "S/4HANA & ECC Go-Lives"
    },
    {
      value: "500+",
      label: "Users Supported",
      sublabel: "Across Pakistan & Saudi Arabia"
    },
    {
      value: "15–20%",
      label: "Efficiency Gained",
      sublabel: "In production planning adherence"
    }
  ],
  expertise: [
    {
      id: "pp",
      code: "SAP PP",
      title: "SAP PP Implementation & Support",
      shortDesc: "Production planning & execution design that keeps multi-plant manufacturing schedules accurate and adaptable.",
      fullDesc: "Full-cycle configuration of production planning from order creation through shop-floor execution, aligning supply and capacity with plant realities.",
      iconName: "Factory",
      deliverables: [
        "Production Orders & Process Orders configuration",
        "Material Requirements Planning (MRP for MTS & MTO)",
        "Bills of Materials (BOM) & Routing Master Data",
        "Production Versions & Work Center Capacity Planning",
        "Planning Support & Day-to-Day Troubleshooting",
        "Shop-Floor Schedule Adherence Optimization"
      ],
      keyCapabilities: [
        "MRP (MTS / MTO Scenarios)",
        "BOM & Routing Architecture",
        "Production Versions Setup",
        "Order Execution & Confirmation",
        "Capacity Requirements Planning",
        "Integration with MM, SD & CO"
      ],
      engagementModels: [
        "Project-Based Consulting",
        "Remote Operational Support",
        "Full-Cycle Implementation Lead"
      ]
    },
    {
      id: "qm",
      code: "SAP QM",
      title: "SAP QM Configuration & Quality Gates",
      shortDesc: "Quality inspection, notification, and certificate workflows that hold product standards to the line.",
      fullDesc: "Quality gates built into the production process itself, ensuring compliance, traceable batch decisions, and standardized inspection criteria.",
      iconName: "CheckCircle2",
      deliverables: [
        "Inspection Plans & Sampling Procedures",
        "Quality Notifications & Defect Recording",
        "Inspection Lots & Automated Creation Triggers",
        "Usage Decisions & Stock Posting Workflows",
        "Incoming, In-Process, and Final Inspection Gates",
        "Certificate of Analysis & Quality Audit Trails"
      ],
      keyCapabilities: [
        "Inspection Plans & Characteristics",
        "Quality Notifications Management",
        "Inspection Lots Workflow",
        "Usage Decisions (UD) Automation",
        "In-Process Quality Controls",
        "Batch Management Integration"
      ],
      engagementModels: [
        "Quality Process Standardization",
        "QM Module Implementation",
        "Cross-Module Integration with PP & MM"
      ]
    },
    {
      id: "pm",
      code: "SAP PM",
      title: "SAP PM Configuration & Maintenance Planning",
      shortDesc: "Preventive & breakdown maintenance processes that cut downtime and extend asset life.",
      fullDesc: "Structured plant maintenance processes that catch machine issues before they become catastrophic downtime, uniting operations and engineering teams.",
      iconName: "Wrench",
      deliverables: [
        "Functional Locations & Technical Structure",
        "Equipment Master Data & Bill of Materials",
        "Preventive Maintenance Plans & Scheduling",
        "Maintenance Orders (Preventive & Breakdown)",
        "Maintenance Notifications & Downtime Logs",
        "Maintenance History & Spares Consumption Tracking"
      ],
      keyCapabilities: [
        "Functional Locations & Hierarchies",
        "Equipment Master Lifecycle",
        "Preventive Maintenance Strategies",
        "Breakdown & Corrective Orders",
        "Maintenance Notifications",
        "PM/MM Spare Parts Linking"
      ],
      engagementModels: [
        "Plant Maintenance System Overhaul",
        "Downtime Reduction Programs",
        "Standardized PM Rollout"
      ]
    },
    {
      id: "it",
      code: "IT Systems & M365",
      title: "IT Systems & Microsoft 365 Administration",
      shortDesc: "Enterprise IT administration and Microsoft 365 governance that keeps the wider business running.",
      fullDesc: "Reliable day-to-day enterprise IT operations, security posture, and end-user support empowering 500+ active business users.",
      iconName: "ShieldCheck",
      deliverables: [
        "Microsoft 365 User & Mailbox Management",
        "Licensing Optimization & Access Administration",
        "Security Configuration & Compliance Policies",
        "End-User Training & Knowledge Transfer",
        "Hardware / Software Troubleshooting",
        "Windows Server & Desktop Environment Management"
      ],
      keyCapabilities: [
        "Microsoft 365 Administration",
        "User Access & Role-Based Security",
        "End-User Helpdesk & Training",
        "Windows Infrastructure Management",
        "Hardware & Network Troubleshooting",
        "IT Governance & SLA Adherence"
      ],
      engagementModels: [
        "IT Systems Leadership",
        "Enterprise M365 Governance",
        "User Support Architecture"
      ]
    }
  ],
  caseStudies: [
    {
      id: "dalda-foods",
      title: "Full-Cycle SAP PP/QM/PM Implementation & Ongoing Operational Ownership",
      company: "Dalda Foods Limited",
      location: "Karachi, Pakistan",
      modules: ["PP", "QM", "PM"],
      category: "full-cycle",
      categoryLabel: "Full-Cycle Implementation",
      engagementType: "In-House SAP Consultant & Operations Lead",
      challenge: "Large-scale FMCG edible oil and foods manufacturer required standardized production planning, rigorous QA inspection gates, and preventive maintenance across high-throughput processing lines.",
      solution: "Led end-to-end blueprinting, master data structuring (BOM, Routing, Production Versions), QM inspection lot triggers, PM functional location trees, UAT, and cutover. Provided continuous hands-on ownership from go-live onward.",
      outcome: "Continuous hands-on ownership from go-live onward, improving shop-floor schedule adherence and giving planning teams reliable day-to-day visibility into production status.",
      metrics: [
        { label: "Planning Adherence", value: "High Precision" },
        { label: "Module Scope", value: "PP / QM / PM" },
        { label: "Plant Coverage", value: "Multi-Unit FMCG" }
      ],
      featured: true
    },
    {
      id: "al-jouf-cement",
      title: "Multi-Plant SAP PP/QM/PM Implementation & Operations Support",
      company: "Al Jouf Cement Co.",
      location: "Turaif, Saudi Arabia",
      modules: ["PP", "QM", "PM"],
      category: "full-cycle",
      categoryLabel: "Full-Cycle Implementation",
      engagementType: "SAP Functional Consultant",
      challenge: "Heavy cement manufacturing operations required harmonized maintenance strategies, production schedules, and chemical quality parameters across multi-kiln facilities in northern Saudi Arabia.",
      solution: "Implemented unified PP production tracking, QM testing protocols for raw mix and clinker, and PM asset hierarchies for heavy crushers, kilns, and mills.",
      outcome: "Standardized planning and maintenance processes across plants, giving operations teams a consistent single source of truth for scheduling and equipment upkeep.",
      metrics: [
        { label: "Process Baseline", value: "100% Unified" },
        { label: "Maintenance Scope", value: "Heavy Plant PM" },
        { label: "Region", value: "Saudi Arabia" }
      ],
      featured: true
    },
    {
      id: "al-razzaq-fibres",
      title: "End-to-End SAP PP/QM/PM Implementation",
      company: "Al-Razzaq Fibres (Pvt) Ltd (SAYA)",
      location: "Pakistan",
      modules: ["PP", "QM", "PM"],
      category: "full-cycle",
      categoryLabel: "Full-Cycle Implementation",
      engagementType: "SAP Implementation Consultant",
      challenge: "Complex textile and fibre processing requiring tight integration between fiber spinning, quality testing batches, and machinery maintenance schedules.",
      solution: "Engineered comprehensive MRP scenarios, production order workflows, defect logging in QM, and structured preventive maintenance orders.",
      outcome: "Delivered successful full-cycle go-live with streamlined material movement, standardized quality checks, and real-time production visibility.",
      metrics: [
        { label: "Cycle Status", value: "Go-Live Success" },
        { label: "Industry", value: "Textile & Fibres" }
      ],
      featured: false
    },
    {
      id: "mowah-co",
      title: "SAP PP/PM Operational Support & Process Stabilization",
      company: "Mowah Co.",
      location: "Saudi Arabia",
      modules: ["PP", "PM"],
      category: "operational-support",
      categoryLabel: "Operational Support",
      engagementType: "Senior Functional Support Consultant",
      challenge: "Water utility and infrastructure management required continuous maintenance order stabilization and asset tracking.",
      solution: "Provided expert troubleshooting, master data cleaning, PM notification resolution, and operational guidance for maintenance engineers.",
      outcome: "Accelerated ticket resolution times and improved consistency in plant maintenance recording.",
      metrics: [
        { label: "Support Type", value: "Continuous Ops" },
        { label: "Core Module", value: "SAP PM / PP" }
      ],
      featured: false
    },
    {
      id: "ahmed-abed-trading",
      title: "SAP PP/QM Operational Support & Workflow Enhancement",
      company: "Ahmed A. Abed Trading Co. Ltd.",
      location: "Saudi Arabia",
      modules: ["PP", "QM"],
      category: "operational-support",
      categoryLabel: "Operational Support",
      engagementType: "Functional Support Consultant",
      challenge: "Commercial processing and trading operations needed streamlined order execution and dependable quality batch releases.",
      solution: "Optimized usage decision parameters, production version setups, and resolved daily operational bottlenecks.",
      outcome: "Achieved seamless batch releases and reliable production order confirmations.",
      metrics: [
        { label: "Scope", value: "PP & QM Support" },
        { label: "Market", value: "KSA Trading" }
      ],
      featured: false
    },
    {
      id: "saudi-paper-group",
      title: "SAP PP/PM Industrial Operations Support",
      company: "Saudi Paper Group",
      location: "Saudi Arabia",
      modules: ["PP", "PM"],
      category: "operational-support",
      categoryLabel: "Operational Support",
      engagementType: "Functional Support Consultant",
      challenge: "High-volume paper manufacturing required uninterrupted production scheduling and heavy machinery maintenance order management.",
      solution: "Delivered prompt issue resolution, MRP run audits, and equipment master enhancements.",
      outcome: "Maintained robust operational continuity across paper production lines and equipment maintenance cycles.",
      metrics: [
        { label: "Sector", value: "Paper Manufacturing" },
        { label: "Focus", value: "PP / PM Support" }
      ],
      featured: false
    },
    {
      id: "jazeera-paint",
      title: "SAP PP/QM Chemical Formulation & Batch Support",
      company: "Jazeera Paint",
      location: "Saudi Arabia",
      modules: ["PP", "QM"],
      category: "operational-support",
      categoryLabel: "Operational Support",
      engagementType: "Functional Support Consultant",
      challenge: "Formulation and chemical coatings manufacturing requiring precise recipe handling and strict quality inspection lots.",
      solution: "Supported production order adjustments, BOM updates, and QM characteristic checks for paint batches.",
      outcome: "Maintained strict chemical batch quality and prompt resolution of production order variances.",
      metrics: [
        { label: "Domain", value: "Paints & Chemicals" },
        { label: "Focus", value: "PP / QM Support" }
      ],
      featured: false
    },
    {
      id: "qbs-co-it",
      title: "Microsoft 365 Administration & IT Infrastructure Support",
      company: "QBS CO (Pvt) Ltd",
      location: "Pakistan",
      modules: ["IT", "M365"],
      category: "it-systems",
      categoryLabel: "IT Systems & Support",
      engagementType: "IT Lead & Systems Administrator",
      challenge: "Supporting 50+ enterprise users with secure cloud collaboration, access governance, hardware management, and dependable daily technical support.",
      solution: "Administered Microsoft 365 tenant, user lifecycle, security policies, licensing, and provided end-to-end hardware/software troubleshooting.",
      outcome: "Kept 50+ end users productive with dependable IT support and a well-governed Microsoft 365 environment.",
      metrics: [
        { label: "Users Supported", value: "50+ Active Users" },
        { label: "Platform", value: "Microsoft 365" },
        { label: "Uptime & SLA", value: "Reliable Ops" }
      ],
      featured: true
    }
  ],
  timeline: [
    {
      year: "Jun 2022 - Present",
      startDate: "2022-06",
      endDate: "",
      isCurrent: true,
      role: "SAP PP, QM, PM Consultant & IT Lead",
      company: "QBS CO (Pvt) Ltd",
      description: "Full-cycle SAP implementations and operational support across multi-plant environments in Pakistan and Saudi Arabia, alongside IT systems and Microsoft 365 administration.",
      keyHighlights: [
        "Leading PP, QM, and PM consulting engagements across multi-plant manufacturing clients",
        "Managing enterprise IT infrastructure, Microsoft 365 tenant, and end-user support",
        "Driving blueprinting, data migration, user acceptance testing (UAT), and post-go-live stabilization"
      ]
    },
    {
      year: "Jan 2020 - May 2022",
      startDate: "2020-01",
      endDate: "2022-05",
      isCurrent: false,
      role: "Senior Executive Officer",
      company: "Feroze1888 Mills",
      description: "SAP Printing Module leadership, configuration and process ownership in a high-volume manufacturing environment.",
      keyHighlights: [
        "Printing module process ownership and SAP configuration",
        "Shop-floor integration between technical printing lines and planning matrices"
      ]
    },
    {
      year: "Mar 2018 - Dec 2019",
      startDate: "2018-03",
      endDate: "2019-12",
      isCurrent: false,
      role: "Planning Executive",
      company: "United Towel Exporters",
      description: "End-to-end ownership of SAP PP and MM, connecting planning and materials processes.",
      keyHighlights: [
        "Bridged production planning and materials management workflows",
        "Optimized MRP execution and supply-demand scheduling"
      ]
    },
    {
      year: "Jan 2017 - Feb 2018",
      startDate: "2017-01",
      endDate: "2018-02",
      isCurrent: false,
      role: "Senior SAP Executive & Planning Executive",
      company: "International Textile Limited",
      description: "Dual planning and SAP role with deeper production planning and system ownership responsibilities.",
      keyHighlights: [
        "Managed daily manufacturing planning on SAP ECC",
        "Enhanced production order release workflows and capacity alignment"
      ]
    },
    {
      year: "Jun 2014 - Dec 2016",
      startDate: "2014-06",
      endDate: "2016-12",
      isCurrent: false,
      role: "Data Entry Operator",
      company: "Midas Safety",
      description: "First hands-on SAP exposure, including Process Orders and Production Versions.",
      keyHighlights: [
        "Shop floor master data validation and process order transactions",
        "Developed deep foundational understanding of SAP screens and transaction codes"
      ]
    },
    {
      year: "Jan 2013 - May 2014",
      startDate: "2013-01",
      endDate: "2014-05",
      isCurrent: false,
      role: "Lab Assistant",
      company: "Clariant Chemical Pakistan",
      description: "Started career on the operational side of manufacturing, gaining hands-on exposure to plant processes and quality control.",
      keyHighlights: [
        "Direct chemical testing and quality control inspections on the shop floor",
        "Built first-hand appreciation of plant realities that inform consultant-level design"
      ]
    }
  ],
  skills: [
    {
      name: "SAP PP Configuration",
      percentage: 95,
      category: "Core SAP",
      details: "Production orders, MRP, capacity planning, routing & work centers"
    },
    {
      name: "MRP / BOM / Routing",
      percentage: 93,
      category: "Core SAP",
      details: "MTS/MTO strategies, complex multi-level BOMs, routing parameters"
    },
    {
      name: "Client-Facing Workshops",
      percentage: 90,
      category: "Methodology & Integration",
      details: "Business blueprinting, UAT facilitation, stakeholder consensus, change management"
    },
    {
      name: "SAP QM & PM Integration",
      percentage: 88,
      category: "Methodology & Integration",
      details: "Inspection lots, usage decisions, PM functional locations, equipment maintenance"
    },
    {
      name: "SAP Activate Methodology",
      percentage: 85,
      category: "Methodology & Integration",
      details: "Prepare, Explore, Realize, Deploy, Run phases on S/4HANA & ECC"
    },
    {
      name: "Microsoft 365 Administration",
      percentage: 82,
      category: "IT Systems",
      details: "User lifecycle, license allocation, security governance, end-user IT support"
    }
  ],
  certifications: [
    {
      id: "sap-s4hana-pp",
      name: "SAP Certified Associate: SAP S/4HANA Cloud Private Edition, Production Planning and Manufacturing",
      issuer: "SAP",
      badgeCode: "S/4HANA PP",
      status: "Verified & Active",
      description: "Validates comprehensive knowledge and core functional configuration skills for SAP S/4HANA Production Planning and Manufacturing environments.",
      verificationPlaceholder: "Available upon request / verified credential record",
      credentialIdPlaceholder: "Official SAP Certification Record"
    }
  ],
  testimonials: [
    {
      id: "plant-director",
      role: "Plant Director",
      industry: "FMCG Manufacturing",
      location: "Pakistan",
      quote: "Ahsan brought order to a production planning process that had outgrown itself. The S/4HANA rollout landed on time and the plant floor trusts the system now."
    },
    {
      id: "ops-manager",
      role: "Operations Manager",
      industry: "Cement Manufacturing",
      location: "Saudi Arabia",
      quote: "What stood out was how he translated maintenance workflows into something our engineers actually wanted to use. Downtime reporting has never been this clear."
    },
    {
      id: "it-manager",
      role: "IT Manager",
      industry: "Multi-Plant FMCG Group",
      location: "Karachi, Pakistan",
      quote: "A rare consultant who understands both the SAP side and the IT infrastructure around it. Our 500+ users had a genuinely smoother transition because of that."
    }
  ],
  industriesMarquee: [
    "Dalda Foods Limited",
    "Al Jouf Cement Co.",
    "FMCG Manufacturing",
    "Cement Production",
    "Steel & Metals",
    "Textile Manufacturing",
    "Pharmaceutical Plants",
    "Chemical Processing",
    "Water & Infrastructure Utilities",
    "Paper & Packaging Industries"
  ],
  socialLinks: [
    {
      id: "social-1",
      name: "LinkedIn",
      icon: "linkedin",
      url: "https://linkedin.com/in/smahsan52"
    },
    {
      id: "social-2",
      name: "WhatsApp",
      icon: "whatsapp",
      url: "+92 300 2711390"
    },
    {
      id: "social-3",
      name: "Email",
      icon: "email",
      url: "smahsan52@hotmail.com"
    },
    {
      id: "social-4",
      name: "Phone",
      icon: "phone",
      url: "+92 300 2711390"
    },
    {
      id: "social-5",
      name: "Microsoft Teams",
      icon: "teams",
      url: "https://teams.microsoft.com"
    },
    {
      id: "social-6",
      name: "Google Meet",
      icon: "meet",
      url: "https://meet.google.com"
    },
    {
      id: "social-7",
      name: "Zoom",
      icon: "zoom",
      url: "https://zoom.us"
    },
    {
      id: "social-8",
      name: "Facebook",
      icon: "facebook",
      url: "https://facebook.com"
    },
    {
      id: "social-9",
      name: "Instagram",
      icon: "instagram",
      url: "https://instagram.com"
    },
    {
      id: "social-10",
      name: "TikTok",
      icon: "tiktok",
      url: "https://tiktok.com"
    },
    {
      id: "social-11",
      name: "YouTube",
      icon: "youtube",
      url: "https://youtube.com"
    },
    {
      id: "social-12",
      name: "Twitter / X",
      icon: "twitter",
      url: "https://x.com"
    },
    {
      id: "social-13",
      name: "Calendly",
      icon: "calendly",
      url: "https://calendly.com"
    },
    {
      id: "social-14",
      name: "Telegram",
      icon: "telegram",
      url: "https://t.me"
    },
    {
      id: "social-15",
      name: "Skype",
      icon: "skype",
      url: "skype:live:smahsan52?chat"
    },
    {
      id: "social-16",
      name: "GitHub",
      icon: "github",
      url: "https://github.com"
    }
  ],
  contactModules: defaultContactModules,
  theme: defaultThemeData,
  adminUsers: defaultAdminUsers,
  emailSettings: defaultEmailSettings,
  analytics: defaultEngagementStats
};
