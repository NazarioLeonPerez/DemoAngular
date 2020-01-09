import { RelatedDocumentCollection } from './related-document-collection';
import { Resource } from './resource';

export class DocumentCollection<R extends Resource = Resource> extends RelatedDocumentCollection<R> {
  public data: Array<R> = [];
  public content: 'collection' = 'collection';
}
