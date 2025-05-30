import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useAuth } from './useAuth';

interface RecyclingData {
    material: string;
    weight: number;
    weightUnit: 'kg' | 'g';
    location: string;
    pointsPerUnit?: number;
    // Novos campos para suportar cálculo detalhado
    totalPoints?: number;
    basePoints?: number;
    bonusPoints?: number;
    confirmationCode?: string;
    locationId?: string;
    timestamp?: string;
}

interface BonusData {
    points?: number;
    reason?: string;
}

interface RecyclingResult {
    success: boolean;
    points?: number;
    error?: string;
}

export const useRecycling = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuth();

    // Função para normalizar números (aceita vírgula e ponto)
    const normalizeNumber = (value: string | number): number => {
        if (typeof value === 'number') return value;

        // Substitui vírgula por ponto e remove espaços
        const normalized = value.toString().replace(',', '.').trim();
        const parsed = parseFloat(normalized);

        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100; // 2 casas decimais
    };

    const addPoints = async (data: RecyclingData): Promise<RecyclingResult> => {
        if (!user) {
            return {
                success: false,
                error: 'Usuário não autenticado'
            };
        }

        setIsProcessing(true);

        try {
            // Normalizar todos os números antes de enviar
            const normalizedData = {
                ...data,
                weight: normalizeNumber(data.weight),
                pointsPerUnit: normalizeNumber(data.pointsPerUnit || 0),
                totalPoints: normalizeNumber(data.totalPoints || 0),
                basePoints: normalizeNumber(data.basePoints || 0),
                bonusPoints: normalizeNumber(data.bonusPoints || 0),
                userId: user.uid,
                timestamp: data.timestamp || new Date().toISOString()
            };

            console.log('🔄 Enviando dados normalizados:', normalizedData);

            const addRecyclingPoints = httpsCallable(functions, 'addRecyclingPoints');
            const result = await addRecyclingPoints(normalizedData);

            console.log('✅ Resultado do backend:', result.data);

            return result.data as RecyclingResult;
        } catch (error: any) {
            console.error('❌ Erro ao adicionar pontos:', error);
            return {
                success: false,
                error: error.message || 'Erro desconhecido'
            };
        } finally {
            setIsProcessing(false);
        }
    };

    const addBonus = async (data: BonusData = {}): Promise<RecyclingResult> => {
        setIsProcessing(true);

        try {
            const normalizedData = {
                ...data,
                points: normalizeNumber(data.points || 0)
            };

            const addBonusPoints = httpsCallable(functions, 'addBonusPoints');
            const result = await addBonusPoints(normalizedData);

            return result.data as RecyclingResult;
        } catch (error: any) {
            console.error('Erro ao adicionar bônus:', error);
            return {
                success: false,
                error: error.message || 'Erro desconhecido'
            };
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        addPoints,
        addBonus,
        isProcessing,
        normalizeNumber // Exportar para uso em outros componentes
    };
};