const Cursor = require('pg-cursor');
const {Pool} = require('pg');

const pool = new Pool({
    connectionString: 'postgres://postgres@db:5432/postgres',
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

pool.connect().then(client => {
}).catch(error => {
console.log(error);
});

function repeatedQuery(func) {
    console.log('QUERY START');
    pool.query('SELECT 1;').then(result => {
        console.log('QUERY END');
        setTimeout(() => func(func), 250);
    }).catch (error => {
        console.log('QUERY ERROR');
    });
}


function brokenCursor() {
    pool.connect().then(client => {
        const cursor = client.query(new Cursor('SELECT * FROM (VALUES (1), (2), (3), (4), (5) ) as result (data);'));
        cursor.read(1, (err, rows) => {
            console.log(rows);
            client.release();
        });
    }).catch(error => {
        console.log(error);
    });
}

repeatedQuery(repeatedQuery);
setTimeout(brokenCursor, 3000);

