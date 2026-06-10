export class ApiListResponse<T> {
    constructor() {
        this.items = [];
        this.total_count = 0;
    }
    items?: T[];
    total_count?: number;
}