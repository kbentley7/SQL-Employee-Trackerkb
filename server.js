const mysql = require ('mysq12');
const inquirer = require ('inquirer');
const cTable = require ('console.table');
require('dotenv').config()
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    datbase: 'employee_db'

})