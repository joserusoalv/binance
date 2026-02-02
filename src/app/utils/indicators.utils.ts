import { CandlestickData } from '../models/binance.models';

export interface IndicatorData {
  time: number;
  value: number;
}

export function calculateSMA(data: CandlestickData[], period: number): IndicatorData[] {
  const sma: IndicatorData[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    sma.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return sma;
}
