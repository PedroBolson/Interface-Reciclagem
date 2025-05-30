import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Configurar opções globais
setGlobalOptions({ maxInstances: 10 });

// Interfaces para tipagem
interface RecyclingData {
    material: string;
    weight: number;
    weightUnit: 'kg' | 'g';
    location: string;
    locationId?: string;
    pointsPerUnit?: number;
    totalPoints?: number;
    basePoints?: number;
    bonusPoints?: number;
    confirmationCode?: string;
    timestamp?: string;
}

interface BonusData {
    points?: number;
    reason?: string;
}

interface RewardData {
    points: number;
    rewardName: string;
    rewardCategory: string;
}

// Função para normalizar números (aceita vírgula e ponto)
const normalizeNumber = (value: string | number): number => {
    if (typeof value === 'number') return Math.round(value * 100) / 100;

    const normalized = value.toString().replace(',', '.').trim();
    const parsed = parseFloat(normalized);

    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
};

// Função principal para adicionar pontos de reciclagem
export const addRecyclingPoints = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário deve estar autenticado');
    }

    const data = request.data as RecyclingData;
    const uid = request.auth.uid;

    try {
        // Normalizar todos os números
        const normalizedData = {
            material: data.material,
            weight: normalizeNumber(data.weight || 0),
            weightUnit: data.weightUnit || 'kg',
            location: data.location,
            locationId: data.locationId || '',
            pointsPerUnit: normalizeNumber(data.pointsPerUnit || 0),
            totalPoints: normalizeNumber(data.totalPoints || 0),
            basePoints: normalizeNumber(data.basePoints || 0),
            bonusPoints: normalizeNumber(data.bonusPoints || 0),
            confirmationCode: data.confirmationCode || '',
            timestamp: data.timestamp || new Date().toISOString()
        };

        console.log('📊 Dados normalizados recebidos:', normalizedData);

        // Validações
        if (normalizedData.weight <= 0) {
            throw new HttpsError('invalid-argument', 'Peso deve ser maior que zero');
        }

        if (normalizedData.totalPoints <= 0) {
            throw new HttpsError('invalid-argument', 'Pontos devem ser maior que zero');
        }

        if (!normalizedData.material || !normalizedData.location) {
            throw new HttpsError('invalid-argument', 'Material e localização são obrigatórios');
        }

        // Usar transação para garantir consistência
        const result = await db.runTransaction(async (transaction) => {
            // Buscar saldo atual
            const balanceRef = db.collection('balances').doc(uid);
            const balanceDoc = await transaction.get(balanceRef);

            let currentBalance = 0;
            let totalEarned = 0;
            let recyclingCount = 0;

            if (balanceDoc.exists) {
                const balanceData = balanceDoc.data();
                currentBalance = normalizeNumber(balanceData?.currentBalance || 0);
                totalEarned = normalizeNumber(balanceData?.totalEarned || 0);
                recyclingCount = parseInt(balanceData?.recyclingCount || 0);
            }

            // Calcular novos valores
            const newCurrentBalance = normalizeNumber(currentBalance + normalizedData.totalPoints);
            const newTotalEarned = normalizeNumber(totalEarned + normalizedData.totalPoints);
            const newRecyclingCount = recyclingCount + 1;

            // Atualizar saldo
            const balanceUpdate = {
                uid,
                currentBalance: newCurrentBalance,
                totalEarned: newTotalEarned,
                recyclingCount: newRecyclingCount,
                totalSpent: balanceDoc.exists ? (balanceDoc.data()?.totalSpent || 0) : 0,
                lastRecycling: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                ...(balanceDoc.exists ? {} : { createdAt: FieldValue.serverTimestamp() })
            };

            transaction.set(balanceRef, balanceUpdate, { merge: true });

            // Adicionar transação de reciclagem
            const transactionRef = db.collection('transactions').doc();
            const transactionData = {
                uid: uid,
                type: 'recycling',
                status: 'confirmed',
                material: normalizedData.material,
                weight: normalizedData.weight,
                weightUnit: normalizedData.weightUnit,
                location: normalizedData.location,
                locationId: normalizedData.locationId,
                points: normalizedData.totalPoints,
                basePoints: normalizedData.basePoints,
                bonusPoints: normalizedData.bonusPoints,
                pointsPerUnit: normalizedData.pointsPerUnit,
                confirmationCode: normalizedData.confirmationCode,
                description: `Reciclagem de ${normalizedData.weight}${normalizedData.weightUnit} de ${normalizedData.material} em ${normalizedData.location}`,
                timestamp: FieldValue.serverTimestamp(),
                createdAt: FieldValue.serverTimestamp(),
                // Metadados úteis
                calculationBreakdown: {
                    basePoints: normalizedData.basePoints,
                    bonusPoints: normalizedData.bonusPoints,
                    totalPoints: normalizedData.totalPoints
                }
            };

            transaction.set(transactionRef, transactionData);

            return {
                transactionId: transactionRef.id,
                newBalance: newCurrentBalance,
                pointsAdded: normalizedData.totalPoints
            };
        });

        console.log('✅ Transação concluída com sucesso:', result);

        return {
            success: true,
            points: result.pointsAdded,
            newBalance: result.newBalance,
            transactionId: result.transactionId,
            message: `${result.pointsAdded} pontos adicionados com sucesso!`
        };

    } catch (error) {
        console.error('❌ Erro ao processar reciclagem:', error);

        if (error instanceof HttpsError) {
            throw error;
        }

        throw new HttpsError('internal', 'Erro interno do servidor: ' + (error as Error).message);
    }
});

// Função para buscar saldo do usuário
export const getUserBalance = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const uid = request.auth.uid;

    try {
        const balanceRef = db.collection('balances').doc(uid);
        const balanceDoc = await balanceRef.get();

        if (!balanceDoc.exists) {
            // Criar balanço inicial se não existir
            const initialBalance = {
                uid,
                currentBalance: 0,
                totalEarned: 0,
                totalSpent: 0,
                recyclingCount: 0,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            };

            await balanceRef.set(initialBalance);
            return { success: true, balance: initialBalance };
        }

        const balanceData = balanceDoc.data();
        return {
            success: true,
            balance: {
                ...balanceData,
                currentBalance: normalizeNumber(balanceData?.currentBalance || 0),
                totalEarned: normalizeNumber(balanceData?.totalEarned || 0),
                totalSpent: normalizeNumber(balanceData?.totalSpent || 0)
            }
        };
    } catch (error) {
        console.error('Erro ao buscar balanço:', error);
        throw new HttpsError('internal', 'Erro interno do servidor');
    }
});

// Função para buscar transações do usuário
export const getUserTransactions = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { limit = 20, lastDoc } = request.data;
    const uid = request.auth.uid;

    try {
        let query = db.collection('transactions')
            .where('uid', '==', uid)
            .orderBy('timestamp', 'desc')
            .limit(limit);

        if (lastDoc) {
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();
        const transactions = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Normalizar pontos para exibição
                points: normalizeNumber(data.points || 0),
                basePoints: normalizeNumber(data.basePoints || 0),
                bonusPoints: normalizeNumber(data.bonusPoints || 0),
                weight: normalizeNumber(data.weight || 0)
            };
        });

        return {
            success: true,
            transactions,
            hasMore: transactions.length === limit
        };
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        throw new HttpsError('internal', 'Erro interno do servidor');
    }
});

// Função para gastar pontos em recompensas
export const spendPointsOnReward = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const data = request.data as RewardData;
    const uid = request.auth.uid;

    const normalizedPoints = normalizeNumber(data.points);

    if (!normalizedPoints || normalizedPoints <= 0) {
        throw new HttpsError('invalid-argument', 'Pontos inválidos');
    }

    try {
        const result = await db.runTransaction(async (transaction) => {
            const balanceRef = db.collection('balances').doc(uid);
            const balanceDoc = await transaction.get(balanceRef);

            if (!balanceDoc.exists) {
                throw new HttpsError('not-found', 'Balanço do usuário não encontrado');
            }

            const balanceData = balanceDoc.data();
            const currentBalance = normalizeNumber(balanceData?.currentBalance || 0);

            if (currentBalance < normalizedPoints) {
                throw new HttpsError('failed-precondition', 'Saldo insuficiente');
            }

            const newBalance = normalizeNumber(currentBalance - normalizedPoints);
            const newTotalSpent = normalizeNumber((balanceData?.totalSpent || 0) + normalizedPoints);

            // Atualizar balanço
            transaction.update(balanceRef, {
                currentBalance: newBalance,
                totalSpent: newTotalSpent,
                updatedAt: FieldValue.serverTimestamp()
            });

            // Criar transação
            const transactionRef = db.collection('transactions').doc();
            transaction.set(transactionRef, {
                uid,
                type: 'reward',
                status: 'confirmed',
                points: -normalizedPoints, // Negativo para indicar gasto
                rewardName: data.rewardName,
                rewardCategory: data.rewardCategory,
                description: `Resgate: ${data.rewardName} - ${data.rewardCategory}`,
                timestamp: FieldValue.serverTimestamp(),
                createdAt: FieldValue.serverTimestamp()
            });

            return {
                success: true,
                remainingBalance: newBalance,
                transactionId: transactionRef.id
            };
        });

        return result;
    } catch (error) {
        console.error('Erro ao gastar pontos:', error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'Erro interno do servidor');
    }
});

// Função para adicionar pontos de bônus
export const addBonusPoints = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const data = request.data as BonusData;
    const uid = request.auth.uid;

    const normalizedPoints = normalizeNumber(data.points || 10);
    const reason = data.reason || 'Bônus do sistema';

    if (normalizedPoints <= 0) {
        throw new HttpsError('invalid-argument', 'Pontos de bônus devem ser maior que zero');
    }

    try {
        const result = await db.runTransaction(async (transaction) => {
            // Buscar ou criar balanço
            const balanceRef = db.collection('balances').doc(uid);
            const balanceDoc = await transaction.get(balanceRef);

            if (!balanceDoc.exists) {
                // Criar balanço inicial
                transaction.set(balanceRef, {
                    uid,
                    currentBalance: normalizedPoints,
                    totalEarned: normalizedPoints,
                    totalSpent: 0,
                    recyclingCount: 0,
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp()
                });
            } else {
                // Atualizar balanço existente
                const balanceData = balanceDoc.data();
                const newBalance = normalizeNumber((balanceData?.currentBalance || 0) + normalizedPoints);
                const newTotalEarned = normalizeNumber((balanceData?.totalEarned || 0) + normalizedPoints);

                transaction.update(balanceRef, {
                    currentBalance: newBalance,
                    totalEarned: newTotalEarned,
                    updatedAt: FieldValue.serverTimestamp()
                });
            }

            // Criar registro de transação
            const transactionRef = db.collection('transactions').doc();
            transaction.set(transactionRef, {
                uid,
                type: 'bonus',
                status: 'confirmed',
                points: normalizedPoints,
                description: reason,
                timestamp: FieldValue.serverTimestamp(),
                createdAt: FieldValue.serverTimestamp()
            });

            return {
                success: true,
                points: normalizedPoints,
                transactionId: transactionRef.id
            };
        });

        return result;
    } catch (error) {
        console.error('Erro ao adicionar bônus:', error);
        throw new HttpsError('internal', 'Erro interno do servidor');
    }
});

// Função para obter estatísticas do usuário
export const getUserStats = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const uid = request.auth.uid;

    try {
        // Buscar balanço
        const balanceDoc = await db.collection('balances').doc(uid).get();

        // Buscar transações recentes
        const transactionsSnapshot = await db.collection('transactions')
            .where('uid', '==', uid)
            .where('type', '==', 'recycling')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();

        const transactions = transactionsSnapshot.docs.map(doc => doc.data());

        // Calcular estatísticas
        const totalRecyclings = transactions.length;
        const totalWeight = transactions.reduce((sum, t) => sum + normalizeNumber(t.weight || 0), 0);
        const materials = [...new Set(transactions.map(t => t.material))];

        const stats = {
            balance: balanceDoc.exists ? {
                ...balanceDoc.data(),
                currentBalance: normalizeNumber(balanceDoc.data()?.currentBalance || 0),
                totalEarned: normalizeNumber(balanceDoc.data()?.totalEarned || 0),
                totalSpent: normalizeNumber(balanceDoc.data()?.totalSpent || 0)
            } : {
                currentBalance: 0,
                totalEarned: 0,
                totalSpent: 0,
                recyclingCount: 0
            },
            recycling: {
                totalRecyclings,
                totalWeight: normalizeNumber(totalWeight),
                materialsTypes: materials.length,
                averagePointsPerRecycling: totalRecyclings > 0 ?
                    normalizeNumber(transactions.reduce((sum, t) => sum + normalizeNumber(t.points || 0), 0) / totalRecyclings) : 0
            }
        };

        return { success: true, stats };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw new HttpsError('internal', 'Erro interno do servidor');
    }
});