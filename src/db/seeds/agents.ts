import { db } from '@/db';
import { agents } from '@/db/schema';

async function main() {
    const sampleAgents = [
        {
            name: 'Customer Support AI',
            type: 'Conversational',
            price: 79,
            rating: 4.9,
            downloads: 450,
            description: '24/7 intelligent customer support with natural language understanding',
            features: JSON.stringify(['Multi-language', 'Sentiment analysis', 'Auto-escalation']),
            requirements: JSON.stringify(['n8n 1.0+', 'AI API access']),
            image: null,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Sales Intelligence Agent',
            type: 'Analytics',
            price: 99,
            rating: 4.8,
            downloads: 380,
            description: 'AI-powered lead scoring and opportunity prediction',
            features: JSON.stringify(['Lead scoring', 'Pipeline analysis', 'Forecasting']),
            requirements: JSON.stringify(['n8n 1.0+', 'CRM integration']),
            image: null,
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'Content Research Bot',
            type: 'Research',
            price: 69,
            rating: 4.7,
            downloads: 320,
            description: 'Automated content research and topic discovery',
            features: JSON.stringify(['Trend analysis', 'Competitor tracking', 'SEO insights']),
            requirements: JSON.stringify(['n8n 1.0+', 'API keys']),
            image: null,
            createdAt: new Date('2024-01-25').toISOString(),
        }
    ];

    await db.insert(agents).values(sampleAgents);
    
    console.log('✅ Agents seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});