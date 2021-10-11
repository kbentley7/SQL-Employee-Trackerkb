INSERT INTO department (name)
VALUES 
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 70000, 1),
('Software Engineer', 110000, 1),
('Accountant', 9000, 2), 
('Finanical Analyst', 140000, 2),
('Marketing Coordindator', 60000, 3), 
('Sales Lead', 80000, 3),
('Project Manager', 90000, 4),
('Operations Manager', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Bruce', 'Lee', 2, null),
('Jim', 'Kelly', 1, 1),
('Polly', 'Shang-Kwan', 4, null),
('Angela', 'Mao', 3, 3),
('Sonny', 'Chiba', 6, null),
('Jackie', 'Chan', 5, 5),
('Gordon', 'Lui', 7, null),
('Cynthia', 'Rothrock', 8, 7);