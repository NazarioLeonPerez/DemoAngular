import { Component, Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DocumentCollection } from "../../../shared/ngx-jsonapi";
import { of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ContentPanelService } from "../../../layout/default-layout";
import { BaseComponent } from "../../../shared";
import { WebSaleDocument, WebSalesService } from "../../services";
import { WebSalesFilterEvent } from "../../types";
import { ProductsService } from "../../../gioiapura";

@Component({
  templateUrl: './web-sales.component.html',
  styleUrls: []
})
export class WebSalesComponent extends BaseComponent {

  private _panelService: ContentPanelService;
  private _route: ActivatedRoute;
  private _productService: ProductsService;
  private _webSalesService: WebSalesService;

  public constructor(protected injector: Injector) {
    super(injector);

    this._panelService = injector.get(ContentPanelService);
    this._route = injector.get(ActivatedRoute);
    this._productService = injector.get(ProductsService);
    this._webSalesService = injector.get(WebSalesService);

    this.storeName = this._route.snapshot.data["breadcrumb"]
  }

  public documents: DocumentCollection<WebSaleDocument>;
  public storeName: string;
  public isSaving: boolean = false;

  public filter = ({ documents }: WebSalesFilterEvent) => {
    this.documents = documents;
  }

  public sort(event: Event, sortBy: string) {
    this._panelService.sort(event, sortBy)
  }

  public toggleSaleConsignment(event: Event, document: WebSaleDocument) {
    event.stopPropagation();
    this.isSaving = true;
    this.subscriptions.onToggleSaleConsignment = this._productService.toggleSaleConsignment(document.id)
      .pipe(
        finalize(() => { this.isSaving = false; }),
        catchError(err => { this._panelService.reload(); return of(null); })
      )
      .subscribe();
  }
}
