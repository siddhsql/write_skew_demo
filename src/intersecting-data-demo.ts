import { sequelize as sql } from './database'
import { MyTab } from './mytab'
import { Op, Transaction, Sequelize } from 'sequelize';

const initDb = async () => {
    await MyTab.sync({force: true});
    await MyTab.bulkCreate([
        { class: '1', value: 10 },
        { class: '1', value: 20 },
        { class: '2', value: 100 },
        { class: '2', value: 200 },
    ]);
}

const teardown = async () => {
    await MyTab.drop();    
}

const get_sum = async (klass: string, t?: Transaction) => {
    const row = await MyTab.findOne({ 
        attributes: [ [Sequelize.fn('sum', Sequelize.col('value')), 'sum'] ],
        where: { class: { [Op.eq]: klass } }, 
        transaction: t,
        raw: true
    });
    return row['sum'];
}

const test = async (isolationLevel, class1, class2) => {
    const t = await sql.transaction({
        isolationLevel: isolationLevel
    });
    try {        
        const sum = await get_sum(class1, t);
        await MyTab.create({
            class: class2,
            value: sum
        }, { transaction: t });
        await t.commit();
        console.log(`transaction successfully committed! totaled ${class1} and inserted total into ${class2}`);                
    } catch (e) {
        console.error(e.name);        
        console.error(e.original?.code);
        console.log('rolling back failed transaction...');
        await t.rollback();        
        throw e;
    } 
}

const print_final_values = async () => {
    const rows = await MyTab.findAll();
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        console.log(`class = ${row.class}, value = ${row.value}`);
    }    
}

const main = async () => {
    const levels = [Transaction.ISOLATION_LEVELS.READ_COMMITTED, Transaction.ISOLATION_LEVELS.REPEATABLE_READ, Transaction.ISOLATION_LEVELS.SERIALIZABLE];
    for (var level of levels) {
        try {
            console.log(`testing with ${level}`);
            await initDb();
            const results = await Promise.allSettled([test(level, '1', '2'), test(level, '2', '1')]);   // start two transactions in parallel
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
