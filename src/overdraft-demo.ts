import { sequelize as sql } from './database'
import { Account } from './account'
import { Op, Transaction } from 'sequelize';

const initDb = async () => {
    await Account.sync({force: true});
    await Account.bulkCreate([
        { name: 'kevin', type: 'checking', balance: 100 },
        { name: 'kevin', type: 'saving', balance: 100 }
    ]);
}

const teardown = async () => {
    await Account.drop();    
}

const get_account = async (type: string, t?: Transaction) => {
    return Account.findOne({ 
        where: { name: { [Op.eq]: 'kevin' }, type: { [Op.eq]: type } }, 
        transaction: t
    });
}

const test = async (isolationLevel, account, debit) => {
    const t = await sql.transaction({
        isolationLevel: isolationLevel
    });
    try {        
        const checking = await get_account('checking', t);
        const saving = await get_account('saving', t);
        const sufficient_balance = checking.balance + saving.balance >= debit;
        if (sufficient_balance) {
            if (account === 'checking') {
                checking.balance -= debit;
                await checking.save({ transaction: t });
            } else if (account === 'saving') {
                saving.balance -= debit;
                await saving.save({ transaction: t });
            }
            await t.commit();
            console.log(`transaction successfully committed! debited ${debit} from ${account}`);
        } else {
            console.log('you do not have sufficient balance to complete the transaction');
            // we still need to call t.commit else the program will hang! try commenting out this line!
            await t.commit();            
        }        
    } catch (e) {
        console.error(e.name);        
        console.error(e.original?.code);
        console.log('rolling back failed transaction...');
        await t.rollback();        
        throw e;
    } 
}

const print_final_balances = async () => {
    const v1 = await get_account('checking')
    const v2 = await get_account('saving');
    console.log(`v1 = ${v1.balance}, v2 = ${v2.balance}`);
}

const main = async () => {
    const levels = [Transaction.ISOLATION_LEVELS.READ_COMMITTED, Transaction.ISOLATION_LEVELS.REPEATABLE_READ, Transaction.ISOLATION_LEVELS.SERIALIZABLE];
    for (var level of levels) {
        try {
            console.log(`testing with ${level}`);
            await initDb();
            const results = await Promise.allSettled([test(level, 'checking', 200), test(level, 'saving', 200)]);   // start two transactions in parallel
            let counter = 1;
            for (const result of results) {
                console.log(`result of ${counter} transaction`);
                counter++;
                console.log(result.status);                
            }
            console.log('final balances');
            await print_final_balances();
        } finally {
            await teardown();
        }
    }
    await sql.close();     
}

main().catch(e => console.error(e));
