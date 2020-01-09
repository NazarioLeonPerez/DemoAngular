import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '@angular/router';
import { Autoregister, Resource, Service } from '../../shared/ngx-jsonapi';
import { environment } from '../../../environments/environment';
import { WebSalesEvents } from '../types';

export class WebSale {
    urlImage: string = null;
    sku: string = null;
    brandName: string = null;
    finalPrice: number = null;
    basePrice: number = null;
    discount: number = null;
    mg: number = null;
    mo: number = null;
    mi: number = null;
    stock: number = null;
    webSold: number = null;
    storeSold: number = null;
    sold: number = null;
    excess: number = null;
    storeExcess: number = null;
    picking: number = null;
    new: boolean = null;
    grid: boolean = null;
    scarse: boolean = null;
    outlet: boolean = null;
    offer: boolean = null;
    outOfProduction: boolean = null;
    measure: string = null;
    lastLoadedDate: string = null;
    lastOrderDate: string = null;
    dateCreated: string = null;
    saleConsignment: boolean = null;
    saleConsignmentDate: string = null;
    minimumStock: number = null;
    soldInOffer: number = null;
}

export class WebSaleDocument extends Resource {
    public attributes: WebSale;
}

@Injectable()
@Autoregister()
export class WebSalesService extends Service<WebSaleDocument>  {

    constructor(private http: HttpClient) { super(); }

    public resource = WebSaleDocument;
    public type = 'webSales';
    public events: WebSalesEvents = new WebSalesEvents();
    protected path = 'web-sales';

    public ExpandDocumentDetail(document: WebSaleDocument, event?: Event) {
        this.events.onDocumentDetail.emit({ event, document });
    }

    public setMultiskuValues(multiSku: any) {
        return this.http.post(`${environment.apiUrl}/stores/web/web-sales/multisku`, multiSku);
    }
}
