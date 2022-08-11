import { Pipe, PipeTransform } from '@angular/core';
import { environment } from "../../../../environments/environment";

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  transform(img: string): string {
    return `${environment.baseUrl}${img}`;
  }
}
