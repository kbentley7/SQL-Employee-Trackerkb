// List the dependencies here.
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employee_db',
});

connection.query = util.promisify(connection.query);

// Begin the application after establishing the connection.
connection.connect(function (err) {
    if (err) throw err;
    initialAction();
})



// Give a welcome message.
console.table(
  "\n------------ EMPLOYEE TRACKER ------------\n"
)

// Ask the user initial action question to figure out what they would like to do.
const initialAction = async () => {
  try {
      let answer = await inquirer.prompt({
          name: 'action',
          type: 'list',
          message: 'What would you like to do?',
          choices: [
              'View Employees',
              'View Departments',
              'View Roles',
              'Add Employees',
              'Add Departments',
              'Add Roles',
              'Update Employee Role',
              'Exit'
          ]
      });
      switch (answer.action) {
          case 'View Employees':
              employeeView();
              break;

          case 'View Departments':
              departmentView();
              break;

          case 'View Roles':
              roleView();
              break;

          case 'Add Employees':
              employeeAdd();
              break

          case 'Add Departments':
              departmentAdd();
              break

          case 'Add Roles':
              roleAdd();
              break

          case 'Update Employee Role':
              employeeUpdate();
              break

          case 'Exit':
              connection.end();
              break;
      };
  } catch (err) {
      console.log(err);
      initialAction();
  };
}



// Selection to view all of the employees.
const employeeView = async () => {
  console.log('Employee View');
  try {
      let query = 'SELECT * FROM employee';
      connection.query(query, function (err, res) {
          if (err) throw err;
          let employeeArray = [];
          res.forEach(employee => employeeArray.push(employee));
          console.table(employeeArray);
          initialAction();
      });
  } catch (err) {
      console.log(err);
      initialAction();
  };
}

function viewAllEmployees() {
  connection.query(
    "select employee.first_name, employee.last_name, role.title, role.salary from employee inner join role on employee.role_id = role.id;",
    function (err, res) {
      console.table(res);
      init();
    }
  );
}

function viewAllRoles() {
  connection.query("select * from role;", function (err, res) {
    console.table(res);
    init();
  });
}

// Selection to view all of the departments.
const departmentView = async () => {
  console.log('Department View');
  try {
      let query = 'SELECT * FROM department';
      connection.query(query, function (err, res) {
          if (err) throw err;
          let departmentArray = [];
          res.forEach(department => departmentArray.push(department));
          console.table(departmentArray);
          initialAction();
      });
  } catch (err) {
      console.log(err);
      initialAction();
  };
}

function addData() {
  inquirer
    .prompt({
      name: "addMenu",
      type: "list",
      message: "What would you like to ADD?",
      choices: ["Add Employee", "Add Role", "Add Department"],
    })
    .then(function (answer) {
      switch (answer.addMenu) {
        case "Add Employee":
            connection.query("select * from role;", function (err, results) {
                if (err) throw err;
 
          inquirer
            .prompt([
              {
                name: "addEmployeeFirstName",
                type: "input",
                message: "Enter the employee's FIRST NAME: ",
              },
              {
                name: "addEmployeeLastName",
                type: "input",
                message: "Enter the employee's LAST NAME: ",
              },
              {
                name: "assignRole",
                type: "list",
                message: "Please select the employee's ROLE:",
                choices: function () {
                    var choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(i+1 + " " + results[i].title);
                    }
                    return choiceArray;
                }
              }        
            ])
            .then(function (answer) {
                var assignRoleID = parseInt(answer.assignRole[0]);
              connection.query("insert into employee (first_name, last_name, role_id) values (?, ?, ?)",
                [
                  answer.addEmployeeFirstName,
                  answer.addEmployeeLastName,
                  assignRoleID
                ],
                function (err, res) {
                  viewAllEmployees();
                }
              );
            });
        });
          break;
        case "Add Role":
          inquirer
            .prompt([
              {
                name: "addRole",
                type: "input",
                message: "Enter the name of the Role you want to ADD: ",
              },
              {
                name: "addSalary",
                type: "input",
                message: "What is the salary for that Role?",
              },
            ])
            .then(function (answer) {
              connection.query(
                "insert into role (title, salary) values (?, ?)",
                [answer.addRole, answer.addSalary],
                function (err, res) {
                  viewAllRoles();
                }
              );
            });
          break;
        case "Add Department":
          inquirer
            .prompt({
              name: "addDepartment",
              type: "input",
              message: "Enter the name of the Department you want to ADD: ",
            })
            .then(function (answer) {
              connection.query(
                "insert into department (name) values (?)",
                answer.addDepartment,
                function (err, res) {
                  viewAllDepartments();
                }
              );
            });
          break;
      }
    });
}

function updateData() {
  connection.query("select * from employee;", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "updateChooseEmployee",
        type: "list",
        message: "Please select the employee you wish to update: ",
        choices: function () {
          var choiceArray = [];
          for (let i = 0; i < results.length; i++) {
            choiceArray.push(
              i + 1 + " " + results[i].first_name + " " + results[i].last_name
            );
          }
          return choiceArray;
        },
      })
      .then(function (answer) {
        var chosenEmployeeID = parseInt(answer.updateChooseEmployee[0]);
        connection.query("select * from role;", function (err, results) {
          if (err) throw err;
          inquirer
            .prompt({
              name: "updateEmployeeRole",
              type: "list",
              message: "Please select the new role for the chosen employee: ",
              choices: function () {
                var choiceArray = [];
                for (let i = 0; i < results.length; i++) {
                  choiceArray.push(i + 1 + " " + results[i].title);
                }
                return choiceArray;
              },
            })
            .then(function (answer) {
              console.log(chosenEmployeeID);
              var updatedRoleID = parseInt(answer.updateEmployeeRole[0]);
              connection.query(
                "update employee set role_id = ? where id = ?;",
                [updatedRoleID,
                chosenEmployeeID],
                function (err) {
                  if (err) throw err;
                  console.log("Employee role updated successfully!");
                  viewAllEmployees();
                }
              );
            });
        });
      });
  });
}