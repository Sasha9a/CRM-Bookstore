import { Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { DomHandler } from "primeng/dom";
import { Table, TableService } from "primeng/table";
import { ObjectUtils } from "primeng/utils";

/** Компонент модифицирующий стандартную таблицу */
@Component({
  selector: 'crm-table',
  templateUrl: './table.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    DomHandler,
    ObjectUtils,
    TableService,
    {
      provide: Table,
      useFactory: (crmTable: TableComponent) => crmTable.table,
      deps: [TableComponent]
    }
  ]

})
export class TableComponent implements OnInit {

  @ViewChild('table', { static: true }) private table: Table;

  @ContentChild('headerTemplate') public headerTemplate;
  @ContentChild('rowTemplate') public rowTemplate;
  @ContentChild('footerTemplate') public footerTemplate;

  @Input() public loading = false;
  @Input() public paginationLoading = false;

  @Input() public selectable = false;
  @Input() public selectionDisabled = false;
  @Input() public selectedItems: any[] = [];
  @Output() public selectedItemsChange = new EventEmitter<any[]>();

  @Input() public name: string;
  @Input() public values: any[] = [];
  @Input() public columns: CrmTableColumn[] = [];

  @Input() public sort = '';
  @Output() public sortChange = new EventEmitter<string>();

  @Input() public inplaceSort = true;
  @Input() public styleClass = '';
  @Input() public scrollHeight: string;

  @Input() public autoLayout = false;

  public skeletonItems = Array(15).fill(null);

  public ngOnInit(): void {
    if (!this.sort) {
      this.sort = localStorage.getItem(`table.${this.name}.sort`) ?? this.columns.find(column => column.sort)?.sort ?? '';
    }
  }

  public getSortIconClass(sort: string): string {
    return this.sort.includes(sort)
      ? this.sort[0] === '-' ? 'pi pi-sort-down' : 'pi pi-sort-up'
      : 'pi pi-sort';
  }

  public setSort(sort: string): void {
    this.sort = this.sort === sort
      ? sort[0] === '-' ? sort.substring(1) : `-${sort}`
      : sort;
    localStorage.setItem(`table.${this.name}.sort`, this.sort);
    this.sortChange.emit(this.sort);
  }

}
