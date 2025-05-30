import React, { useState, useEffect } from 'react'
import { X, MapPin, Navigation, Clock, Phone } from 'lucide-react'
import type { UserData } from '../hooks/useAuth'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getCoords } from '../utils/geocoding'
import { point as turfPoint, buffer as turfBuffer, bbox as turfBbox } from '@turf/turf';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = defaultIcon

interface MapModalProps {
    isOpen: boolean
    onClose: () => void
    userData: UserData | null
    darkMode?: boolean
}

interface RecyclingPoint {
    id: number
    name: string
    address: string
    type: string
    hours: string
    phone: string
    materials: string[]
    distance: string
    locationId: string
    bonus: number
}

// Função para gerar distância fixa baseada no ID do local
const generateFixedDistance = (locationId: string): string => {
    // Usar o ID como seed para gerar sempre a mesma distância
    const seed = locationId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)

    // Usar o seed para gerar um número entre 0.5 e 5.0 km
    const distance = 0.5 + (seed % 1000) / 1000 * 4.5

    return distance.toFixed(1)
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, userData }) => {
    if (!isOpen) return null

    // MESMOS LOCAIS DO RECYCLING MODAL
    const locations = [
        { name: 'Supermercado Extra - Centro', id: 'EXTRA_001', bonus: 1.1 },
        { name: 'Shopping Iguatemi', id: 'SHOP_002', bonus: 1.15 },
        { name: 'Posto Shell - Avenida Brasil', id: 'SHELL_003', bonus: 1.0 },
        { name: 'Escola Municipal José da Silva', id: 'ESCOLA_004', bonus: 1.25 },
        { name: 'Ponto de Coleta - Praça Central', id: 'PRACA_005', bonus: 1.05 },
        { name: 'Farmácia São João', id: 'FARM_006', bonus: 1.0 }
    ]

    const getRecyclingPoints = (city: string): RecyclingPoint[] => {
        const materialsByType = {
            'EXTRA_001': ['Plástico', 'Metal', 'Papel'],
            'SHOP_002': ['Papel', 'Plástico', 'Vidro', 'Eletrônicos'],
            'SHELL_003': ['Óleo de Cozinha', 'Plástico'],
            'ESCOLA_004': ['Papel', 'Plástico', 'Eletrônicos'],
            'PRACA_005': ['Papel', 'Plástico', 'Metal', 'Vidro', 'Orgânicos'],
            'FARM_006': ['Eletrônicos', 'Pilhas', 'Baterias', 'Medicamentos']
        }

        const hoursByType = {
            'EXTRA_001': '07:00 - 22:00',
            'SHOP_002': '10:00 - 22:00',
            'SHELL_003': '24h',
            'ESCOLA_004': '08:00 - 17:00',
            'PRACA_005': '06:00 - 18:00',
            'FARM_006': '08:00 - 20:00'
        }

        const typesByLocation = {
            'EXTRA_001': 'Parceiro',
            'SHOP_002': 'Parceiro',
            'SHELL_003': 'Especializado',
            'ESCOLA_004': 'Educacional',
            'PRACA_005': 'Geral',
            'FARM_006': 'Especializado'
        }

        const addressByLocation = {
            'EXTRA_001': 'Centro da cidade',
            'SHOP_002': 'Av. das Nações, 123',
            'SHELL_003': 'Avenida Brasil, 456',
            'ESCOLA_004': 'Rua da Educação, 789',
            'PRACA_005': 'Praça Central, s/n',
            'FARM_006': 'Rua da Saúde, 321'
        }

        return locations.map((location, index) => ({
            id: index + 1,
            name: location.name,
            address: `${addressByLocation[location.id as keyof typeof addressByLocation]}, ${city}`,
            type: typesByLocation[location.id as keyof typeof typesByLocation],
            hours: hoursByType[location.id as keyof typeof hoursByType],
            phone: `(11) 99999-000${index + 1}`,
            materials: materialsByType[location.id as keyof typeof materialsByType],
            distance: generateFixedDistance(location.id), // Usar distância fixa
            locationId: location.id,
            bonus: location.bonus
        }))
    }

    const recyclingPoints = userData ? getRecyclingPoints(userData.city) : []

    const [cityCenter, setCityCenter] = useState<{ lat: number; lng: number } | null>(null)
    const [randomPoints, setRandomPoints] = useState<
        Array<{ lat: number; lng: number; data: RecyclingPoint; distance: number }>
    >([])
    // Adicionar um estado para controlar a chave do mapa (força re-render)
    const [mapKey, setMapKey] = useState<string>('')

    const addressByLocation = {
        'EXTRA_001': 'Centro da cidade',
        'SHOP_002': 'Av. das Nações, 123',
        'SHELL_003': 'Avenida Brasil, 456',
        'ESCOLA_004': 'Rua da Educação, 789',
        'PRACA_005': 'Praça Central, s/n',
        'FARM_006': 'Rua da Saúde, 321'
    }

    useEffect(() => {
        if (!isOpen) {
            setRandomPoints([]);
            setCityCenter(null);
            return;
        }

        async function generatePoints() {
            if (!userData?.city || !userData?.state) return;

            try {
                // 1. Geocode user's full address
                const fullAddress = `${userData.city}, ${userData.state}`;
                const { lat: userLat, lng: userLng } = await getCoords(fullAddress);
                setCityCenter({ lat: userLat, lng: userLng });

                // 2. Create a 5km buffer around user point
                const userGeo = turfPoint([userLng, userLat]);
                const area = turfBuffer(userGeo, 5, { units: 'kilometers' });

                // 3. Generate RANDOM points in the polygon a cada abertura
                if (!area) return;
                const [minX, minY, maxX, maxY] = turfBbox(area);
                const pts = [];

                // Gerar pontos aleatórios a cada abertura
                for (let i = 0; i < Math.min(locations.length, 6); i++) {
                    const location = locations[i];
                    let attempts = 0;
                    let validPoint = null;

                    // Tentar até 10 vezes encontrar um ponto válido dentro da área
                    while (attempts < 10 && !validPoint) {
                        const lon = minX + Math.random() * (maxX - minX);
                        const lat = minY + Math.random() * (maxY - minY);
                        const p = turfPoint([lon, lat]);

                        if (booleanPointInPolygon(p, area)) {
                            validPoint = { point: p, location };
                        } else {
                            attempts++;
                        }
                    }

                    // Se não encontrou um ponto válido, colocar próximo ao centro
                    if (!validPoint) {
                        const offsetLon = userLng + (Math.random() - 0.5) * 0.05; // ±0.025 degrees
                        const offsetLat = userLat + (Math.random() - 0.5) * 0.05;
                        validPoint = { point: turfPoint([offsetLon, offsetLat]), location };
                    }

                    pts.push(validPoint);
                }

                // 4. Enriquecer com dados dos pontos de reciclagem
                const enriched = pts.map(({ point: p, location }, index) => {
                    const [lng, lat] = p.geometry.coordinates;
                    const address = `${addressByLocation[location.id as keyof typeof addressByLocation]}, ${userData.city}`;
                    const recyclingPoint = recyclingPoints.find(point => point.locationId === location.id);

                    // Usar a distância fixa baseada no ID (não muda)
                    const fixedDistance = parseFloat(generateFixedDistance(location.id));

                    return {
                        lat,
                        lng,
                        data: recyclingPoint || {
                            id: index + 1,
                            name: location.name,
                            address,
                            type: 'Geral',
                            hours: '08:00 - 18:00',
                            phone: `(11) 99999-000${index + 1}`,
                            materials: ['Papel', 'Plástico'],
                            distance: fixedDistance.toFixed(1),
                            locationId: location.id,
                            bonus: location.bonus
                        },
                        distance: fixedDistance,
                    };
                });

                setRandomPoints(enriched);
                // Gerar nova chave para forçar re-render do mapa
                setMapKey(`${Date.now()}-${Math.random()}`);
            } catch (error) {
                console.error('Erro ao gerar pontos do mapa:', error);
            }
        }

        generatePoints();
    }, [isOpen, userData?.city, userData?.state]) // Manter dependências mínimas

    // Fechar modal ao clicar no backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Pontos de Coleta
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {userData?.city}, {userData?.state}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:h-[500px]">
                    {/* Real Map */}
                    {cityCenter && randomPoints.length > 0 ? (
                        <div className="w-full lg:flex-1 h-[300px] lg:h-auto">
                            <MapContainer
                                center={[cityCenter.lat, cityCenter.lng]}
                                zoom={13}
                                className="w-full h-full"
                                key={mapKey} // Usar a chave dinâmica para forçar re-render
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {randomPoints.map((pt, index) => (
                                    <Marker key={`marker-${index}-${mapKey}`} position={[pt.lat, pt.lng]}>
                                        <Popup>
                                            <div className="font-semibold">{pt.data.name}</div>
                                            <div className="text-sm">{pt.data.address}</div>
                                            <div className="text-sm font-medium text-blue-600">
                                                {pt.distance.toFixed(1)} km de você
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                {pt.data.materials.join(', ')}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    ) : (
                        <div className="w-full lg:flex-1 h-[300px] lg:h-auto flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            <div className="text-center">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-gray-600 dark:text-gray-400">Carregando mapa...</p>
                            </div>
                        </div>
                    )}

                    {/* Lista de Pontos */}
                    <div className="w-full lg:w-96 lg:border-l border-t lg:border-t-0 border-gray-200 dark:border-gray-700 max-h-[400px] lg:max-h-none overflow-y-auto">
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                                Pontos Próximos
                            </h3>
                            <div className="space-y-4">
                                {recyclingPoints.map((point) => (
                                    <div key={point.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {point.name}
                                            </h4>
                                            <div className="flex text-center flex-col space-y-1">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${point.type === 'Geral' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                    point.type === 'Parceiro' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        point.type === 'Especializado' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                            point.type === 'Educacional' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                                'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {point.type}
                                                </span>
                                                {point.bonus > 1.0 && (
                                                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                                        +{Math.round((point.bonus - 1) * 100)}% bônus
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span>{point.address}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Navigation className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                                    {point.distance} km de distância
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 flex-shrink-0" />
                                                <span>{point.hours}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span>{point.phone}</span>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                                                Aceita:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {point.materials.map((material, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                                    >
                                                        {material}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            className="w-full cursor-pointer mt-3 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                                            type="button"
                                            onClick={() => {
                                                // Simular abertura do Google Maps
                                                const address = encodeURIComponent(point.address);
                                                window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
                                            }}
                                        >
                                            Como Chegar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapModal