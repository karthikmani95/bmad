
import { MOCK_TRANSACTIONS } from '../src/features/transactions/mocks/data';

console.log('Verifying Transaction Filtering Logic...');

const cardTransactions = MOCK_TRANSACTIONS.filter(t => t.transactionType === 'Card' && t.status === 'Settled');
const nonCardTransactions = MOCK_TRANSACTIONS.filter(t => t.transactionType === 'Non-Card' && t.status === 'Settled');

console.log(`Total Mock Transactions: ${MOCK_TRANSACTIONS.length}`);
console.log(`Card Transactions (Settled): ${cardTransactions.length}`);
console.log(`Non-Card Transactions (Settled): ${nonCardTransactions.length}`);

// Expected counts based on data.ts changes
// Card: TXN-101, TXN-102. (TXN-103, TXN-105 are Pending). Total settled Card = 2?
// TXN-101 (Amazon) - Settled, Card
// TXN-102 (Starbucks) - Settled, Card
// TXN-103 (Apple) - Pending, Card
// TXN-104 (Tesla) - Settled, Non-Card
// TXN-105 (Uber) - Pending, Card
// TXN-106 (Citi) - Settled, Non-Card

const expectedCardCount = 2; // Amazon, Starbucks
const expectedNonCardCount = 2; // Tesla, Citi

if (cardTransactions.length === expectedCardCount) {
    console.log('✅ Card filtering passed.');
} else {
    console.error(`❌ Card filtering failed. Expected ${expectedCardCount}, got ${cardTransactions.length}`);
    cardTransactions.forEach(t => console.log(` - ${t.merchant} (${t.status})`));
}

if (nonCardTransactions.length === expectedNonCardCount) {
    console.log('✅ Non-Card filtering passed.');
} else {
    console.error(`❌ Non-Card filtering failed. Expected ${expectedNonCardCount}, got ${nonCardTransactions.length}`);
    nonCardTransactions.forEach(t => console.log(` - ${t.merchant} (${t.status})`));
}

if (cardTransactions.length === expectedCardCount && nonCardTransactions.length === expectedNonCardCount) {
    console.log('🎉 Verification Successful!');
    process.exit(0);
} else {
    console.error('⚠️ Verification Failed.');
    process.exit(1);
}
