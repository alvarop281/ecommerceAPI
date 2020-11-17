// Connection to the database
import { connect } from '../database';
import { Address } from '../interface/Address';

export async function SelectAddressByID(userId: number | String, addressId: number | String){   
    const conn = await connect();
    const address: any = await conn.query('SELECT * FROM addresses WHERE addresses.user_id =? AND addresses.id =?', [userId, addressId]);
    conn.end();

    return address[0][0];
}

export async function SelectAddressessFromUser(userId: number | String){   
    const conn = await connect();
    const addresses: any = await conn.query('SELECT * FROM addresses WHERE addresses.user_id =?', [userId]);
    conn.end();

    return addresses[0];
}

export async function CreateAddress(newAddress: Address){
    const conn = await connect();

    await conn.query('INSERT INTO addresses SET ?', [newAddress]);
    conn.end();

    return 0;
}

export async function DeleteAddress(userId: number | string, addressId: number | String){
    const conn = await connect();

    await conn.query('DELETE FROM addresses WHERE addresses.user_id =? AND addresses.id =?', [userId, addressId]);
    conn.end();

    return 0;
}

export async function UpdateAddress(updateAddress: Address, userId: number | string, addressId: number | String){
    const conn = await connect();

    await conn.query('UPDATE addresses SET ? WHERE addresses.user_id =? AND addresses.id =?', [updateAddress, userId, addressId]);
    conn.end();

    return 0;
}