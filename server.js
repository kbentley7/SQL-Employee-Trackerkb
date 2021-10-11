const mysql = require ('mysq12');
const inquirer = require ('inquirer');
const cTable = require ('console.table');

require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    datbase: 'employee_db'
});

connection.connect(er => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
});

afterConnection = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    promptUser();
  };

const promptUser = () => {
    inquirer.prompt ([
    {
        type: 'lsit',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View all dpartments,',
                 ]
    }
    ])
}