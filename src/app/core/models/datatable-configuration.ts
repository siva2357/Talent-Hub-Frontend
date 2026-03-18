import { TemplateRef } from "@angular/core";
import { ColumnMode, SelectionType, SortDirection, SortType } from "@swimlane/ngx-datatable";

export class DataTableConfiguration {
    
    /**
     * Method used for setting column widths. Default value is standard
     */
    columnMode: ColumnMode ;

    /**
     * Array of columns to display
     */
    columns: any[];

    /**
     * Total count of all rows. Default value: 0
    */
    count: number;

    /**
     * Use external paging instead of client-side paging. Default value: false. Default value set as True in App
     */
    externalPaging: boolean;

    /**
     * Use external sorting instead of client-side sorting. Default value: false. Default value set as True in App
     */
    externalSorting: boolean;

    /**
     * The height of the footer in pixels. Pass a falsey for no footer. Default value: 0
     */
     footerHeight: number;

     /**
      * The height of the header in pixels. Pass a falsy value for no header. Default value: 30
      */
     headerHeight: number;

     /**
      * Page size to show. Default value: undefined. App Default 10
      */
     limit: number;

     /**
      * Show the linear loading bar. Default value: false
      */
     loadingIndicator: boolean;

     /**
      * Current offset ( page - 1 ) shown. Default value: 0
      */
     offset: number;

     /**
      * Column re-ordering enabled/disabled. Default value: true
      */
     reorderable: boolean;

     /**
      * Swap columns on re-order columns or move them. Default value: true. App Default false
      */
     swapColumns: boolean;

     /**
      * The height of the row.
      * When virtual scrolling is not in use, you can pass undefined for fluid heights.
      * If using virtual scrolling, you must pass a function or a number to calculate the heights.
      * Using a function, you can set the height of individual rows
      * eg. (row) => {
            // set default
            if (!row) return 50;
            // return my height
            return row.height;
            }
      */
     rowHeight!: number | 'auto' | ((row?: any) => number);

     /**
      * Function for uniquely identifying a row, used to track and compare when displaying and selecting rows. Example:
      * (row) => {
            return row.guid;
        }
      */
     rowIdentity!: (row?: any) => any;

     /**
      * Array of rows to display.
      */
     rows: any[];

     /**
      * Use horizontal scrollbar. Default value: false. App Default true
      */
     scrollbarH: boolean;

     /**
      * Use vertical scrollbar for fixed height vs fluid. This is necessary for virtual scrolling. Default value: false. App default true
      */
     scrollbarV: boolean;

     /**
      * A boolean or function you can use to check whether you want to select a particular row based on a criteria. Example:
      * (row, column, value) => {
            return value !== 'Ethel Price';
        }
      */
     selectCheck?: boolean | ((row: any, column: any, value: any) => boolean);

     /**
      * Function to determine whether to show a checkbox for a row. Example:
      * (row, column, value) => {
            return row.name !== 'Ethel Price';
        }
      */
     displayCheck!: (row: any, column?: any, value?: any) => boolean;

     /**
      * List of row objects that should be represented as selected in the grid. Rows are compared using object equality. For custom comparisons, use the selectCheck function. Default []
      */
     selected: any[];

     /**
      * Row selection mode
      * undefined - false - Rows cannot be selected - Default
      * 'single' - One row can be selected at a time
      * 'cell' - One cell can be selected at a time
      * 'multi' - Multiple rows can be selected using Ctrl or Shift key
      * 'multiClick' - Multiple rows can be selected by clicking
      * 'checkbox' - Multiple rows can be selected using checkboxes
      */
     selectionType: SelectionType;

     /**
      * Ordered array of objects used to determine sorting by column. Objects contain the column name, prop, and sorting direction, dir. Default value: []. Example:
      * [
            {
                prop: 'name',
                dir: 'desc'
            },
            {
                prop: 'age',
                dir: 'asc'
            }
        ];
      */
     sorts: { prop: string, dir: SortDirection }[];

     /**
      * Sorting mode, whether "single" or "multi". In "single" mode, clicking on a column name will reset the existing sorting before sorting by the new selection. In multi selection mode, additional clicks on column names will add sorting using multiple columns. Default Single
      */
     sortType: SortType;

     /**
      * A property on the row object that uniquely identifies the row. Example: "name"
      */
     trackByProp: string;

     /**
      * Use virtual scrolling. Default: true. App Default false
      */
     virtualization: boolean;

     cssClasses!: any;

    constructor() {
        this.columnMode = ColumnMode.force;
        this.columns = [];
        this.count = 0;
        this.externalPaging = true;
        this.externalSorting = true;
        this.footerHeight = 0;
        this.headerHeight = -30;
        this.limit = 10;
        this.loadingIndicator = false;
        this.offset = 0;
        this.reorderable = false;
        this.swapColumns = false;
        this.rows = [];
        this.scrollbarH = true;
        this.scrollbarV = true;
        this.selected = [];
        this.sorts = [];
        this.sortType = SortType.single;
        this.virtualization = false;
        this.trackByProp = '';
        this.selectionType = SelectionType.checkbox;
        this.rowHeight = 'auto';
        this.cssClasses = {
            sortAscending: 'datatable-icon-down',
            sortDescending: 'datatable-icon-up',
            pagerLeftArrow: 'datatable-icon-left',
            pagerRightArrow: 'datatable-icon-right',
            pagerPrevious: 'datatable-icon-prev',
            pagerNext: 'datatable-icon-skip'
        }
    }
}

export class DataTableActivateEventData {
    type?: 'keydown' | 'click' | 'dblclick';
    activate?: any;
    row?: any;
    column?: any;
    value?: any;
    cellElement?: any;
    rowElement?: any;
}

export class DataTableDetailToggleEventData {
    rows?: any;
    currentIndex?: number;
}

export class DataTablePageEventData {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
}

export class DataTableReorderEventData {
    column?: any;
    newValue?: any;
    prevValue?: any;
}

export class DataTableResizeEventData {
    column?: any;
    newValue?: any;
}

export class DataTableContextMenuEventData {
    event?: any;
    type?: any;
    content?: any;
}

export class DataTableScrollEventData {
    offsetX?: number;
    offsetY?: number;
}

export class DataTableSelectEventData {
    selected?: any;
}

export class DataTableSortEventData {
    sorts?: any;
    column?: any;
    prevValue?: any;
    newValue?: any;
}

export class DataTableColumnConfiguration {
    /**
     * Column label. If none specified, it will use the prop value and decamelize it.
     */
    name!: string;

    /**
     * The property to bind the row values to. If undefined, it will camelcase the name value.
     */
    prop!: string;

    /**
     * The grow factor relative to other columns. Same as the flex-grow API. It will any available extra width and distribute it proportionally according to all columns' flexGrow values. Default value: 0
     */
    flexGrow!: number;

    /**
     * Minimum width of the column in pixels. Default value: 100
     */
    minWidth: number;

    /**
     * Maximum width of the column in pixels. Default value: undefined
     */
    maxWidth?: number;

    /**
     * The width of the column by default in pixels. Default value: 150
     */
     width!: number;

     /**
      * The column can be resized manually by the user. Default value: true
      */
     resizeable!: boolean;

     /**
      * Custom sort comparator, used to apply custom sorting via client-side. Function receives five parameters, namely values and rows of items to be sorted as well as direction of the sort ('asc'|'desc'):
      */
     comparator?: (valueA: any, valueB: any, rowA: any, rowB: any, sortDirection: 'asc' | 'desc') => -1|0|1;

     /**
      * Sorting of the row values by this column. Default value: true
      */
     sortable!: boolean;

     /**
      * The column can be dragged to re-order. Default value: true
      */
      draggable!: boolean;

      /**
       * Whether the column can automatically resize to fill extra space. Default value: true
       */
      canAutoResize!: boolean;

      /**
       * Angular TemplateRef allowing you to author custom body cell templates
       */
      cellTemplate?: TemplateRef<any>;

      /**
       * Angular TemplateRef allowing you to author custom header cell templates
       */
      headerTemplate?: TemplateRef<any>;

      /**
       * Indicates whether the column should show a checkbox component for selection. Only applicable when the selection mode is checkbox.
       */
      checkboxable?: boolean;

      /**
       * Indicates whether the column should show a checkbox component in the header cell. Only applicable when the selection mode is checkbox.
       */
      headerCheckboxable?: boolean;

      /**
       * Determines if the column is frozen to the left. Default value: false
       */
      frozenLeft!: boolean;

      /**
       * Determines if the column is frozen to the right. Default value: false
       */
      frozenRight!: boolean;

      headerClass!: string;

      cellClass!: string;

    constructor() { 
        this.flexGrow = 0;
        this.minWidth = 100;
        this.width = 150;
        this.resizeable = true;
        this.sortable = false;
        this.draggable = false;
        this.canAutoResize = true;
        this.frozenLeft = false;
        this.frozenRight = false;
    }
}