import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

interface RewardData {
    points: number;
    rewardName: string;
    rewardCategory: string;
    rewardId: string;
}

interface RewardResult {
    success: boolean;
    remainingBalance?: number;
    error?: string;
}

export const useRewards = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const spendPoints = async (data: RewardData): Promise<RewardResult> => {
        setIsProcessing(true);

        try {
            const spendPointsOnReward = httpsCallable(functions, 'spendPointsOnReward');
            const result = await spendPointsOnReward(data);

            return result.data as RewardResult;
        } catch (error: any) {
            console.error('Erro ao gastar pontos:', error);
            return {
                success: false,
                error: error.message || 'Erro desconhecido',
            };
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        spendPoints,
        isProcessing,
    };
};