import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearTarjeta',
  standalone: true
})
export class FormatearTarjetaPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.slice(0, -4).replace(/./g, '*') + value.slice(-4);
  }
}
