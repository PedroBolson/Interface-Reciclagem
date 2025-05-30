import { httpsCallable, getFunctions } from 'firebase/functions';
import app from '../lib/firebase';

const functions = getFunctions(app);

interface AddRecyclingPointsData {
    material: string;
    weight: number;
    weightUnit: 'kg' | 'g';
    location: string;
    pointsPerUnit?: number;
}

interface SpendPointsData {
    points: number;
    rewardName: string;
    rewardCategory: string;
}

export const useFirebaseFunctions = () => {
    const addRecyclingPoints = async (data: AddRecyclingPointsData) => {
        try {
            const addPoints = httpsCallable(functions, 'addRecyclingPoints');
            const result = await addPoints(data);
            return result.data;
        } catch (error: any) {
            console.error('Erro ao adicionar pontos:', error);
            throw new Error(error.message || 'Erro ao adicionar pontos');
        }
    };

    const spendPointsOnReward = async (data: SpendPointsData) => {
        try {
            const spendPoints = httpsCallable(functions, 'spendPointsOnReward');
            const result = await spendPoints(data);
            return result.data;
        } catch (error: any) {
            console.error('Erro ao gastar pontos:', error);
            throw new Error(error.message || 'Erro ao gastar pontos');
        }
    };

    const getUserBalance = async () => {
        try {
            const getBalance = httpsCallable(functions, 'getUserBalance');
            const result = await getBalance({});
            return result.data;
        } catch (error: any) {
            console.error('Erro ao obter saldo:', error);
            throw new Error(error.message || 'Erro ao obter saldo');
        }
    };

    const getUserTransactions = async (limit = 20, lastDoc?: any) => {
        try {
            const getTransactions = httpsCallable(functions, 'getUserTransactions');
            const result = await getTransactions({ limit, lastDoc });
            return result.data;
        } catch (error: any) {
            console.error('Erro ao obter transações:', error);
            throw new Error(error.message || 'Erro ao obter transações');
        }
    };

    return {
        addRecyclingPoints,
        spendPointsOnReward,
        getUserBalance,
        getUserTransactions
    };
};