import { db } from '@/db';
import { user, account } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function main() {
    const adminEmail = 'adityashah@gmail.com';
    
    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, adminEmail)).limit(1);
    
    if (existingUser.length > 0) {
        console.log('⚠️  Admin user already exists, skipping seeder');
        return;
    }
    
    // Generate UUID for user
    const userId = randomUUID();
    
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash('12345', 10);
    
    // Current timestamp
    const now = new Date();
    
    // Create admin user
    const adminUser = {
        id: userId,
        email: adminEmail,
        name: 'Admin User',
        emailVerified: true,
        isAdmin: true,
        image: null,
        createdAt: now,
        updatedAt: now,
    };
    
    // Insert user
    await db.insert(user).values(adminUser);
    
    // Create account record with credential provider
    const adminAccount = {
        id: randomUUID(),
        accountId: adminEmail,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        createdAt: now,
        updatedAt: now,
    };
    
    // Insert account
    await db.insert(account).values(adminAccount);
    
    console.log('✅ Admin user seeder completed successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: 12345`);
    console.log(`👤 User ID: ${userId}`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});