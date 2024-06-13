import * as mysql from 'mysql';
import * as readline from 'readline';

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify the question method
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Create a MySQL connection
const connection: mysql.Connection = mysql.createConnection({
  host: 'localhost',
  user: 'crm_user',
  password: '32Fl0r3nc301',
  database: 'crm_db',
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

// Create tables if they don't exist
const createCompaniesTableQuery = `
  CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

const createEmployeesTableQuery = `
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

const createEmployeeCompanyTableQuery = `
  CREATE TABLE IF NOT EXISTS employee_company (
    employee_id INT,
    company_id INT,
    PRIMARY KEY (employee_id, company_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
  );
`;

connection.query(createCompaniesTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating companies table: ', err);
    return;
  }
  console.log('Companies table created successfully');

  connection.query(createEmployeesTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating employees table: ', err);
      return;
    }
    console.log('Employees table created successfully');

    connection.query(createEmployeeCompanyTableQuery, (err, results) => {
      if (err) {
        console.error('Error creating employee_company table: ', err);
        return;
      }
      console.log('Employee_Company table created successfully');
    });
  });
});

async function createCompany() {
  const name = await question('Enter company name: ');
  const query = 'INSERT INTO companies (name) VALUES (?)';
  connection.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error creating company: ', err);
      return;
    }
    console.log('Company created successfully');
  });
}

async function createEmployee() {
  const name = await question('Enter employee name: ');
  const companyIds = await question('Enter company IDs (comma-separated): ');
  
  // Insert the employee into the employees table
  const insertEmployeeQuery = 'INSERT INTO employees (name) VALUES (?)';
  connection.query(insertEmployeeQuery, [name], (err, results) => {
    if (err) {
      console.error('Error creating employee: ', err);
      return;
    }
    
    const employeeId = results.insertId;
    
    // Associate the employee with the specified companies
    const companyIdArray = companyIds.split(',').map(id => id.trim());
    const insertEmployeeCompanyQuery = 'INSERT INTO employee_company (employee_id, company_id) VALUES ?';
    const values = companyIdArray.map(companyId => [employeeId, companyId]);
    
    connection.query(insertEmployeeCompanyQuery, [values], (err, results) => {
      if (err) {
        console.error('Error associating employee with companies: ', err);
        return;
      }
      console.log('Employee created and associated with companies successfully');
    });
  });
}

function readCompanies() {
  const query = 'SELECT * FROM companies';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading companies: ', err);
      return;
    }
    console.log('Companies:');
    results.forEach((company) => {
      console.log(`ID: ${company.id}, Name: ${company.name}`);
    });
  });
}

function readEmployees() {
  const query = `
    SELECT e.id, e.name, GROUP_CONCAT(c.name) AS companies
    FROM employees e
    LEFT JOIN employee_company ec ON e.id = ec.employee_id
    LEFT JOIN companies c ON ec.company_id = c.id
    GROUP BY e.id, e.name;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading employees: ', err);
      return;
    }
    console.log('Employees:');
    results.forEach((employee) => {
      console.log(`ID: ${employee.id}, Name: ${employee.name}, Companies: ${employee.companies}`);
    });
  });
}

async function updateCompany() {
  const companyId = await question('Enter company ID: ');
  const newName = await question('Enter new company name: ');
  const query = 'UPDATE companies SET name = ? WHERE id = ?';
  connection.query(query, [newName, companyId], (err, results) => {
    if (err) {
      console.error('Error updating company: ', err);
      return;
    }
    console.log('Company updated successfully');
  });
}

async function updateEmployee() {
  const employeeId = await question('Enter employee ID: ');
  const newName = await question('Enter new employee name: ');
  const newCompanyIds = await question('Enter new company IDs (comma-separated): ');

  // Update the employee name in the employees table
  const updateEmployeeQuery = 'UPDATE employees SET name = ? WHERE id = ?';
  connection.query(updateEmployeeQuery, [newName, employeeId], (err, results) => {
    if (err) {
      console.error('Error updating employee: ', err);
      return;
    }

    // Remove existing company associations for the employee
    const deleteAssociationsQuery = 'DELETE FROM employee_company WHERE employee_id = ?';
    connection.query(deleteAssociationsQuery, [employeeId], (err, results) => {
      if (err) {
        console.error('Error removing existing company associations: ', err);
        return;
      }

      // Associate the employee with the new companies
      const companyIdArray = newCompanyIds.split(',').map(id => id.trim());
      const insertEmployeeCompanyQuery = 'INSERT INTO employee_company (employee_id, company_id) VALUES ?';
      const values = companyIdArray.map(companyId => [employeeId, companyId]);

      connection.query(insertEmployeeCompanyQuery, [values], (err, results) => {
        if (err) {
          console.error('Error associating employee with new companies: ', err);
          return;
        }
        console.log('Employee updated successfully');
      });
    });
  });
}

async function deleteCompany() {
  const companyId = await question('Enter company ID: ');

  // Delete the company from the companies table
  const deleteCompanyQuery = 'DELETE FROM companies WHERE id = ?';
  connection.query(deleteCompanyQuery, [companyId], (err, results) => {
    if (err) {
      console.error('Error deleting company: ', err);
      return;
    }

    // Remove the associations from the employee_company table
    const deleteAssociationsQuery = 'DELETE FROM employee_company WHERE company_id = ?';
    connection.query(deleteAssociationsQuery, [companyId], (err, results) => {
      if (err) {
        console.error('Error removing company associations: ', err);
        return;
      }
      console.log('Company deleted successfully');
    });
  });
}

async function deleteEmployee() {
  const employeeId = await question('Enter employee ID: ');

  // Remove the associations from the employee_company table
  const deleteAssociationsQuery = 'DELETE FROM employee_company WHERE employee_id = ?';
  connection.query(deleteAssociationsQuery, [employeeId], (err, results) => {
    if (err) {
      console.error('Error removing employee associations: ', err);
      return;
    }

    // Delete the employee from the employees table
    const deleteEmployeeQuery = 'DELETE FROM employees WHERE id = ?';
    connection.query(deleteEmployeeQuery, [employeeId], (err, results) => {
      if (err) {
        console.error('Error deleting employee: ', err);
        return;
      }
      console.log('Employee deleted successfully');
    });
  });
}

async function main() {
  while (true) {
    console.log('\nCRM Menu:');
    console.log('1. Create Company');
    console.log('2. Create Employee');
    console.log('3. Read Companies');
    console.log('4. Read Employees');
    console.log('5. Update Company');
    console.log('6. Update Employee');
    console.log('7. Delete Company');
    console.log('8. Delete Employee');
    console.log('9. Exit');

    const choice = await question('Enter your choice (1-9): ');

    switch (choice) {
      case '1':
        await createCompany();
        break;
      case '2':
        await createEmployee();
        break;
      case '3':
        readCompanies();
        break;
      case '4':
        readEmployees();
        break;
      case '5':
        await updateCompany();
        break;
      case '6':
        await updateEmployee();
        break;
      case '7':
        await deleteCompany();
        break;
      case '8':
        await deleteEmployee();
        break;
      case '9':
        connection.end((err) => {
          if (err) {
            console.error('Error closing the database connection: ', err);
            return;
          }
          console.log('Database connection closed');
        });
        rl.close();
        process.exit(0);
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

main();
