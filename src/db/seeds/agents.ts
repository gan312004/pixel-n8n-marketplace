import { db } from '@/db';
import { agents } from '@/db/schema';

async function main() {
    const sampleAgents = [
        {
            name: 'Customer Support Bot',
            type: 'Conversational',
            price: 79,
            rating: 4.9,
            downloads: 450,
            description: '24/7 intelligent customer support with natural language understanding',
            features: JSON.stringify(['24/7 availability', 'Multi-language', 'Context aware']),
            requirements: JSON.stringify(['n8n 1.0+', 'AI API access']),
            keyPoints: JSON.stringify(['Reduces support tickets by 60%', 'Instant responses', 'Easy to customize']),
            whyBuyIt: 'Save time and money while providing better customer service. This agent handles common queries automatically, allowing your team to focus on complex issues.',
            image: null,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Data Analysis Agent',
            type: 'Analytics',
            price: 99,
            rating: 4.8,
            downloads: 380,
            description: 'Advanced analytics with predictive insights powered by machine learning',
            features: JSON.stringify(['Advanced analytics', 'Custom reports', 'Predictive insights']),
            requirements: JSON.stringify(['n8n 1.0+', 'Database access']),
            keyPoints: JSON.stringify(['Actionable insights', 'Automated reporting', 'ML-powered predictions']),
            whyBuyIt: 'Transform your data into decisions. Get comprehensive analytics without hiring a data scientist.',
            image: null,
            createdAt: new Date('2024-01-20').toISOString(),
        }
    ];

    await db.insert(agents).values(sampleAgents);
    
    console.log('✅ Agents seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});