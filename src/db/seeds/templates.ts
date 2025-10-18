import { db } from '@/db';
import { templates } from '@/db/schema';

async function main() {
    const sampleTemplates = [
        {
            name: 'AI Content Generator',
            category: 'AI Automation',
            price: 49,
            rating: 4.9,
            downloads: 1200,
            description: 'Automated content generation with GPT-4 integration',
            featured: true,
            features: JSON.stringify(['GPT-4 Integration', 'Custom Prompts', 'Bulk Processing']),
            requirements: JSON.stringify(['n8n 1.0+', 'OpenAI API key']),
            image: null,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Data Sync Master',
            category: 'Data Sync',
            price: 39,
            rating: 4.8,
            downloads: 980,
            description: 'Synchronize multiple data sources in real-time',
            featured: true,
            features: JSON.stringify(['Real-time sync', 'Multiple sources', 'Auto-mapping']),
            requirements: JSON.stringify(['n8n 1.0+', 'API access']),
            image: null,
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'Email Automation Pro',
            category: 'Marketing',
            price: 29,
            rating: 4.7,
            downloads: 850,
            description: 'Smart email automation with advanced triggers',
            featured: false,
            features: JSON.stringify(['Smart triggers', 'A/B testing', 'Analytics']),
            requirements: JSON.stringify(['n8n 1.0+', 'Email provider API']),
            image: null,
            createdAt: new Date('2024-01-25').toISOString(),
        }
    ];

    await db.insert(templates).values(sampleTemplates);
    
    console.log('✅ Templates seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});