export interface Address {
    _id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
    type?: 'home' | 'work';
}