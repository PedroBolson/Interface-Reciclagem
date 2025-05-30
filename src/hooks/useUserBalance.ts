import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { subscribeToUserBalance } from '../services/firestoreService';
import type { UserBalance } from '../services/firestoreService';

export const useUserBalance = () => {
    const [balance, setBalance] = useState<UserBalance>({
        uid: '',
        currentBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
        updatedAt: null
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Escutar mudanças em tempo real
        const unsubscribe = subscribeToUserBalance(user.uid, (balanceData) => {
            if (balanceData) {
                setBalance(balanceData);
            } else {
                // Se não existe, criar balanço inicial
                setBalance({
                    uid: user.uid,
                    currentBalance: 0,
                    totalEarned: 0,
                    totalSpent: 0,
                    updatedAt: new Date()
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Função para forçar refresh (opcional)
    const refreshBalance = () => {
        // Com tempo real, não precisamos de refresh manual
        // Mas podemos manter para compatibilidade
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    return {
        balance,
        loading,
        refreshBalance
    };
};