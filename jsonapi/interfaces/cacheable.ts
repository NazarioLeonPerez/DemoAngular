import { SourceType } from './../document';
import { IHasCacheData } from './has-cache-data';

export interface ICacheable extends IHasCacheData {
    loaded: boolean;
    source: SourceType;
    ttl?: number;
}
