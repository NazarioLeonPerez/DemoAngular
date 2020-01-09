import { Component, Injector, Input, OnDestroy } from '@angular/core';
import { BaseComponent, Tools } from '../../../shared';
import { SalesFilters } from '../../types';
import { WebSalesService } from '../../services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: "product-modifier",
  templateUrl: './product-modifier.component.html'
})
export class ProductModifierComponent extends BaseComponent implements OnDestroy {

  private _webSalesService: WebSalesService;
  private _http: HttpClient;

  constructor(protected injector: Injector) {
    super(injector);

    this._webSalesService = injector.get(WebSalesService);
    this._http = injector.get(HttpClient);

    this.id = `product_modifier_modal_${Tools.newUuid()}`;
  }

  @Input() public title: string = "Sceglie la azione da eseguire";
  @Input() public id: string;
  @Input() public filters: SalesFilters;
  @Input() public skuList: string;



  public minStock: number;
  public minStockStoreId: number;

  public setMinStock() {
    this.sendMultiSku();

    this._http.post(`${environment.apiUrl}/stores/${this.minStockStoreId}/products/min-stock`, {
      data: {
        type: "massEdit",
        attributes: { filters: this.generateFilters(this.filters), value: this.minStock }
      }
    }).subscribe();
  }



  public grid: boolean = false;
  public gridStoreId: number;

  public setGrid() {
    this.sendMultiSku();

    this._http.post(`${environment.apiUrl}/stores/${this.gridStoreId}/products/grid`, {
      data: {
        type: "massEdit",
        attributes: { filters: this.generateFilters(this.filters), value: this.grid }
      }
    }).subscribe();
  }



  public saleConsignment: boolean = false;

  public setSaleConsignment() {
    this.sendMultiSku();

    this._http.post(`${environment.apiUrl}/products/sale-consignment`, {
      data: {
        type: "massEdit",
        attributes: { filters: this.generateFilters(this.filters), value: this.saleConsignment }
      }
    }).subscribe();
  }



  public cancel() {
    this.closeModal();
  }

  public open() {
    this.openModal();
  }


  private sendMultiSku() {
    if (this.skuList) {
      this._webSalesService.setMultiskuValues({ data: { type: "webSales", attributes: { multiSku: this.skuList } } }).subscribe();
    }
  }

  private generateFilters(apiFilters: SalesFilters) {
    let filters: { name: string, value: string }[] = [];
    Object.keys(apiFilters).forEach(key => {
      if (key != "page" && key != "size" && key != "sort" && key != "cache") { filters.push({ name: key, value: apiFilters[key] }); }
    });

    return filters;
  }

  private openModal() {
    //@ts-ignore
    $(`#${this.id}`).modal('show');
  }

  private closeModal() {
    //@ts-ignore
    $(`#${this.id}`).modal('hide');
  }

  private destroyModal() {
    //@ts-ignore
    $(`#${this.id}`).modal('dispose');
  }
}
