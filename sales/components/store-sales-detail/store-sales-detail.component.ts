import { HttpClient } from '@angular/common/http';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDocumentData } from '../../../shared/ngx-jsonapi/interfaces/document';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductStocks } from '../../../gioiapura';
import { BaseComponent } from '../../../shared';
import { StoreSaleDocument, StoreSalesService } from '../../services';
import { StoreSalesDetailEvent } from '../../types';

@Component({
    selector: 'store-sales-detail',
    templateUrl: './store-sales-detail.component.html'
})
export class StoreSalesDetailComponent extends BaseComponent implements OnInit {

    private _http: HttpClient;
    private _storeSalesService: StoreSalesService;
    private _route: ActivatedRoute;

    constructor(protected injector: Injector) {
        super(injector);

        this._storeSalesService = injector.get(StoreSalesService);
        this._route = injector.get(ActivatedRoute);

        this.storeName = this._route.snapshot.data["breadcrumb"]
        this.documentDetail = new ProductStocks();
        this._http = this.injector.get(HttpClient);
    }

    @Input() public document: StoreSaleDocument;

    public documentDetail: ProductStocks;
    public storeName: string;

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.onDocumentDetail = this._storeSalesService.events.onDocumentDetail.subscribe(
            ({ document }: StoreSalesDetailEvent) => {
                if (this.document.id === document.id) {
                    this.subscriptions.onGetDetail = this.loadSalesDetail(document.id).subscribe(data => {
                        let document = <IDocumentData<StoreSaleDocument>>data;
                        if (document && document.meta) { this.documentDetail = document.meta.stocks; }
                    });
                }
            });
    }

    private loadSalesDetail(productId: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUrl}/products/${productId}`);
    }
}
