import { Commodity, Location, PriceData, ChartData, LocationType } from './types';

export const locations: Location[] = [
  // National
  { id: 'nat-1', name: 'Indonesia', type: 'Nasional' },
  
  // Provinces/States
  { id: 'prov-1', name: 'Lampung', type: 'Provinsi', parentId: 'nat-1' },
  
  // Cities
  { id: 'city-1', name: 'Lampung Barat', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-2', name: 'Lampung Selatan', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-3', name: 'Lampung Tengah', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-4', name: 'Lampung Timur', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-5', name: 'Lampung Utara', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-6', name: 'Mesuji', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-7', name: 'Pesawaran', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-8', name: 'Pesisir Barat', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-9', name: 'Pringsewu', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-10', name: 'Tanggamus', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-11', name: 'Tulang Bawang', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-12', name: 'Tulang Bawang Barat', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-13', name: 'Way Kanan', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-14', name: 'Kota Bandar Lampung', type: 'Kabupaten', parentId: 'prov-1' },
  { id: 'city-15', name: 'Kota Metro', type: 'Kabupaten', parentId: 'prov-1' },
  
  // Markets
  { id: 'market-1', name: 'PASAR PASIR GINTUNG', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-2', name: 'PASAR KANGKUNG', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-3', name: 'PASAR PANJANG', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-4', name: 'PASAR WAY HALIM', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-5', name: 'PASAR TUGU', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-6', name: 'Pasar Klaten', type: 'Pasar', parentId: 'city-9' },
  { id: 'market-7', name: 'Pasar SMEP', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-8', name: 'Pasar Bambu Kuning', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-9', name: 'Pasar Cimeng', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-10', name: 'Pasar Tamin', type: 'Pasar', parentId: 'city-14' },
  { id: 'market-11', name: 'Pasar Way Kandis', type: 'Pasar', parentId: 'city-14' },
];

export const commodities: Commodity[] = [
  { id: 'com-1', name: 'Beras Medium Rojolele', category: 'Beras', unit: 'ltr' },
  { id: 'com-2', name: 'Beras Premium Raja Udang', category: 'Beras', unit: 'ltr' },
  { id: 'com-3', name: 'Beras Udang 2 Koki', category: 'Beras', unit: 'ltr' },
  { id: 'com-4', name: 'Beras Mangga Apel', category: 'Beras', unit: 'ltr' },
  { id: 'com-5', name: 'Beras Premium Sari Buah', category: 'Beras', unit: 'ltr' },
  { id: 'com-6', name: 'Beras Medium AK', category: 'Beras', unit: 'ltr' },
  { id: 'com-7', name: 'Beras Premium Dua Koki', category: 'Beras', unit: 'ltr' },
  { id: 'com-8', name: 'Ikan Segar Kembung', category: 'Ikan', unit: 'Kg' },
  { id: 'com-9', name: 'Ikan nila', category: 'Ikan', unit: 'Kg' },
  { id: 'com-10', name: 'Ikan Mas', category: 'Ikan', unit: 'Kg' },
  { id: 'com-11', name: 'Ikan lele', category: 'Ikan', unit: 'Kg' },
  { id: 'com-12', name: 'Ikan Patin', category: 'Ikan', unit: 'Kg' },
];

const generatePriceData = (): PriceData[] => {
  const priceData: PriceData[] = [];
  
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  commodities.forEach(commodity => {
    locations.forEach(location => {
      let basePrice = 0;
      switch (commodity.id) {
        case 'com-1': basePrice = 750; break;
        case 'com-2': basePrice = 450; break;
        case 'com-3': basePrice = 1200; break;
        case 'com-4': basePrice = 1800; break;
        case 'com-5': basePrice = 180; break;
        case 'com-6': basePrice = 90; break;
        case 'com-7': basePrice = 25; break;
        case 'com-8': basePrice = 1900; break;
        case 'com-9': basePrice = 24; break;
        case 'com-10': basePrice = 4; break;
        case 'com-11': basePrice = 75; break;
        case 'com-12': basePrice = 3; break;
        default: basePrice = 100;
      }
      
      const locationMultiplier = 
        location.type === 'Nasional' ? 1.0 :
        location.type === 'Provinsi' ? 1.05 :
        location.type === 'Kabupaten' ? 1.1 : 1.15;
      
      let prevPrice = basePrice * locationMultiplier;
      
      dates.forEach((date, i) => {
        const change = prevPrice * (Math.random() * 0.06 - 0.03);
        const price = prevPrice + change;
        
        priceData.push({
          id: `price-${commodity.id}-${location.id}-${i}`,
          commodityId: commodity.id,
          locationId: location.id,
          date,
          price,
          previousPrice: prevPrice,
          change,
          changePercentage: (change / prevPrice) * 100
        });
        
        prevPrice = price;
      });
    });
  });
  
  return priceData;
};

export const priceData = generatePriceData();

export const getFilteredPriceData = (
  commodityId?: string,
  locationId?: string,
  startDate?: string,
  endDate?: string
): PriceData[] => {
  return priceData.filter(item => {
    const matchesCommodity = !commodityId || item.commodityId === commodityId;
    const matchesLocation = !locationId || item.locationId === locationId;
    const matchesDateRange = (!startDate || item.date >= startDate) && 
                             (!endDate || item.date <= endDate);
    
    return matchesCommodity && matchesLocation && matchesDateRange;
  });
};

export const getLocationsByType = (type: string, parentId?: string): Location[] => {
  return locations.filter(location => 
    location.type === type && 
    (!parentId || location.parentId === parentId)
  );
};

export const getLatestPrices = (locationId: string): PriceData[] => {
  const latest: Record<string, PriceData> = {};
  
  const locationPrices = priceData.filter(p => p.locationId === locationId);
  
  commodities.forEach(commodity => {
    const commodityPrices = locationPrices
      .filter(p => p.commodityId === commodity.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (commodityPrices.length > 0) {
      latest[commodity.id] = commodityPrices[0];
    }
  });
  
  return Object.values(latest);
};

export const getChartData = (
  commodityId: string, 
  locationIds: string[]
): ChartData[] => {
  return locationIds.map(locationId => {
    const location = locations.find(l => l.id === locationId);
    const prices = priceData
      .filter(p => p.commodityId === commodityId && p.locationId === locationId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      id: locationId,
      name: location?.name || 'Unknown',
      data: prices.map(p => ({
        date: p.date,
        value: p.price
      }))
    };
  });
};

export const getPriceTrends = (): Record<string, number> => {
  const trends: Record<string, number> = {};
  
  commodities.forEach(commodity => {
    const nationalPrices = priceData
      .filter(p => p.commodityId === commodity.id && p.locationId === 'nat-1')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (nationalPrices.length >= 2) {
      const oldestPrice = nationalPrices[0].price;
      const latestPrice = nationalPrices[nationalPrices.length - 1].price;
      trends[commodity.id] = ((latestPrice - oldestPrice) / oldestPrice) * 100;
    } else {
      trends[commodity.id] = 0;
    }
  });
  
  return trends;
};

export const getPriceDataByLocation = (locationType: LocationType, commodityId: string): PriceData[] => {
  const locationIds = locations
    .filter(loc => loc.type === locationType)
    .map(loc => loc.id);
  
  return locationIds.flatMap(locationId => 
    getLatestPrices(locationId).filter(price => price.commodityId === commodityId)
  );
};
