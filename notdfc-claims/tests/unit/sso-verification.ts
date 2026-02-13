import { createMockUserToken, verifyMockToken } from '../../tests/__mocks__/bank-sso';

async function runTest() {
    console.log('🚀 Starting SSO Mock Verification Test...');

    const mockUser = {
        id: 'user_123',
        email: 'karthik@notdfc.com',
        name: 'Karthik Mani',
        role: 'retail_customer' as const,
    };

    try {
        // 1. Generate Token
        const token = await createMockUserToken(mockUser);
        console.log('✅ Token Generated:', token.substring(0, 30) + '...');

        // 2. Verify Token
        const verifiedUser = await verifyMockToken(token);
        if (verifiedUser && verifiedUser.id === mockUser.id) {
            console.log('✅ Verification Successful: User ID matches');
        } else {
            throw new Error('❌ Verification Failed: User mismatch or null');
        }

        // 3. Test Invalid Token
        const invalidToken = token + 'tampered';
        const invalidUser = await verifyMockToken(invalidToken);
        if (!invalidUser) {
            console.log('✅ Security Check: Tampered token correctly rejected');
        } else {
            throw new Error('❌ Security Check Failed: Tampered token was accepted!');
        }

        console.log('🏁 All SSO Mock Tests Passed!');
    } catch (error) {
        console.error('💥 Test Failed:', error);
        process.exit(1);
    }
}

runTest();
