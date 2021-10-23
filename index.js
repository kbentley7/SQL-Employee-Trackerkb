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

// Selection to view all of the roles.
const roleView = async () => {
  console.log('Role View');
  try {
      let query = 'SELECT * FROM role';
      connection.query(query, function (err, res) {
          if (err) throw err;
          let roleArray = [];
          res.forEach(role => roleArray.push(role));
          console.table(roleArray);
          initialAction();
      });
  } catch (err) {
      console.log(err);
      initialAction();
  };
}

// Selection to add a new employee.
const employeeAdd = async () => {
  try {
      console.log('Employee Add');

      let roles = await connection.query("SELECT * FROM role");

      let managers = await connection.query("SELECT * FROM employee");

      let answer = await inquirer.prompt([
          {
              name: 'firstName',
              type: 'input',
              message: 'What is the first name of this Employee?'
          },
          {
              name: 'lastName',
              type: 'input',
              message: 'What is the last name of this Employee?'
          },
          {
              name: 'employeeRoleId',
              type: 'list',
              choices: roles.map((role) => {
                  return {
                      name: role.title,
                      value: role.id
                  }
              }),
              message: "What is this Employee's role id?"
          },
          {
              name: 'employeeManagerId',
              type: 'list',
              choices: managers.map((manager) => {
                  return {
                      name: manager.first_name + " " + manager.last_name,
                      value: manager.id
                  }
              }),
              message: "What is this Employee's Manager's Id?"
          }
      ])

      let result = await connection.query("INSERT INTO employee SET ?", {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: (answer.employeeRoleId),
          manager_id: (answer.employeeManagerId)
      });

      console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
      initialAction();

  } catch (err) {
      console.log(err);
      initialAction();
  };
}

// Selection to add a new role.
const roleAdd = async () => {
  try {
      console.log('Role Add');

      let departments = await connection.query("SELECT * FROM department")

      let answer = await inquirer.prompt([
          {
              name: 'title',
              type: 'input',
              message: 'What is the name of your new role?'
          },
          {
              name: 'salary',
              type: 'input',
              message: 'What salary will this role provide?'
          },
          {
              name: 'departmentId',
              type: 'list',
              choices: departments.map((departmentId) => {
                  return {
                      name: departmentId.department_name,
                      value: departmentId.id
                  }
              }),
              message: 'What department ID is this role associated with?',
          }
      ]);
      
      let chosenDepartment;
      for (i = 0; i < departments.length; i++) {
          if(departments[i].department_id === answer.choice) {
              chosenDepartment = departments[i];
          };
      }
      let result = await connection.query("INSERT INTO role SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
      })

      console.log(`${answer.title} role added successfully.\n`)
      initialAction();

  } catch (err) {
      console.log(err);
      initialAction();
  };
}


// Selection to add a new department.
const departmentAdd = async () => {
  try {
      console.log('Department Add');

      let answer = await inquirer.prompt([
          {
              name: 'deptName',
              type: 'input',
              message: 'What is the name of your new department?'
          }
      ]);

      let result = await connection.query("INSERT INTO department SET ?", {
          department_name: answer.deptName
      });

      console.log(`${answer.deptName} added successfully to departments.\n`)
      initialAction();

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

// Selection to add a new role.
const roleAdd = async () => {
  try {
      console.log('Role Add');

      let departments = await connection.query("SELECT * FROM department")

      let answer = await inquirer.prompt([
          {
              name: 'title',
              type: 'input',
              message: 'What is the name of your new role?'
          },
          {
              name: 'salary',
              type: 'input',
              message: 'What salary will this role provide?'
          },
          {
              name: 'departmentId',
              type: 'list',
              choices: departments.map((departmentId) => {
                  return {
                      name: departmentId.department_name,
                      value: departmentId.id
                  }
              }),
              message: 'What department ID is this role associated with?',
          }
      ]);
      
      let chosenDepartment;
      for (i = 0; i < departments.length; i++) {
          if(departments[i].department_id === answer.choice) {
              chosenDepartment = departments[i];
          };
      }
      let result = await connection.query("INSERT INTO role SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
      })

      console.log(`${answer.title} role added successfully.\n`)
      initialAction();

  } catch (err) {
      console.log(err);
      initialAction();
  };
}

