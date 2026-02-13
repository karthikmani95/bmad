import { createMockUserToken } from '../tests/__mocks__/bank-sso';

async function main() {
    const token = await createMockUserToken({
        id: 'user_123',
        email: 'karthik@notdfc.com',
        name: 'Karthik Mani',
        role: 'retail_customer'
    });
    console.log(token);
}

main();
