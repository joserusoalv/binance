import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
  host: {
    '(error)': 'onError()',
  },
})
export class ImageFallbackDirective {
  private readonly el = inject(ElementRef<HTMLImageElement>);

  // Simple gray circle SVG (URL encoded for safety and readability)
  private readonly DEFAULT_ICON =
    'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20fill%3D%22%232b3139%22%20stroke%3D%22%23474d57%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%20text-anchor%3D%22middle%22%20fill%3D%22%23848e9c%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%3E%3F%3C%2Ftext%3E%3C%2Fsvg%3E';

  appImageFallback = input<string>('', { alias: 'appImageFallback' });

  onError() {
    this.el.nativeElement.src = this.appImageFallback() || this.DEFAULT_ICON;
    // Prevent infinite loop if fallback also fails
    this.el.nativeElement.onerror = null;
  }
}
