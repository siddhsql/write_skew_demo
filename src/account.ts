import { DataTypes, Model } from "sequelize";
import { sequelize as sql } from './database'

export class Account extends Model {
    declare balance: number;
    declare name: string;
    declare type: string;
}

Account.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id' }, // 1 to 2,147,483,647. https://www.postgresql.org/docs/current/datatype-numeric.html
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.INTEGER, field: 'balance' },    
}, {
    sequelize: sql,
    tableName: 'v1'
});
