export interface EmailRequest {
    to: string;
    subject: string;
    body: string;
}

type EmailEventListener = (email: EmailRequest) => void;

class MockEmailService {
    private listeners: EmailEventListener[] = [];

    subscribe(listener: EmailEventListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        console.log(`[MockEmailService] Sending email to ${to}: ${subject}`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const email = { to, subject, body };
        this.notifyListeners(email);
    }

    private notifyListeners(email: EmailRequest) {
        this.listeners.forEach(listener => listener(email));
    }
}

export const emailService = new MockEmailService();
