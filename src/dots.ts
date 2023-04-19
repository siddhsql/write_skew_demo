import { DataTypes, Model } from "sequelize";
import { sequelize as sql } from './database'

export class Dots extends Model {
    declare color: string;    
}

Dots.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id' }, // 1 to 2,147,483,647. https://www.postgresql.org/docs/current/datatype-numeric.html
    color: { type: DataTypes.STRING, allowNull: false },    
}, {
    sequelize: sql,
    tableName: 'v1'
});
