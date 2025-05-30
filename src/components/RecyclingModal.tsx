import React, { useState, useEffect } from 'react';
import {
    X,
    Recycle,
    MapPin,
    Weight,
    Package,
    CheckCircle,
    Loader2,
    Clock,
    Shield,
    QrCode,
    Copy,
    CheckCheck,
    Calculator
} from 'lucide-react';
import { useRecycling } from '../hooks/useRecycling';

interface RecyclingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (points: number) => void;
}

const materials = [
    {
        name: 'Plástico',
        points: 5.1, // Pontos quebrados agora
        unit: 'kg',
        icon: <Package className="w-6 h-6" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500',
        description: 'Garrafas, potes, embalagens',
        multiplier: 1.0 // Multiplicador base
    },
    {
        name: 'Papel',
        points: 2.9,
        unit: 'kg',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500',
        description: 'Jornais, revistas, papelão',
        multiplier: 1 // 10% de bônus para papel
    },
    {
        name: 'Vidro',
        points: 3.8,
        unit: 'kg',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5,6V4H7V6H17V4H19V6H20A1,1 0 0,1 21,7V19A1,1 0 0,1 20,20H4A1,1 0 0,1 3,19V7A1,1 0 0,1 4,6H5M5,8V18H19V8H5Z" /></svg>,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        description: 'Garrafas, potes, frascos',
        multiplier: 1 // 20% de bônus para vidro
    },
    {
        name: 'Metal',
        points: 8.25,
        unit: 'kg',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8M8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8M12,17.5C9.67,17.5 7.69,16.04 6.89,14H17.11C16.31,16.04 14.33,17.5 12,17.5Z" /></svg>,
        color: 'text-gray-600',
        bgColor: 'bg-gray-500',
        description: 'Latas de alumínio, ferro, aço',
        multiplier: 1 // 50% de bônus para metal
    },
    {
        name: 'Eletrônicos',
        points: 20.9,
        unit: 'kg',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z" /></svg>,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500',
        description: 'Celulares, tablets, cabos',
        multiplier: 1.0 // 100% de bônus para eletrônicos
    },
    {
        name: 'Óleo de Cozinha',
        points: 8.8,
        unit: 'litro',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V16H2V14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M5,9V20H19V9H5Z" /></svg>,
        color: 'text-orange-600',
        bgColor: 'bg-orange-500',
        description: 'Óleo usado de fritura',
        multiplier: 1 // 30% de bônus para óleo
    },
    {
        name: 'Baterias',
        points: 12.5,
        unit: 'unidade',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" /></svg>,
        color: 'text-red-600',
        bgColor: 'bg-red-500',
        description: 'Pilhas e baterias',
        multiplier: 1// 80% de bônus para baterias
    },
    {
        name: 'Orgânicos',
        points: 2.25,
        unit: 'kg',
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>,
        color: 'text-teal-600',
        bgColor: 'bg-teal-500',
        description: 'Restos de comida, cascas',
        multiplier: 1 // Orgânicos valem menos
    }
];

const locations = [
    { name: 'Supermercado Extra - Centro', id: 'EXTRA_001', bonus: 1.1 }, // 10% de bônus
    { name: 'Shopping Iguatemi', id: 'SHOP_002', bonus: 1.15 }, // 15% de bônus
    { name: 'Posto Shell - Avenida Brasil', id: 'SHELL_003', bonus: 1.0 }, // Sem bônus
    { name: 'Escola Municipal José da Silva', id: 'ESCOLA_004', bonus: 1.25 }, // 25% de bônus escolar
    { name: 'Ponto de Coleta - Praça Central', id: 'PRACA_005', bonus: 1.05 }, // 5% de bônus
    { name: 'Farmácia São João', id: 'FARM_006', bonus: 1.0 } // Sem bônus
];

const RecyclingModal: React.FC<RecyclingModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        material: '',
        weight: '',
        weightUnit: 'kg' as 'kg' | 'g',
        location: '',
        pointsPerUnit: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [codeCopied, setCodeCopied] = useState(false);
    const [countdown, setCountdown] = useState(20);
    const { addPoints, normalizeNumber } = useRecycling();

    const selectedMaterial = materials.find(m => m.name === formData.material);
    const selectedLocation = locations.find(l => l.name === formData.location);

    // Função melhorada para validar e formatar entrada numérica
    const handleWeightInput = (value: string) => {
        // Permitir números, vírgula, ponto e espaços
        let cleanValue = value.replace(/[^0-9,.]/g, '');

        // Substituir vírgula por ponto para normalização
        cleanValue = cleanValue.replace(',', '.');

        // Evitar múltiplos pontos decimais
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            cleanValue = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limitar a 2 casas decimais
        if (parts[1] && parts[1].length > 2) {
            cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
        }

        return cleanValue;
    };

    // Função para exibir número formatado (com vírgula para o usuário)
    const formatNumberForDisplay = (value: number): string => {
        return value.toFixed(2).replace('.', ',');
    };

    // Função para calcular pontos com normalização
    const calculateDetailedPoints = () => {
        if (!formData.weight || !selectedMaterial) return {
            basePoints: 0,
            weightBonus: 0,
            locationBonus: 0,
            materialBonus: 0,
            finalPoints: 0,
            breakdown: []
        };

        // Normalizar o peso inserido pelo usuário
        const weight = normalizeNumber(formData.weight);
        const weightInKg = formData.weightUnit === 'g' ? weight / 1000 : weight;

        // Pontos base
        const basePoints = weightInKg * selectedMaterial.points;

        // Bônus por material (multiplicador do material)
        const materialBonus = basePoints * (selectedMaterial.multiplier - 1);

        // Bônus por peso (incentiva maiores quantidades)
        let weightBonus = 0;
        if (weightInKg >= 5) {
            weightBonus = basePoints * 0.2; // 20% para 5kg+
        } else if (weightInKg >= 2) {
            weightBonus = basePoints * 0.1; // 10% para 2kg+
        }

        // Bônus por localização
        const locationBonus = selectedLocation ?
            (basePoints + materialBonus + weightBonus) * (selectedLocation.bonus - 1) : 0;

        // Total final
        const finalPoints = basePoints + materialBonus + weightBonus + locationBonus;

        // Breakdown para exibição
        const breakdown = [
            { label: 'Pontos base', value: basePoints, color: 'text-blue-600' },
            ...(materialBonus > 0 ? [{
                label: `Bônus ${selectedMaterial.name}`,
                value: materialBonus,
                color: 'text-green-600'
            }] : []),
            ...(weightBonus > 0 ? [{
                label: `Bônus quantidade (${formatNumberForDisplay(weightInKg)}kg)`,
                value: weightBonus,
                color: 'text-purple-600'
            }] : []),
            ...(locationBonus > 0 ? [{
                label: `Bônus local (+${Math.round((selectedLocation!.bonus - 1) * 100)}%)`,
                value: locationBonus,
                color: 'text-orange-600'
            }] : [])
        ];

        return {
            basePoints: Math.round(basePoints * 100) / 100,
            weightBonus: Math.round(weightBonus * 100) / 100,
            locationBonus: Math.round(locationBonus * 100) / 100,
            materialBonus: Math.round(materialBonus * 100) / 100,
            finalPoints: Math.round(finalPoints * 100) / 100,
            breakdown
        };
    };

    const pointsCalculation = calculateDetailedPoints();

    // Gerar código de confirmação
    const generateConfirmationCode = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `REC-${timestamp}-${random}`.toUpperCase();
    };

    // Copiar código para clipboard
    const copyCodeToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(confirmationCode);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar código:', err);
        }
    };

    // Countdown para confirmação automática (demo)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isWaitingConfirmation && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (isWaitingConfirmation && countdown === 0) {
            // Confirmar automaticamente após 20 segundos
            confirmRecycling();
        }
        return () => clearTimeout(timer);
    }, [isWaitingConfirmation, countdown]);

    const handleMaterialSelect = (material: typeof materials[0]) => {
        setFormData(prev => ({
            ...prev,
            material: material.name,
            pointsPerUnit: material.points,
            weightUnit: material.unit === 'litro' ? 'kg' : 'kg'
        }));
        setCurrentStep(2);
    };

    const handleSubmit = async () => {
        if (!formData.material || !formData.weight || !formData.location) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        setIsSubmitting(true);

        // Gerar código de confirmação
        const code = generateConfirmationCode();
        setConfirmationCode(code);

        // Simular envio para backend
        setTimeout(() => {
            setIsSubmitting(false);
            setIsWaitingConfirmation(true);
            setCurrentStep(4); // Ir para tela de aguardando confirmação
            setCountdown(20); // Reset countdown
        }, 2000);
    };

    const confirmRecycling = async () => {
        try {
            // Garantir que os dados sejam enviados com precisão
            const pointsCalculated = calculateDetailedPoints();

            const recyclingData = {
                material: formData.material,
                weight: parseFloat(parseFloat(formData.weight).toFixed(2)), // Garantir 2 casas decimais
                weightUnit: formData.weightUnit,
                location: formData.location,
                pointsPerUnit: selectedMaterial?.points || 0,
                // Dados adicionais para o backend
                totalPoints: parseFloat(pointsCalculated.finalPoints.toFixed(2)),
                basePoints: parseFloat(pointsCalculated.basePoints.toFixed(2)),
                bonusPoints: parseFloat((pointsCalculated.materialBonus + pointsCalculated.weightBonus + pointsCalculated.locationBonus).toFixed(2)),
                confirmationCode: confirmationCode,
                locationId: selectedLocation?.id || '',
                timestamp: new Date().toISOString()
            };

            console.log('Enviando dados para o backend:', recyclingData);

            const result = await addPoints(recyclingData);

            if (result && typeof result === 'object' && 'success' in result && result.success) {
                setIsWaitingConfirmation(false);
                setCurrentStep(5); // Tela de sucesso
                setTimeout(() => {
                    onSuccess(recyclingData.totalPoints);
                    handleClose();
                }, 3000);
            } else {
                alert(`Erro: ${(result as any).error || 'Erro desconhecido'}`);
            }
        } catch (error: any) {
            console.error('Erro ao confirmar reciclagem:', error);
            alert(`Erro: ${error.message}`);
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        setFormData({
            material: '',
            weight: '',
            weightUnit: 'kg',
            location: '',
            pointsPerUnit: 10
        });
        setIsSubmitting(false);
        setIsWaitingConfirmation(false);
        setConfirmationCode('');
        setCodeCopied(false);
        setCountdown(20);
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                            <Recycle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Nova Reciclagem</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {currentStep <= 3 ? `Passo ${currentStep} de 3` :
                                    currentStep === 4 ? 'Aguardando Confirmação' : 'Concluído'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((currentStep / 5) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {/* Step 1: Material Selection */}
                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                                <Package className="w-5 h-5 text-green-500" />
                                <span>Selecione o Material</span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {materials.map((material, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleMaterialSelect(material)}
                                        className="p-4 cursor-pointer border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 text-center group hover:scale-105"
                                    >
                                        <div className={`w-12 h-12 rounded-full ${material.bgColor} text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                                            {material.icon}
                                        </div>
                                        <div className="font-medium text-sm mb-1">{material.name}</div>
                                        <div className={`text-xs ${material.color} font-bold mb-1`}>
                                            {material.points.toFixed(2)} pts/{material.unit}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            {material.description}
                                        </div>
                                        {material.multiplier !== 1.0 && (
                                            <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                                Bônus: +{Math.round((material.multiplier - 1) * 100)}%
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Weight Input */}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                                <Weight className="w-5 h-5 text-blue-500" />
                                <span className='text-white'>Quantidade de {formData.material}</span>
                            </h3>

                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-6">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full ${selectedMaterial?.bgColor} text-white flex items-center justify-center`}>
                                        {selectedMaterial?.icon}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{formData.material}</div>
                                        <div className={`text-sm ${selectedMaterial?.color} font-bold`}>
                                            {selectedMaterial?.points.toFixed(2)} pontos por {selectedMaterial?.unit}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {selectedMaterial?.description}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Peso/Quantidade
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={formData.weight}
                                            onChange={(e) => {
                                                const cleanValue = handleWeightInput(e.target.value);
                                                setFormData(prev => ({ ...prev, weight: cleanValue }));
                                            }}
                                            placeholder="Ex: 2,75 ou 2.75"
                                            className="flex-1 text-white placeholder:text-white px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                                        />
                                        <select
                                            value={formData.weightUnit}
                                            onChange={(e) => setFormData(prev => ({ ...prev, weightUnit: e.target.value as 'kg' | 'g' }))}
                                            className="px-4 py-3 text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                                        >
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                        </select>
                                    </div>

                                    {/* Dica de formatação */}
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        💡 Você pode usar vírgula ou ponto para decimais (ex: 2,5 ou 2.5)
                                    </div>

                                    {/* Validação visual */}
                                    {formData.weight && (normalizeNumber(formData.weight) <= 0) && (
                                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            Por favor, insira um peso válido maior que 0
                                        </div>
                                    )}
                                </div>

                                {formData.weight && pointsCalculation.finalPoints > 0 && (
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                Cálculo Detalhado
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            {pointsCalculation.breakdown.map((item, index) => (
                                                <div key={index} className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">{item.label}:</span>
                                                    <span className={`font-semibold ${item.color}`}>
                                                        +{formatNumberForDisplay(item.value)} pts
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-gray-800 dark:text-gray-200">Total:</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                        {formatNumberForDisplay(pointsCalculation.finalPoints)} pts
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="px-6 py-3 text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!formData.weight}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location Selection */}
                    {currentStep === 3 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-purple-500" />
                                <span className='text-white'>Local de Reciclagem</span>
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Selecione o ponto de coleta
                                    </label>
                                    <div className="space-y-2">
                                        {locations.map((location, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setFormData(prev => ({ ...prev, location: location.name }))}
                                                className={`w-full cursor-pointer text-white p-3 text-left border-2 rounded-lg transition-all duration-200 ${formData.location === location.name
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center">
                                                            <MapPin className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium">{location.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                ID: {location.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {location.bonus > 1.0 && (
                                                        <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-semibold">
                                                            +{Math.round((location.bonus - 1) * 100)}% bônus
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview final dos pontos com localização */}
                                {formData.weight && formData.location && (
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                        <div className="text-center">
                                            <div className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                                                Total Final com Localização
                                            </div>
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {pointsCalculation.finalPoints.toFixed(2)} pontos
                                            </div>
                                            {selectedLocation && selectedLocation.bonus > 1.0 && (
                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                    Incluindo bônus de localização (+{Math.round((selectedLocation.bonus - 1) * 100)}%)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="px-6 cursor-pointer text-white py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.location || isSubmitting}
                                        className="flex-1 cursor-pointer px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Gerando código...</span>
                                            </>
                                        ) : (
                                            <>
                                                <QrCode className="w-4 h-4" />
                                                <span>Gerar Código de Confirmação</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Waiting for Confirmation */}
                    {currentStep === 4 && (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-10 h-10 text-white animate-pulse" />
                            </div>

                            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                                Código Gerado!
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Apresente este código no local de coleta junto com seus materiais
                            </p>

                            {/* Código de Confirmação */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        Código de Confirmação
                                    </span>
                                </div>

                                <div className="text-2xl font-mono font-bold text-blue-800 dark:text-blue-200 mb-3 tracking-wider">
                                    {confirmationCode}
                                </div>

                                <button
                                    onClick={copyCodeToClipboard}
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                    {codeCopied ? (
                                        <>
                                            <CheckCheck className="w-4 h-4" />
                                            <span>Copiado!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Copiar Código</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Informações do pedido */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 text-left">
                                <h4 className="font-semibold mb-3 text-white">Detalhes da Reciclagem:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className='text-white'>Material:</span>
                                        <span className="font-medium text-white">{formData.material}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-white'>Quantidade:</span>
                                        <span className="font-medium text-white">{formData.weight}{formData.weightUnit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-white'>Local:</span>
                                        <span className="font-medium text-white">{selectedLocation?.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-white'>Pontos finais:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            {pointsCalculation.finalPoints.toFixed(2)} pts
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Countdown para demo */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        Modo Demo
                                    </span>
                                </div>
                                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Confirmação automática em: <strong>{countdown}s</strong>
                                </div>
                                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                    (Na versão real, a confirmação vem do ponto de coleta)
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {currentStep === 5 && (
                        <div className="text-center py-8 relative z-20">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                Reciclagem Confirmada!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Parabéns! Você ganhou <strong>{pointsCalculation.finalPoints.toFixed(2)} pontos</strong> reciclando {formData.weight}{formData.weightUnit} de {formData.material}
                            </p>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                <div className="text-sm text-green-800 dark:text-green-200">
                                    Os pontos foram creditados em sua conta!
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                Fechando automaticamente...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecyclingModal;