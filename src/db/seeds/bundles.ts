import { db } from '@/db';
import { bundles } from '@/db/schema';

async function main() {
    const sampleBundles = [
        {
            name: 'Marketing Automation Suite',
            description: 'Complete marketing automation toolkit',
            originalPrice: 299,
            bundlePrice: 179,
            discount: 40,
            templates: JSON.stringify(['Email Campaign Bot', 'Social Media Scheduler', 'Content Generator', 'Analytics Dashboard', 'Lead Magnet Creator']),
            saves: 120,
            image: null,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Sales Acceleration Pack',
            description: 'Boost your sales with AI-powered tools',
            originalPrice: 349,
            bundlePrice: 209,
            discount: 40,
            templates: JSON.stringify(['Lead Scoring Agent', 'CRM Sync Master', 'Sales Intelligence Agent', 'Proposal Generator', 'Follow-up Automation']),
            saves: 140,
            image: null,
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'AI Agent Starter Kit',
            description: 'Essential AI agents for automation',
            originalPrice: 399,
            bundlePrice: 239,
            discount: 40,
            templates: JSON.stringify(['Customer Support AI', 'Content Research Bot', 'Data Analyzer', 'Workflow Optimizer', 'Sentiment Analyzer']),
            saves: 160,
            image: null,
            createdAt: new Date('2024-02-01').toISOString(),
        }
    ];

    await db.insert(bundles).values(sampleBundles);
    
    console.log('✅ Bundles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});