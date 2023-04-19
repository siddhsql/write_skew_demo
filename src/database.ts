// if ts-node is only installed locally, you can access it like this:
// $(npm bin)/ts-node init-tables.js
import { Sequelize, Transaction } from 'sequelize'

const uses_pg = (): boolean => {
    return !!process.env.PG_DATABASE && !!process.env.PG_USER && !!process.env.PG_PASSWORD && !!process.env.PG_PORT;
}

const uses_mysql = (): boolean => {
    return !!process.env.MYSQL_DATABASE && !!process.env.MYSQL_USER && !!process.env.MYSQL_PASSWORD && !!process.env.MYSQL_PORT;
}

const get_dialect = (): string => {
    if (uses_mysql()) {
        process.env.DATABASE = process.env.MYSQL_DATABASE;
        process.env.USER = process.env.MYSQL_USER;
        process.env.PASSWORD = process.env.MYSQL_PASSWORD;
        process.env.PORT = process.env.MYSQL_PORT;
        process.env.HOST = process.env.MYSQL_HOST;
        return 'mysql';
    } else if (uses_pg()) {
        process.env.DATABASE = process.env.PG_DATABASE;
        process.env.USER = process.env.PG_USER;
        process.env.PASSWORD = process.env.PG_PASSWORD;
        process.env.PORT = process.env.PG_PORT;
        process.env.HOST = process.env.PG_HOST;
        return 'postgres';
    } else {
        throw new Error('unable to determine dialect');
    }
}

const dialect = get_dialect();
    
export const sequelize = new Sequelize(process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD, 
    {
        host: process.env.HOST || 'localhost',
        //@ts-ignore
        port: parseInt(process.env.PORT),
        //@ts-ignore
        dialect: dialect,
        dialectOptions: { decimalNumbers: true },   // this is to get MySQL decimal as a number in Javascript https://github.com/sequelize/sequelize/issues/8019#issuecomment-319014433
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        pool: { max: 100 },
        logging: false
    });    
