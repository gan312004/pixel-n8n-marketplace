import { db } from '@/db';
import { bundles } from '@/db/schema';

async function main() {
    const sampleBundles = [
        {
            name: 'Starter Pack',
            description: 'Perfect for getting started with automation',
            originalPrice: 150,
            bundlePrice: 99,
            discount: 34,
            templates: JSON.stringify(['AI Content Generator', 'Email Automation Pro']),
            saves: 51,
            image: null,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Pro Bundle',
            description: 'Complete automation suite for professionals',
            originalPrice: 250,
            bundlePrice: 149,
            discount: 40,
            templates: JSON.stringify(['AI Content Generator', 'Data Sync Master', 'Email Automation Pro', 'Customer Support Bot']),
            saves: 101,
            image: null,
            createdAt: new Date('2024-01-20').toISOString(),
        }
    ];

    await db.insert(bundles).values(sampleBundles);
    
    console.log('✅ Bundles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});