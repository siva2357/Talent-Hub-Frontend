export class ApiFilterParams {
	constructor() {
		this.pageNumber = 1;
		this.offset = 0;
		this.limit = 10;
	}

	pageNumber: number;
	offset: number;
	limit: number;

	orderBy?: string;
	sortOrder?: string;
}

export class ApiSearchParams extends ApiFilterParams {
	constructor() {
		super();
	}

	searchString?: string;
	fromDate?: string;
	toDate?: string;
	type?: string;
}

export class AliasSearchParams extends ApiSearchParams {
	constructor() {
		super();
	}

	aliasType?: string;
	listEntryType?: string;
}
