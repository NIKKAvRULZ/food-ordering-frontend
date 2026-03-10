export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string;
    deliveryAddress: string;
    recommendation?: string;
    vegan?: boolean;
}