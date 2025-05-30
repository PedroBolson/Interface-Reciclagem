import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useAuth } from './useAuth';

interface WelcomeGiftEligibility {
    eligible: boolean;
    reason?: 'already_claimed' | 'expired' | 'user_not_found';
    daysLeft?: number;
    giftValue?: number;
    claimedAt?: any;
    accountCreatedAt?: any;
}

export const useWelcomeGift = () => {
    const [eligibility, setEligibility] = useState<WelcomeGiftEligibility | null>(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const { user } = useAuth();

    // Verificar elegibilidade
    const checkEligibility = async () => {
        if (!user) {
            setEligibility({ eligible: false, reason: 'user_not_found' });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const checkWelcomeGiftEligibility = httpsCallable(functions, 'checkWelcomeGiftEligibility');
            const result = await checkWelcomeGiftEligibility();

            setEligibility(result.data as WelcomeGiftEligibility);
        } catch (error: any) {
            console.error('Erro ao verificar elegibilidade:', error);
            setEligibility({ eligible: false, reason: 'user_not_found' });
        } finally {
            setLoading(false);
        }
    };

    // Resgatar presente
    const claimGift = async () => {
        if (!user || !eligibility?.eligible) {
            return { success: false, error: 'Não elegível para presente' };
        }

        try {
            setClaiming(true);
            const claimWelcomeGift = httpsCallable(functions, 'claimWelcomeGift');
            const result = await claimWelcomeGift();

            // Atualizar elegibilidade após resgate
            await checkEligibility();

            return result.data;
        } catch (error: any) {
            console.error('Erro ao resgatar presente:', error);
            return { success: false, error: error.message };
        } finally {
            setClaiming(false);
        }
    };

    useEffect(() => {
        checkEligibility();
    }, [user]);

    return {
        eligibility,
        loading,
        claiming,
        claimGift,
        checkEligibility
    };
};