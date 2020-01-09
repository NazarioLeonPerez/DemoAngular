import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autoregister, Resource, Service } from '../../shared/ngx-jsonapi';
import { environment } from '../../../environments/environment';

export class WebSaleDetails {
  productName: string;
  productDescription: string;

  gridRho: boolean;
  gridNig: boolean;
  gridMet: boolean;

  minStockMoz: number;
  minStockRho: number;
  minStockNig: number;
  minStockMet: number;

  mgMoz: number;
  mgRho: number;
  mgNig: number;
  mgMet: number;

  miMoz: number;
  miRho: number;
  miNig: number;
  miMet: number;

  moMoz: number;
  moRho: number;
  moNig: number;
  moMet: number;

  stockRho: number;
  stockNig: number;
  stockMet: number;
  stockMoz: number;
}

export class WebSaleDetailsDocument extends Resource {
  public attributes: WebSaleDetails;
}

@Injectable()
@Autoregister()
export class WebSaleDetailsService extends Service<WebSaleDetailsDocument>  {

  constructor(private http: HttpClient) { super(); }

  public resource = WebSaleDetailsDocument;
  public type = 'webSaleDetails';
  protected path = 'web-sale-details';

  public setMultiskuValues(multiSku: any) {
    return this.http.post(`${environment.apiUrl}/stores/web/web-sales/multisku`, multiSku);
  }
}
