export default class Pagination{
    page: number;
    size: number;
    total: number;
    totalPages: number;

    constructor(){
        this.page = 1;
        this.size = 5;
        this.total = 0;
        this.totalPages = 0;
    }
    get offset(): number {
        return (this.page - 1) * this.size;
    }
    calculate(): void {
        this.totalPages = Math.ceil(this.total / this.size);
    }
}