import { sequelize as sql } from './database'
import { Dots } from './dots'
import { Transaction } from 'sequelize';

const COLORS = ['red', 'green', 'blue'];

const initDb = async () => {
    await Dots.sync({force: true});
    const data = [];
    for (let i = 0; i < 15; i++) {
        data.push({ color: COLORS[i % 3] });
    }
    const dots = await Dots.bulkCreate(data);
    console.log('inital state');
    for (let i = 0; i < dots.length; i++) {
        console.log(dots[i].color);
    }
}

const teardown = async () => {
    await Dots.drop();    
}

const test = async (isolationLevel, fromColor, toColor) => {
    const t = await sql.transaction({
        isolationLevel: isolationLevel
    });
    try {        
        await Dots.update(
            { color: toColor }, 
            { where: { color: fromColor }, transaction: t },            
        )
        await t.commit();
        console.log(`transaction successfully committed! changed ${fromColor} to ${toColor}`);                
    } catch (e) {
        console.error(e.name);        
        console.error(e.original?.code);
        console.log('rolling back failed transaction...');
        await t.rollback();        
        throw e;
    } 
}

const print_final_values = async () => {
    const rows = await Dots.findAll();
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        console.log(`${row.color}`);
    }    
}

const main = async () => {
    const levels = [Transaction.ISOLATION_LEVELS.READ_COMMITTED, Transaction.ISOLATION_LEVELS.REPEATABLE_READ, Transaction.ISOLATION_LEVELS.SERIALIZABLE];
    for (var level of levels) {
        try {
            console.log(`testing with ${level}`);
            await initDb();
            const results = await Promise.allSettled([
                test(level, 'red', 'green'), 
                test(level, 'green', 'blue'),
                test(level, 'blue', 'red'),
            ]);   // start 3 transactions in parallel
            let counter = 1;
            for (const result of results) {
                console.log(`result of ${counter} transaction`);
                counter++;
                console.log(result.status);                
            }
            console.log('final values');
            await print_final_values();
        } finally {
            await teardown();
        }
    }
    await sql.close();
}

main().catch(e => console.error(e));
