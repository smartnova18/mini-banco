import { User } from "../interfaces";
import { getBdSettings } from '../getBdSettings';
import mysql, { QueryResult, RowDataPacket} from 'mysql2/promise';

const paramsConnection = getBdSettings();

export const getAllUsers = async(): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'SELECT * FROM users';
        const connection = await mysql.createConnection(paramsConnection);

        const [ rows ] = await connection.execute(query);

        if (!rows) throw new Error('Error al obtener usuarios');
        connection.end();
        return rows;
    } catch (error) {
        console.log('Ocurrió un error al obtener los usuarios, error:', error);
        throw new Error('Error en usuarios');
    }
};

export const createUser = async(values: string[]) => {
    try {
        const query = 'INSERT INTO `users` (`name`, `last_name`, `document_number`) VALUES (?, ?, ?)';
        const connection = await mysql.createConnection(paramsConnection);
        const [result] = await connection.execute(query, values);
        console.log(result);

        return result.insertId;
    } catch (error) {
        console.log(error);
        throw new Error('Error al crear usuarios');
    }
};

export const updateUser = async(values: string[]) => {
    try {
        const query = 'UPDATE `users` SET `name` = ?, `last_name` = ?, `document_number` = ? WHERE `id` = ?';
        const connection = await mysql.createConnection(paramsConnection);

        const [result] = await connection.execute(query, values);

        return result.insertId;
    } catch (error) {
        console.log(error);
        throw new Error('Error al actualizar el usuario');
    }
}

export const deleteUser = async(id: string): Promise<QueryResult | ErrorConstructor> => {
    try {
        const query = 'DELETE FROM `users` WHERE `id` = ?';
        const connection = await mysql.createConnection(paramsConnection);

        const [result] = await connection.execute(query, [id]);

        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Error al eliminar el usuario');
    }
};