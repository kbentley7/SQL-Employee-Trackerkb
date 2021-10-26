
USE employee_db;



--add department
INSERT INTO department
    (name)
VALUES
    ("Human Resources"),
    ("R&D"),
    ("Engineering"),
    ("Accounting"),
    ("Sales");

-- add role
INSERT INTO role
    (title, salary, department_id)
VALUES
("manager", 75000.00, 2),
("engineer", 52000, 3),
("accountant", 62500, 4),
("recruiter", 57500, 1),
("sales person", 85650, 5);

--add employee
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
("Bruce", "Lee", 1, NULL),
("Angela", "Mao", 1, 1),
("Jet", "Li", 3, 2),
("Sonny", "Chiba", 5, 2);