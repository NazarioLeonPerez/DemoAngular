import { EventEmitter } from '@angular/core';
import { Event } from '@angular/router';
import { DocumentCollection } from "../../shared/ngx-jsonapi";
import { StoreSaleDocument, WebSaleDocument } from "../services";

export interface StoreSalesFilterEvent {
  event?: Event;
  documents: DocumentCollection<StoreSaleDocument>;
}

export interface WebSalesFilterEvent {
  event?: Event;
  documents: DocumentCollection<WebSaleDocument>;
}

export interface StoreSalesDetailEvent {
  event?: Event;
  document: StoreSaleDocument;
}

export interface WebSalesDetailEvent {
  event?: Event;
  document: WebSaleDocument;
}

export class StoreSalesEvents {
  public onDocumentDetail: EventEmitter<StoreSalesDetailEvent> = new EventEmitter<StoreSalesDetailEvent>();
}

export class WebSalesEvents {
  public onDocumentDetail: EventEmitter<WebSalesDetailEvent> = new EventEmitter<WebSalesDetailEvent>();
}
