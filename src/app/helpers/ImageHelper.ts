import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Image } from '../models/Image';

@Injectable()
export class ImageHelper {

  constructor() {
  }

  public getImage(image: Image, imageUrl: string): string {
    if (image) {
        return `data:image/gif;base64,${image}`;
    } else {
        return `${environment.baseUrl}${imageUrl}`;
    }
  }
}
