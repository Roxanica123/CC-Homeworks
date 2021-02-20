export interface ResponseObject {
    data: string;
    code: number|undefined;
    is_error: boolean;
    error?: string; 
}