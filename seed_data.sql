-- Drop existing tables if they exist
DROP TABLE IF EXISTS employee_company;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS companies;

-- Create the tables
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE employee_company (
    employee_id INT,
    company_id INT,
    PRIMARY KEY (employee_id, company_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Insert data into companies
INSERT INTO companies (name) VALUES
    ('Acme Inc.'),
    ('Globex Corporation'),
    ('Initech'),
    ('Umbrella Corporation'),
    ('Stark Industries'),
    ('Wayne Enterprises'),
    ('Oscorp Industries'),
    ('Cyberdyne Systems'),
    ('Wonka Industries'),
    ('Genco Pura Olive Oil Company');

-- Insert data into employees
INSERT INTO employees (name) VALUES
    ('John Doe'),
    ('Jane Smith'),
    ('Michael Johnson'),
    ('Emily Brown'),
    ('David Lee'),
    ('Sarah Davis'),
    ('Robert Wilson'),
    ('Jennifer Taylor'),
    ('Christopher Anderson'),
    ('Jessica Martinez'),
    ('Matthew Thomas'),
    ('Ashley Moore'),
    ('Joshua Jackson'),
    ('Amanda White'),
    ('Daniel Harris'),
    ('Olivia Thompson'),
    ('James Martin'),
    ('Sophia Garcia'),
    ('Andrew Robinson'),
    ('Elizabeth Clark'),
    ('Joseph Rodriguez'),
    ('Victoria Lewis'),
    ('William Walker'),
    ('Natalie Hall'),
    ('Liam Allen'),
    ('Ava Young'),
    ('Ethan King'),
    ('Mia Wright'),
    ('Noah Scott'),
    ('Isabella Green'),
    ('Mason Baker'),
    ('Chloe Adams'),
    ('Jacob Nelson'),
    ('Ella Carter'),
    ('Benjamin Mitchell'),
    ('Avery Turner'),
    ('Scarlett Phillips');

-- Insert data into employee_company (associating employees with companies)
INSERT INTO employee_company (employee_id, company_id) VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 2),
    (6, 2),
    (7, 2),
    (8, 3),
    (9, 3),
    (10, 3),
    (11, 3),
    (12, 4),
    (13, 4),
    (14, 4),
    (15, 5),
    (16, 5),
    (17, 5),
    (18, 5),
    (19, 6),
    (20, 6),
    (21, 6),
    (22, 7),
    (23, 7),
    (24, 7),
    (25, 7),
    (26, 8),
    (27, 8),
    (28, 8),
    (29, 9),
    (30, 9),
    (31, 9),
    (32, 9),
    (33, 10),
    (34, 10),
    (35, 10),
    (36, 10),
    (37, 10);
