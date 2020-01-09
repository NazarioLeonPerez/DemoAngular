import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Core as JsonapiCore } from './core';
// testing
import { JsonapiConfig } from './jsonapi-config';
import { Http as JsonapiHttp } from './sources/http.service';
import { StoreService as JsonapiStore } from './sources/store.service';



@NgModule({
  imports: [CommonModule],
  exports: [HttpClientModule],
  providers: [
    JsonapiCore,
    JsonapiStore,
    JsonapiConfig, // Need this here for testing
    JsonapiHttp
  ]
})
export class NgxJsonapiModule {
  public constructor(
    @Optional()
    @SkipSelf()
    parentModule: NgxJsonapiModule,
    jsonapiCore: JsonapiCore
  ) {
    if (parentModule) {
      throw new Error('NgxJsonapiModule is already loaded. Import it in the AppModule only');
    }
  }

  public static forRoot(config: JsonapiConfig): ModuleWithProviders {
    return {
      ngModule: NgxJsonapiModule,
      providers: [{ provide: JsonapiConfig, useValue: config }]
    };
  }
}
