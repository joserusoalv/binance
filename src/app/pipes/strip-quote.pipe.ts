import { Pipe, PipeTransform } from '@angular/core';
import { APP_CONFIG } from '../constants/app.constants';

@Pipe({
  name: 'stripQuote',

  pure: true,
})
export class StripQuotePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    return value.replace(APP_CONFIG.QUOTE_ASSET, '');
  }
}
