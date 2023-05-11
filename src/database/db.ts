const Database = require('better-sqlite3');
const db = new Database("ts-counts.db", {});
db.pragma('journal_mode = WAL');
const createStatement = db.prepare(['CREATE TABLE IF NOT EXISTS counts (',
                                    'namespace TEXT(64),',
                                    'counter TEXT(64),',
                                    'count INTEGER,',
                                    'PRIMARY KEY (namespace, counter)',
                                    ')'].join(" "))
const createDb = db.transaction(() => createStatement.run())
createDb()
export default db;
