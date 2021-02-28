export interface APIResponse {
    status: "error" | "success" | "warning";
    message: string;
}
