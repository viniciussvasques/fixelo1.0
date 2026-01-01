import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as createPaymentIntent } from '@/app/api/create-payment-intent/route';
import { prisma } from '@fixelo/database';
import { stripe } from '@/lib/stripe';

// Mock dependencies
vi.mock('@fixelo/database', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            count: vi.fn(),
        },
        serviceType: {
            findUnique: vi.fn(),
        },
        booking: {
            count: vi.fn(),
        },
        addOn: {
            findMany: vi.fn(),
        },
    }
}));

vi.mock('@/lib/stripe', () => ({
    stripe: {
        paymentIntents: {
            create: vi.fn(),
        },
    }
}));

vi.mock('@/lib/auth', () => ({
    auth: vi.fn(() => Promise.resolve({ user: { id: 'user-1' } })),
}));

describe('Referral System Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply $20 discount for a valid referral code on first booking', async () => {
        // Mock service data
        (prisma.serviceType.findUnique as any).mockResolvedValue({ id: 's1', basePrice: 100, baseTime: 120 });
        (prisma.user.findUnique as any).mockResolvedValue({ id: 'referrer-1', referralCode: 'REF123' });
        (prisma.booking.count as any).mockResolvedValue(0); // First booking

        (stripe.paymentIntents.create as any).mockResolvedValue({ client_secret: 'pi_test_secret_test' });

        const req = new Request('http://localhost/api/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({
                serviceId: 's1',
                homeDetails: { bedrooms: 1, bathrooms: 1, hasPets: false },
                referralCode: 'REF123'
            })
        });

        const response = await createPaymentIntent(req);
        const data = await (response as any).json();
        console.log('DEBUG DATA:', data);

        expect(data.amount).toBe(80); // 100 - 20 referral discount
        expect(stripe.paymentIntents.create).toHaveBeenCalledWith(expect.objectContaining({
            amount: 8000, // 80 USD in cents
            metadata: expect.objectContaining({
                referralCode: 'REF123',
                discountAmount: '20'
            })
        }));
    });

    it('should not apply referral discount for existing users', async () => {
        (prisma.serviceType.findUnique as any).mockResolvedValue({ id: 's1', basePrice: 100, baseTime: 120 });
        (prisma.user.findUnique as any).mockResolvedValue({ id: 'referrer-1', referralCode: 'REF123' });
        (prisma.booking.count as any).mockResolvedValue(1); // Not first booking

        (stripe.paymentIntents.create as any).mockResolvedValue({ client_secret: 'pi_test_secret_test' });

        const req = new Request('http://localhost/api/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({
                serviceId: 's1',
                homeDetails: { bedrooms: 1, bathrooms: 1, hasPets: false },
                referralCode: 'REF123'
            })
        });

        const response = await createPaymentIntent(req);
        const data = await response.json();

        expect(data.amount).toBe(100); // No discount
    });
});
