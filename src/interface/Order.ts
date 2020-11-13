export interface Order{
    id?: number;
    payment_type: String;
    proof_of_payment: String;
    delivery_method: String;
    commentary: String;
    status: String;
    address_id: String;
    user_id: String;
    created_at: Date;
}