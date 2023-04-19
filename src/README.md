# README

## Build

```
npm run build
```

## Run

```
./scripts/run-serialization-failure-demo.ts
```

## Misc Notes

Do not try to rollback a class `40` error. Class `40` error means transaction has already been rolled back.
If you try to roll it back twice, you will get this error:

```
      throw new Error(`Transaction cannot be rolled back because it has been finished with state: ${this.finished}`);
            ^

Error: Transaction cannot be rolled back because it has been finished with state: commit
    at Transaction.rollback (/Users/sijain2/node/sequelize-tutorial/node_modules/sequelize/lib/transaction.js:59:13)
    at test (/Users/sijain2/node/sequelize-tutorial/dist/serialization_failure_demo/app.js:52:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Promise.allSettled (index 0)
    at async main (/Users/sijain2/node/sequelize-tutorial/dist/serialization_failure_demo/app.js:67:29)
```