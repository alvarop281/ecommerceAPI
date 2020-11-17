// Connection to the database
import { connect } from '../database';
import { User } from '../interface/User';

export async function SelectUserByID(id: number | String){   
    const conn = await connect();
    const user: any = await conn.query('SELECT * FROM users WHERE users.id =?', [id]);
    conn.end();

    return user[0][0];
}

export async function SelectUserByEmail(email: String){   
    const conn = await connect();
    const user: any = await conn.query('SELECT * FROM users WHERE users.email =?', [email]);
    conn.end();

    return user[0][0];
}

export async function SelectUser(){   
    const conn = await connect();
    const users: any = await conn.query('SELECT * FROM users');
    conn.end();

    return users[0];
}


export async function CreateUser(newUser: User){
    const conn = await connect();

    await conn.query('INSERT INTO users SET ?', [newUser]);
    conn.end();

    return 0;
}

export async function DeleteUser(id: number | string){
    const conn = await connect();

    await conn.query('DELETE FROM users WHERE users.id =?', [id]);
    conn.end();

    return 0;
}

export async function UpdateUser(updateUser: User, id: number | String){
    const conn = await connect();

    await conn.query('UPDATE users SET ? WHERE users.id = ?', [updateUser, id]);
    conn.end();

    return 0;
}