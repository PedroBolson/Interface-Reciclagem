import { useState } from 'react'

interface CEPData {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    erro?: boolean
}

export const useCEP = () => {
    const [loading, setLoading] = useState(false)

    const searchCEP = async (cep: string): Promise<CEPData | null> => {
        if (!cep || cep.length !== 8) return null

        setLoading(true)
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (data.erro) {
                return null
            }

            return {
                cep: data.cep,
                logradouro: data.logradouro || '',
                complemento: data.complemento || '',
                bairro: data.bairro || '',
                localidade: data.localidade,
                uf: data.uf
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error)
            return null
        } finally {
            setLoading(false)
        }
    }

    return { searchCEP, loading }
}