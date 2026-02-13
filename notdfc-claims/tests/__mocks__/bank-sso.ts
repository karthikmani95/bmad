import { Buffer } from 'buffer';

const SSO_SECRET = process.env.NOTDFC_SSO_SECRET || 'fallback-secret';

interface MockUser {
    id: string;
    email: string;
    name: string;
    role: 'retail_customer' | 'bank_staff';
}

/**
 * Simulates the bank portal's token generation.
 * In a real scenario, this would be a signed JWT from a dedicated Auth server.
 */
export async function createMockUserToken(user: MockUser): Promise<string> {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({
        ...user,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
    })).toString('base64');

    // Simple "Signature" simulator for the mock
    const signature = Buffer.from(`${header}.${payload}.${SSO_SECRET}`).toString('base64');

    return `${header}.${payload}.${signature}`;
}

/**
 * Validates the mock token.
 * mirrors the middleware's logic for verification.
 */
export async function verifyMockToken(token: string): Promise<MockUser | null> {
    try {
        const [header, payload, signature] = token.split('.');

        // Verify "mock signature"
        const expectedSignature = Buffer.from(`${header}.${payload}.${SSO_SECRET}`).toString('base64');

        if (signature !== expectedSignature) {
            console.error('SSO Mock: Invalid Signature detected');
            return null;
        }

        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

        // Check expiry
        if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
            console.error('SSO Mock: Token Expired');
            return null;
        }

        return decodedPayload as MockUser;
    } catch (error) {
        console.error('SSO Mock: Verification failed', error);
        return null;
    }
}
