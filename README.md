# README

## About

Do you think you understand concurrency in databases? Well, use this project to test your understanding.

This example illustrates the _write skew_ problem using the 4 canonical examples on Postgres [wiki](https://wiki.postgresql.org/wiki/SSI).
We run the example under 3 isolation modes:
- `READ COMMITTED`
- `REPEATABLE READ` implemented using Snapshot Isolation or MVCC in Postgres
- `SERIALIZABLE` implemented using Serializable Snapshot Isolation in Postgres
The Snapshot Isolation mode (i.e., `READ REPEATABLE`) cannot hanlde _write skew_. You have to either use a higher isolation level or resort to
explicit locking in your code. Besides illustrating concurrency you can use this project to learn how to use Sequelize.

## Build

```
npm i
npm run build
```

## Run

First, edit [run-pg.sh](run-pg.sh) and [run-mysql.sh](run-mysql.sh) as necessary.

To run the 4 examples one by one:

Postgres:

```
npm run pg-black-white-demo
npm run pg-intersecting-data-demo
npm run pg-overdraft-protection-demo
npm run pg-rgb-demo
```

MySQL:

```
npm run mysql-black-white-demo
npm run mysql-intersecting-data-demo
npm run mysql-overdraft-protection-demo
npm run mysql-rgb-demo
```

Full log of successful runs can be found under the [logs](logs) folder.

## Observations

Both MySQL and Postgres are able to handle _write skew_ at the `SERIALIZABLE` level but the way its implemented is different between the two.
MySQL uses a combination of MVCC and 2-phase locking (2PL) whereas Postgres uses Serializable Snapshot Isolation (SSI) which does not cause any locking.
They give the same result for the overdraft protection and intersecting data examples. One of the transactions is aborted whereas the other is allowed to
commit. However it is interesting to note that for the black-white example, MySQL serializes and commits both transactions whereas Postgres aborts one
of the transactions. And again, for the rgb example MySQL serializes the 3 transactions and commits them one by one whereas Postgres aborts 2
transactions and only allows one to commit. Which one do you like? The elephant or the dolphin? Let me know.
