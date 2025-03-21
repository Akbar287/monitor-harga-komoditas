
export type LocationType = 'Nasional' | 'Provinsi' | 'Kabupaten' | 'Pasar';
export type TimeRangeType = 'Hari' | 'Minggu' | 'Bulan' | 'Kustom';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  parentId?: string;
}

export interface Commodity {
  id: string;
  name: string;
  category: string;
  unit: string;
  icon?: string;
}

export interface PriceData {
  id: string;
  commodityId: string;
  locationId: string;
  date: string;
  price: number;
  previousPrice?: number;
  change?: number;
  changePercentage?: number;
}

export interface FilterState {
  locationType: LocationType;
  locationId?: string;
  commodityId?: string;
  timeRangeType: TimeRangeType;
  dateRange: [Date | null, Date | null];
}

export interface PriceDataPoint {
  date: string;
  value: number;
}

export interface ChartData {
  id: string;
  name: string;
  data: PriceDataPoint[];
}
