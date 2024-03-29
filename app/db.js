'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../db/ozflux_serf');

module.exports.getRows = (last, table, order) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM " + table + ' ORDER BY ' + order + ' DESC LIMIT ' + last, (err, rows) => {
            if(err){
                reject(err);
            }else {
                resolve(rows);
            }
        });
    });
};
module.exports.getPragma = (table) => {
    return new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(' + table + ')', function (err, rows) {
            if(err){
                reject(err);
            }else {
                resolve(rows);
            }
        });
    });
};
module.exports.getRowsBetween = (table, column, betweenFirst, betweenLast) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ' + table + ' WHERE '+ column +' BETWEEN ' + betweenFirst + ' AND ' + betweenLast +' ', (err, rows) => {
            if(err){
                reject(new Error(err));
            }else {
                resolve(rows);
            }
        });
    })

};
module.exports.getLastPoint = (table, column) => {
    return new Promise((resolve, reject) => {
        db.each('SELECT '+ column + ' FROM ' + table + ' ORDER BY ' + column + ' DESC LIMIT 1', (err, row) => {
            if(err){
                reject(new Error(err));
            }else {
                resolve(row);
            }
        });
    });
};
module.exports.insertRow = (table, row, record, cb) => {
    var insert = '';
    for(var i = 0; i < row.length;i++){
        insert +=  "'" + row[i] + "'";
        if(i<row.length - 1) insert += ',';
    }
    module.exports.getRecord(table, record, (row) => {
        if(row.length <= 0){
            db.run('INSERT INTO ' + table + ' VALUES ('+insert+')', (err) => {
                cb(err);
            });
        }
    });
};
module.exports.getRecord = (table, record, cb) => {
    db.all('SELECT RECORD FROM ' + table + ' WHERE RECORD = ' + record + ' LIMIT 1', (err, row) => {
        if(!row){
            cb([]);
        }else{
            cb(row);
        }
    });
};
module.exports.getTables = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        })
    });
};