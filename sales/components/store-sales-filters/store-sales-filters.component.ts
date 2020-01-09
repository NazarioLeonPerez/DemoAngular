import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { DocumentCollection } from "../../../shared/ngx-jsonapi";
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from "../../../../environments/environment";
import { BaseFilters, NavigableComponent } from "../../../shared";
import { HttpCustomEncoder } from '../../../shared/Types';
import { StoreSalesService } from '../../services';
import { SalesFilters, StoreSalesFilterEvent } from "../../types";
import { MultiSkuPickerComponent, MultiskuPickerEvent } from '../multi-sku-picker/multi-sku-picker.component';

@Component({
  selector: "store-sales-filters",
  templateUrl: "./store-sales-filters.component.html",
  styleUrls: []
})
export class StoreSalesFiltersComponent extends NavigableComponent<SalesFilters> implements OnInit {

  private _router: Router;
  private _storeSalesService: StoreSalesService;
  private _http: HttpClient;
  private _datePipe = new DatePipe("it-IT");

  private _multiSku: string;

  constructor(protected injector: Injector) {
    super(injector, SalesFilters);

    this._router = injector.get(Router);
    this._storeSalesService = injector.get(StoreSalesService);
    this._http = injector.get(HttpClient);

    this.storeName = this.route.snapshot.data["breadcrumb"]
  }

  public filterExpanded: boolean = false;

  @ViewChild("multiSku", { static: true }) public multiSku: MultiSkuPickerComponent;

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.onMultiSkuSet = this.multiSku.onSubmit.subscribe(({ textItems }: MultiskuPickerEvent) => this.setMultiSku(textItems));
    this.subscriptions.onMultiSkuUnset = this.multiSku.onClear.subscribe(() => this.setMultiSku(null));
  }

  private setMultiSku(textItems: string) {
    if (!textItems) {
      this.filters.hasMultiSku = false;
      this._multiSku = null;
      return;
    }

    this._multiSku = '\'' + textItems + '\'';
    this.filters.hasMultiSku = true;
    this.filters.p = Date.now(); // Grant querystring changes for send request
  }

  @Output() onFilter = new EventEmitter<StoreSalesFilterEvent>();
  public storeName: string;

  public send() {
    (<BaseFilters>this.filters).page = 1;
    this._router.navigate([], { queryParams: this.filters });
  }

  public clear() {
    this.multiSku.clear();
    this.filters = new SalesFilters();
  }

  public exportingToExcel = false;
  public exportToExcel() {
    if (!this.exportingToExcel) {
      this.exportingToExcel = true;
      this.filters.exportToExcel = true;
      this._router.navigate([], { queryParams: this.filters });
    }
  }

  protected onNavigate(clearedFilters: SalesFilters) {

    if (this._multiSku) {
      this.subscriptions.onSetMultisku =
        this._storeSalesService.setMultiskuValues({ data: { type: "storeSales", attributes: { multiSku: this._multiSku } } }, this.storeName)
        .subscribe();
    }

    if (clearedFilters.exportToExcel) {

      let params: any = {};
      Object.keys(clearedFilters).forEach(key => {
        if (key != 'page' && key != 'size' && key != 'short' && key != 'exportToExcel') {
          const value = (clearedFilters as any)[key];
          params[`filter[${key}]`] = value;
        }
      });

      this.subscriptions.onExcel = this._http
        .get(`${environment.apiUrl}/excel/stores/${this.storeName.toLowerCase()}/store-sales`, {
          responseType: "blob",
          params: new HttpParams({ fromObject: params, encoder: new HttpCustomEncoder() })
        })
        .pipe(
          finalize(() => {
            this.exportingToExcel = false;
            delete this.filters.exportToExcel;
          }),
          catchError(err => { return of(null); })
        )
        .subscribe(data => {
          if (!data) { return; }
          var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          var url = window.URL.createObjectURL(blob);

          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = `venduto_${this.storeName.toLowerCase()}_${this._datePipe.transform(Date.now(), "yyyy_MM_dd_HH_mm_ss")}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        });

      return;
    }

    this.subscriptions.onFilter = this._storeSalesService
      .all({
        sort: [clearedFilters.sort],
        beforepath: `stores/${this.storeName.toLowerCase()}`,
        remotefilter: clearedFilters,
        page: { number: clearedFilters.page || 1, size: clearedFilters.size }
      })
      .subscribe(data => { this.onFilter.emit({ documents: data }); });
  }

}
