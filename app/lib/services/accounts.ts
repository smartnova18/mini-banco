import { number, string } from "yup";
import { getBdSettings } from "../getBdSettings";
import mysql, { QueryResult} from 'mysql2/promise';

const paramsConnection = getBdSettings();

export const getAllAccounts = async(): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'SELECT u.name, u.last_name, u.document_number, u.id as user_id, a.id, a.type_account, a.initial_amount FROM accounts a JOIN users u ON a.user_id = u.id';
        const connection = await mysql.createConnection(paramsConnection);

        const [ rows ] = await connection.execute(query);

        if (!rows) throw new Error('Error al obtener usuarios');
        connection.end();
        return rows;
    } catch (error) {
        throw new Error('Error al obtener las cuentas');
    }
};

export const getAccount = async(id: number): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'SELECT a.id, a.type_account, a.initial_amount, u.id as user_id, u.name, u.last_name, u.document_number FROM accounts a JOIN users u ON a.user_id = u.id WHERE a.id = ?';
        const connection = await mysql.createConnection(paramsConnection);

        const [ rows ] = await connection.execute(query, [id]);

        connection.end();
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('Error al crear la cuenta');
    }
};

export const createAccount = async(values: string[]): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'INSERT INTO `accounts` (`type_account`, `user_id`, `initial_amount`) VALUES (?, ?, ?)';
        const connection = await mysql.createConnection(paramsConnection);
        
        const [result] = await connection.execute(query, values);
        const accountInserted = await getAccount(result.insertId);

        connection.end();
        return accountInserted[0];
    } catch (error) {
        console.log(error);
        throw new Error('Error al crear la cuenta');
    }
};

export const updateAccount = async(values: string[]): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'UPDATE `accounts` SET `type_account` = ?, `user_id` = ?, `initial_amount` = ? WHERE `id` = ?';
        const connection = await mysql.createConnection(paramsConnection);

        const [result] = await connection.execute(query, values);
        const accountUpdated = await getAccount(parseInt(values[3]));

        connection.end();
        return accountUpdated[0];
    } catch (error) {
        console.log(error);
        throw new Error('Error al actualizar la cuenta');
    }
};

export const updateInitialAmount = async (values: string[]): Promise<QueryResult | ErrorConstructor> =>  {
    try {
        console.log(values);
        const query = 'UPDATE `accounts` SET initial_amount = ? WHERE id = ?';
        const connection = await mysql.createConnection(paramsConnection);

        const [result] = await connection.execute(query, values);

        connection.end();
        return result;
    } catch (error) {
        throw new Error('Error al actualizar el saldo de la cuenta');
    }
}

export const deleteAccount = async(id: string): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'DELETE FROM `accounts` WHERE `id` = ?';
        const connection = await mysql.createConnection(paramsConnection);

        const [result] = await connection.execute(query, [id]);

        connection.end();
        return result;
    } catch (error) {
        throw new Error('Error al eliminar la cuenta');
    }
};