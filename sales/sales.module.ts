import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { GioiapuraModule } from '../gioiapura';
import { LayoutModule } from '../layout';
import { InlineEditorModule, SharedModule } from '../shared';
import { ControlsModule } from '../shared/controls';
import { HomeSalesComponent, MultiSkuPickerComponent, ProductModifierComponent, StoreSalesComponent, StoreSalesDetailComponent, StoreSalesFiltersComponent, WebSalesComponent, WebSalesDetailComponent, WebSalesFiltersComponent } from './components';
import { WebSaleDetailsService, WebSalesService, StoreSalesService } from './services';
import { DuebitModule } from '../duebit/duebit.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        FormsModule,
        LayoutModule,
        ReactiveFormsModule,
        ControlsModule,
        RouterModule,
        NgSelectModule,
        GioiapuraModule,
        DuebitModule,
    ],
    declarations: [
        HomeSalesComponent,
        StoreSalesComponent,
        WebSalesComponent,
        StoreSalesFiltersComponent,
        WebSalesFiltersComponent,
        StoreSalesDetailComponent,
        WebSalesDetailComponent,
        MultiSkuPickerComponent,
        ProductModifierComponent,
    ],
    exports: [],
    providers: [
        WebSalesService,
        WebSaleDetailsService,
        StoreSalesService,
    ]
})
export class SalesModule { }
