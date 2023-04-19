import { DataTypes, Model } from "sequelize";
import { sequelize as sql } from './database'

export class MyTab extends Model {
    declare class: string;
    declare value: number;    
}

MyTab.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id' }, // 1 to 2,147,483,647. https://www.postgresql.org/docs/current/datatype-numeric.html
    class: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: false },    
}, {
    sequelize: sql,
    tableName: 'v1'
});
