/**
 * Geocoding utility usando a API Nominatim do OpenStreetMap.
 * Retorna latitude, longitude e bounding box para uma query.
 */
export async function getCoords(query: string): Promise<{
    lat: number;
    lng: number;
    bounds: {
        minLat: number;
        minLng: number;
        maxLat: number;
        maxLng: number;
    };
}> {
    // Chama o Nominatim
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}&addressdetails=0&limit=1`
    );
    if (!res.ok) {
        throw new Error(`Erro de geocoding: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data || data.length === 0) {
        throw new Error(`Nenhum resultado para: ${query}`);
    }
    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    // boundingbox: [south, north, west, east]
    const [south, north, west, east] = result.boundingbox.map(parseFloat);
    return {
        lat,
        lng,
        bounds: {
            minLat: south,
            maxLat: north,
            minLng: west,
            maxLng: east,
        },
    };
}