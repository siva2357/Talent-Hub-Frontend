export class ApiResponse<T> {
    constructor() {}
    requestId?: string;
    data?: T;
}