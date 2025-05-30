import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { subscribeToUserTransactions, getUserTransactions, type Transaction } from '../services/firestoreService';

export const useUserTransactions = (limitCount: number = 20) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTransactions = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const transactionsData = await getUserTransactions(user.uid, limitCount);
            setTransactions(transactionsData);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    }, [user, limitCount]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Usar polling em vez de real-time para evitar erro de índice
        const unsubscribe = subscribeToUserTransactions(user.uid, limitCount, (transactionsData) => {
            setTransactions(transactionsData);
            setLoading(false);
        });

        return unsubscribe;
    }, [user, limitCount]);

    const refresh = useCallback(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        refresh,
        hasMore: transactions.length === limitCount
    };
};