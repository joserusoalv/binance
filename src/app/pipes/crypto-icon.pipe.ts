import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cryptoIcon',
  standalone: true,
})
export class CryptoIconPipe implements PipeTransform {
  // CoinCap symbols are generally lowercase
  private readonly BASE_URL = 'https://assets.coincap.io/assets/icons';

  transform(symbol: string): string {
    if (!symbol) return '';

    // Strip USDT/BUSD/USDC if present to get the base asset
    // Simple approach: remove typical quote assets if they are at the end
    // Or just rely on the fact that for this app we know it's USDT pairs mostly.

    let base = symbol.toUpperCase();
    if (base.endsWith('USDT')) {
      base = base.replace('USDT', '');
    }

    return `${this.BASE_URL}/${base.toLowerCase()}@2x.png`;
  }
}
