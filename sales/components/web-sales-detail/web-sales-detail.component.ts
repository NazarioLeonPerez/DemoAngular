import { HttpClient } from '@angular/common/http';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '../../../shared';
import { WebSaleDetailsDocument, WebSaleDetailsService, WebSaleDocument, WebSalesService } from '../../services';
import { WebSalesDetailEvent } from '../../types';

@Component({
    selector: 'web-sales-detail',
    templateUrl: './web-sales-detail.component.html'
})
export class WebSalesDetailComponent extends BaseComponent implements OnInit {

    private _http: HttpClient;
    private _webSalesService: WebSalesService;
    private _webSaleDetailsService: WebSaleDetailsService;
    private _route: ActivatedRoute;

    constructor(protected injector: Injector) {
        super(injector);

        this._webSalesService = injector.get(WebSalesService);
        this._route = injector.get(ActivatedRoute);

        this.documentDetail = new WebSaleDetailsDocument();
        this._http = this.injector.get(HttpClient);
        this._webSaleDetailsService = this.injector.get(WebSaleDetailsService);
    }

    @Input() public document: WebSaleDocument;

    public documentDetail: WebSaleDetailsDocument;
    public isSaving: boolean;

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.onDocumentDetail = this._webSalesService.events.onDocumentDetail.subscribe(
            ({ document }: WebSalesDetailEvent) => {
                if (this.document.id === document.id) {
                    this.subscriptions.onGetDetail = this.loadSalesDetail(document.id)
                        .subscribe(data => {
                            this.documentDetail = data;
                        });
                }
            });
    }

    public save() {
        this.isSaving = true;
        this.subscriptions.onDocumentSaving = this.documentDetail.save({ beforepath: `stores/web` })
            .pipe(finalize(() => { this.isSaving = false }))
            .subscribe();
    }

    private loadSalesDetail(productId: string): Observable<WebSaleDetailsDocument> {
        return this._webSaleDetailsService.get(productId, { beforepath: `stores/web` });
    }
}
