import { useState, useEffect } from 'react'
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Transaction, UserBalance } from './useAuth'

interface MaterialStats {
    material: string
    totalWeight: number
    totalPoints: number
    count: number
}

interface MonthlyStats {
    month: string
    points: number
    weight: number
    recycleCount: number
}

interface UserStats {
    balance: UserBalance | null
    materialStats: MaterialStats[]
    monthlyStats: MonthlyStats[]
    recentRecycling: Transaction[]
    topMaterials: MaterialStats[]
    co2Saved: number
    ranking: number
}

export const useUserStats = (uid: string) => {
    const [stats, setStats] = useState<UserStats>({
        balance: null,
        materialStats: [],
        monthlyStats: [],
        recentRecycling: [],
        topMaterials: [],
        co2Saved: 0,
        ranking: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!uid) return
        fetchUserStats()
    }, [uid])

    const fetchUserStats = async () => {
        try {
            setLoading(true)

            // Buscar todas as transações de reciclagem do usuário
            const recyclingQuery = query(
                collection(db, 'transactions'),
                where('uid', '==', uid),
                where('type', '==', 'recycling'),
                orderBy('timestamp', 'desc')
            )

            const recyclingSnapshot = await getDocs(recyclingQuery)
            const recyclingTransactions: any[] = []

            recyclingSnapshot.forEach(doc => {
                const data = doc.data()
                recyclingTransactions.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate?.() || data.timestamp
                })
            })

            // Calcular estatísticas por material
            const materialStatsMap = new Map<string, MaterialStats>()

            recyclingTransactions.forEach(transaction => {
                const { material, weight, points } = transaction

                if (materialStatsMap.has(material)) {
                    const existing = materialStatsMap.get(material)!
                    materialStatsMap.set(material, {
                        ...existing,
                        totalWeight: existing.totalWeight + weight,
                        totalPoints: existing.totalPoints + points,
                        count: existing.count + 1
                    })
                } else {
                    materialStatsMap.set(material, {
                        material,
                        totalWeight: weight,
                        totalPoints: points,
                        count: 1
                    })
                }
            })

            const materialStats = Array.from(materialStatsMap.values())
            const topMaterials = materialStats
                .sort((a, b) => b.totalPoints - a.totalPoints)
                .slice(0, 5)

            // Calcular estatísticas mensais
            const monthlyStatsMap = new Map<string, MonthlyStats>()

            recyclingTransactions.forEach(transaction => {
                const date = new Date(transaction.timestamp)
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

                if (monthlyStatsMap.has(monthKey)) {
                    const existing = monthlyStatsMap.get(monthKey)!
                    monthlyStatsMap.set(monthKey, {
                        ...existing,
                        points: existing.points + transaction.points,
                        weight: existing.weight + transaction.weight,
                        recycleCount: existing.recycleCount + 1
                    })
                } else {
                    monthlyStatsMap.set(monthKey, {
                        month: monthKey,
                        points: transaction.points,
                        weight: transaction.weight,
                        recycleCount: 1
                    })
                }
            })

            const monthlyStats = Array.from(monthlyStatsMap.values())
                .sort((a, b) => b.month.localeCompare(a.month))
                .slice(0, 12)

            // Calcular CO2 economizado (estimativa)
            const totalWeight = recyclingTransactions.reduce((sum, t) => sum + t.weight, 0)
            const co2Saved = totalWeight * 0.5 // Estimativa: 0.5kg CO2 por kg reciclado

            // Buscar transações recentes
            const recentQuery = query(
                collection(db, 'transactions'),
                where('uid', '==', uid),
                where('type', '==', 'recycling'),
                orderBy('timestamp', 'desc'),
                limit(5)
            )

            const recentSnapshot = await getDocs(recentQuery)
            const recentRecycling: Transaction[] = []

            recentSnapshot.forEach(doc => {
                const data = doc.data()
                recentRecycling.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate?.() || data.timestamp,
                    createdAt: data.createdAt?.toDate?.() || data.createdAt
                } as Transaction)
            })

            setStats({
                balance: null, // Será carregado separadamente
                materialStats,
                monthlyStats,
                recentRecycling,
                topMaterials,
                co2Saved,
                ranking: 42 // Mock - implementar ranking real depois
            })

        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
        } finally {
            setLoading(false)
        }
    }

    return { stats, loading, refresh: fetchUserStats }
}