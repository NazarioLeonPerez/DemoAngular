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
import { WebSalesService } from "../../services";
import { SalesFilters, WebSalesFilterEvent } from "../../types";
import { MultiSkuPickerComponent, MultiskuPickerEvent } from '../multi-sku-picker/multi-sku-picker.component';


@Component({
  selector: "web-sales-filters",
  templateUrl: "./web-sales-filters.component.html",
  styleUrls: []
})
export class WebSalesFiltersComponent extends NavigableComponent<SalesFilters> implements OnInit {

  private _router: Router;
  private _webSalesService: WebSalesService;
  private _http: HttpClient;
  private _datePipe = new DatePipe("it-IT");

  constructor(protected injector: Injector) {
    super(injector, SalesFilters);

    this._router = injector.get(Router);
    this._webSalesService = injector.get(WebSalesService);
    this._http = injector.get(HttpClient);

    this.storeName = this.route.snapshot.data["breadcrumb"]
  }

  public filterExpanded: boolean = false;
  public clearedFilters: SalesFilters;
  public skuList: string;

  @ViewChild("multiSku", { static: true }) public multiSku: MultiSkuPickerComponent;

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.onMultiSkuSet = this.multiSku.onSubmit.subscribe(({ textItems }: MultiskuPickerEvent) => this.setMultiSku(textItems));
    this.subscriptions.onMultiSkuUnset = this.multiSku.onClear.subscribe(() => this.setMultiSku(null));
  }

  private setMultiSku(textItems: string) {
    if (!textItems) {
      this.filters.hasMultiSku = false;
      this.skuList = null;
      return;
    }

    this.skuList = '\'' + textItems + '\'';
    this.filters.hasMultiSku = true;
    this.filters.p = Date.now(); // Grant querystring changes for send request
  }

  @Output() onFilter = new EventEmitter<WebSalesFilterEvent>();
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
  public exportTotalSalesToExcel() {
    if (!this.exportingToExcel) {
      this.exportingToExcel = true;
      this.filters.exportTotalSalesToExcel = true;
      this._router.navigate([], { queryParams: this.filters });
    }
  }

  public exportStoreOrderToExcel() {
    if (!this.exportingToExcel) {
      this.exportingToExcel = true;
      this.filters.exportStoreOrderToExcel = true;
      this._router.navigate([], { queryParams: this.filters });
    }
  }

  public exportReportViewToExcel() {
    if (!this.exportingToExcel) {
      this.exportingToExcel = true;
      this.filters.exportReportViewToExcel = true;
      this._router.navigate([], { queryParams: this.filters });
    }
  }

  protected onNavigate(clearedFilters: SalesFilters) {

    this.clearedFilters = clearedFilters;

    if (this.skuList) {
      this.subscriptions.onSetMultisku = this._webSalesService.setMultiskuValues({ data: { type: "webSales", attributes: { multiSku: this.skuList } } })
        .subscribe();
    }

    if (clearedFilters.exportTotalSalesToExcel || clearedFilters.exportStoreOrderToExcel || clearedFilters.exportReportViewToExcel) {

      let fileName: string;
      if (clearedFilters.exportTotalSalesToExcel) {
        fileName = 'venduto_globale';
      } else if (clearedFilters.exportStoreOrderToExcel) {
        fileName = 'ordine_negozio';
      } else if (clearedFilters.exportReportViewToExcel) {
        fileName = 'vista_report';
      }



      let params: any = {};
      Object.keys(clearedFilters).forEach(key => {
        if (key != 'page' && key != 'size' && key != 'short') {
          const value = (clearedFilters as any)[key];
          params[`filter[${key}]`] = value;
        }
      });

      this.subscriptions.onExcel = this._http
        .get(`${environment.apiUrl}/excel/stores/web/web-sales`, {
          responseType: "blob",
          params: new HttpParams({ fromObject: params, encoder: new HttpCustomEncoder() })
        })
        .pipe(
          finalize(() => {
            this.exportingToExcel = false;
            delete this.filters.exportTotalSalesToExcel;
            delete this.filters.exportStoreOrderToExcel;
            delete this.filters.exportReportViewToExcel;
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
          a.download = `${fileName}_${this._datePipe.transform(Date.now(), "yyyy_MM_dd_HH_mm_ss")}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element

        });

      return;
    }

    if (clearedFilters.dateOfferFrom != null || clearedFilters.dateOfferTo != null) {
      clearedFilters.historicalOffer = clearedFilters.offer;
      clearedFilters.offer = null;
    }
    this.subscriptions.onFilter = this._webSalesService
      .all({
        sort: [clearedFilters.sort],
        beforepath: `stores/web`,
        remotefilter: clearedFilters,
        page: { number: clearedFilters.page || 1, size: clearedFilters.size }
      })
      .subscribe(data => {
        this.onFilter.emit({ documents: data });
      });
  }
}
