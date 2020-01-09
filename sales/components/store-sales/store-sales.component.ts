import { Component, Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DocumentCollection } from "../../../shared/ngx-jsonapi";
import { of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ProductsService } from "../../../gioiapura";
import { ContentPanelService } from "../../../layout/default-layout";
import { BaseComponent } from "../../../shared";
import { StoreSaleDocument, StoreSalesService } from "../../services/store-sales.service";
import { StoreSalesFilterEvent } from "../../types";

@Component({
  templateUrl: "./store-sales.component.html",
  styleUrls: []
})
export class StoreSalesComponent extends BaseComponent {

  private _panelService: ContentPanelService;
  private _route: ActivatedRoute;
  private _productService: ProductsService;
  private _storeSalesService: StoreSalesService;

  public constructor(protected injector: Injector) {
    super(injector);

    this._panelService = injector.get(ContentPanelService);
    this._route = injector.get(ActivatedRoute);
    this._productService = injector.get(ProductsService);
    this._storeSalesService = injector.get(StoreSalesService);

    this.storeName = this._route.snapshot.data["breadcrumb"]
  }

  public documents: DocumentCollection<StoreSaleDocument>;
  public storeName: string;
  public isSaving: boolean = false;

  public filter = ({ documents }: StoreSalesFilterEvent) => {
    this.documents = documents;
  }

  public sort(event: Event, sortBy: string) {
    this._panelService.sort(event, sortBy)
  }

  public toggleGrid(event: Event, document: StoreSaleDocument) {
    event.stopPropagation();
    this.isSaving = true;
    this.subscriptions.onToggleSaleConsignment = this._productService.toggleGrid(this.storeName, document.id)
      .pipe(
        finalize(() => { this.isSaving = false; }),
        catchError(err => { this._panelService.reload(); return of(null); })
      )
      .subscribe();
  }
}
