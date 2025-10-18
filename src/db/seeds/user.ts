import { db } from '@/db';
import { user, account } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function main() {
    try {
        // Check if admin user already exists
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.email, 'adityashah@gmail.com'))
            .limit(1);

        if (existingUser.length > 0) {
            console.log('⚠️  Admin user already exists. Skipping seeding.');
            return;
        }

        // Generate user ID
        const userId = randomUUID();

        // Hash the password
        const hashedPassword = await bcrypt.hash('12345', 10);

        // Create admin user
        const adminUser = {
            id: userId,
            email: 'adityashah@gmail.com',
            password: hashedPassword,
            name: 'Aditya Shah',
            isAdmin: true,
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(user).values(adminUser);

        // Create account record for credential provider
        const adminAccount = {
            id: randomUUID(),
            accountId: 'adityashah@gmail.com',
            providerId: 'credential',
            userId: userId,
            password: hashedPassword,
            accessToken: null,
            refreshToken: null,
            idToken: null,
            accessTokenExpiresAt: null,
            refreshTokenExpiresAt: null,
            scope: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(account).values(adminAccount);

        console.log('✅ Admin user seeder completed successfully');
        console.log('📧 Email: adityashah@gmail.com');
        console.log('🔑 Password: 12345');
    } catch (error) {
        console.error('❌ Admin user seeder failed:', error);
        throw error;
    }
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});