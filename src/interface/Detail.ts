export interface Detail{
    id?: number;
    ordered_quantity: number;
    unit_price: number;
    total_by_product: number;
    product_id: number;
    order_id: number | String;
    created_at?: Date;
}