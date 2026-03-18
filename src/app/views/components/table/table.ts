import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { Component,Input, OnChanges,SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DataTableConfiguration} from '../../../core/models/datatable-configuration';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,NgxDatatableModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnChanges {

  @Input() dataTableConfiguration: DataTableConfiguration;

  @Input() isCustomHeaderTemplate: boolean;


  @ViewChild('headerTmpl', { static: true })
  public headerTemplateRef!: TemplateRef<any>;



  constructor() {
    this.dataTableConfiguration = new DataTableConfiguration();
    this.isCustomHeaderTemplate = true;
  }



  ngOnChanges(SimpleChanges: SimpleChanges) {
    if(this.isCustomHeaderTemplate) {
      this.dataTableConfiguration.columns = this.dataTableConfiguration.columns.map((item, index) => {
        return {
          ...item,
          //TODO: commenting headerTemplate as don't see the need here
          // headerTemplate: this.headerTemplateRef,
          headerClass: item.headerClass ? item.headerClass + ' dataTableHeader' : 'dataTableHeader',
          cellClass: item.cellClass ? item.cellClass + ' dataTableCell' : 'dataTableCell'
        }
      });
    }
  }



}
