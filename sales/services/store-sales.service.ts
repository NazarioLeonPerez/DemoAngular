import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '@angular/router';
import { Autoregister, Resource, Service } from '../../shared/ngx-jsonapi';
import { StoreSalesEvents } from '../types';
import { environment } from '../../../environments/environment';

export class StoreSale {
  urlImage: string = null;
  sku: string = null;
  brandName: string = null;
  basePrice: number = null;
  mg: number = null;
  mo: number = null;
  mi: number = null;
  stock: number = null;
  sold: number = null;
  webSold: number = null;
  storeSold: number = null;
  excess: number = null;
  new: boolean = null;
  grid: boolean = null;
  scarse: boolean = null;
  outOfProduction: boolean = null;
  measure: string = null;
  productName: string = null;
  lastLoadedDate: string = null;
  lastOrderDate: string = null;
  dateCreated: string = null;
  description: string = null;
  saleConsignment: boolean = null;
  saleConsignmentDate: string = null;
}

export class StoreSaleDocument extends Resource {
  public attributes: StoreSale;
}

@Injectable()
@Autoregister()
export class StoreSalesService extends Service<StoreSaleDocument>  {

  constructor(private http: HttpClient) { super(); }

  public resource = StoreSaleDocument;
  public type = 'storeSales';
  public events: StoreSalesEvents = new StoreSalesEvents();
  protected path = 'store-sales';

  public ExpandDocumentDetail(document: StoreSaleDocument, event?: Event) {
    this.events.onDocumentDetail.emit({ event, document });
  }

  public setMultiskuValues(multiSku: any, storeName: string) {
    return this.http.post(`${environment.apiUrl}/stores/${storeName}/store-sales/multisku`, multiSku);
  }
}
