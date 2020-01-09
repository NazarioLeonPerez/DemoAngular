import { Component, Output, EventEmitter, OnDestroy, Injector, Input } from '@angular/core';
import { BaseComponent, Tools } from '../../../shared';

export interface MultiskuPickerEvent {
  items: Set<string>;
  textItems: string;
}

@Component({
  selector: "multi-sku-picker",
  templateUrl: './multi-sku-picker.component.html'
})
export class MultiSkuPickerComponent extends BaseComponent implements OnDestroy {

  constructor(protected injector: Injector) {
    super(injector);

    this.id = `multi_sku_pick_modal_${Tools.newUuid()}`;
  }

  @Input() public title: string = "Aggiungi gli sku";
  @Input() public id: string;
  @Input() public separator: string = " ";
  @Input() public max: number = 100000;

  @Output() onSubmit = new EventEmitter<MultiskuPickerEvent>();
  @Output() onClear = new EventEmitter();

  public items: Set<string> = new Set<string>([]);
  public textItems: string;
  public text: string;

  public submit() {
    this.closeModal();

    let list = this.text.split("\n").filter(Boolean).slice(0, this.max);
    this.items = new Set(list);
    this.textItems = list.join(this.separator);

    this.onSubmit.emit({ items: this.items, textItems: this.textItems });
  }

  public cancel() {
    this.closeModal();
  }

  public clear() {
    this.closeModal();
    this.items.clear();
    this.text = null;
    this.onClear.emit(null);
  }

  public open() {
    if (this.items.size > 0) {
      this.text = Array.from(this.items).join("\n");
    }
    this.openModal();
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
