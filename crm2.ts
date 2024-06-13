import * as mysql from 'mysql';  // Import the MySQL module
import * as readline from 'readline';  // Import the readline module for reading user input
import * as dotenv from 'dotenv'; //Import the dotenv module to read .env file

// Load environment variables from .env file
dotenv.config();

// Create a readline interface for input and output
const rl = readline.createInterface({
  input: process.stdin,  // Use standard input (keyboard) for input
  output: process.stdout,  // Use standard output (console) for output
});

// Promisify the readline.question method to use async/await
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);  // Resolve the promise with the user's input
  });
}

// Create a MySQL connection with specified configuration
const connection: mysql.Connection = mysql.createConnection({
  host: process.env.DB_HOST,  // Database host
  user: process.env.DB_USER,  // Database user
  password: process.env.DB_PASSWORD,  // Database password
  database: process.env.DB_NAME,  // Database name
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);  // Log any connection error
    return;
  }
  console.log('Connected to the database');  // Log successful connection
});

// SQL query to create the 'companies' table if it doesn't exist
const createCompaniesTableQuery = `
  CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

// SQL query to create the 'employees' table if it doesn't exist
const createEmployeesTableQuery = `
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

// SQL query to create the 'employee_company' join table if it doesn't exist
const createEmployeeCompanyTableQuery = `
  CREATE TABLE IF NOT EXISTS employee_company (
    employee_id INT,
    company_id INT,
    PRIMARY KEY (employee_id, company_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
  );
`;

// Execute the query to create the 'companies' table
connection.query(createCompaniesTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating companies table: ', err);  // Log any error
    return;
  }
  console.log('Companies table created successfully');  // Log successful creation

  // Execute the query to create the 'employees' table
  connection.query(createEmployeesTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating employees table: ', err);  // Log any error
      return;
    }
    console.log('Employees table created successfully');  // Log successful creation

    // Execute the query to create the 'employee_company' table
    connection.query(createEmployeeCompanyTableQuery, (err, results) => {
      if (err) {
        console.error('Error creating employee_company table: ', err);  // Log any error
        return;
      }
      console.log('Employee_Company table created successfully');  // Log successful creation
    });
  });
});

// Function to create a new company
async function createCompany() {
  const name = await question('Enter company name: ');  // Prompt user for company name
  const query = 'INSERT INTO companies (name) VALUES (?)';  // SQL query to insert company
  connection.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error creating company: ', err);  // Log any error
      return;
    }
    console.log('Company created successfully');  // Log successful creation
  });
}

// Function to create a new employee and associate with companies
async function createEmployee() {
  const name = await question('Enter employee name: ');  // Prompt user for employee name
  const companyIds = await question('Enter company IDs (comma-separated): ');  // Prompt for company IDs

  // Insert the employee into the employees table
  const insertEmployeeQuery = 'INSERT INTO employees (name) VALUES (?)';
  connection.query(insertEmployeeQuery, [name], (err, results) => {
    if (err) {
      console.error('Error creating employee: ', err);  // Log any error
      return;
    }

    const employeeId = results.insertId;  // Get the new employee's ID

    // Associate the employee with the specified companies
    const companyIdArray = companyIds.split(',').map(id => id.trim());  // Parse company IDs
    const insertEmployeeCompanyQuery = 'INSERT INTO employee_company (employee_id, company_id) VALUES ?';
    const values = companyIdArray.map(companyId => [employeeId, companyId]);  // Create value pairs

    connection.query(insertEmployeeCompanyQuery, [values], (err, results) => {
      if (err) {
        console.error('Error associating employee with companies: ', err);  // Log any error
        return;
      }
      console.log('Employee created and associated with companies successfully');  // Log success
    });
  });
}

// Function to read and display all companies
function readCompanies() {
  const query = 'SELECT * FROM companies';  // SQL query to select all companies
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading companies: ', err);  // Log any error
      return;
    }
    console.log('Companies:');
    results.forEach((company) => {
      console.log(`ID: ${company.id}, Name: ${company.name}`);  // Display each company
    });
  });
}

// Function to read and display all employees with their associated companies
function readEmployees() {
  const query = `
    SELECT e.id, e.name, GROUP_CONCAT(c.name) AS companies
    FROM employees e
    LEFT JOIN employee_company ec ON e.id = ec.employee_id
    LEFT JOIN companies c ON ec.company_id = c.id
    GROUP BY e.id, e.name;
  `;  // SQL query to select employees and their associated companies

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading employees: ', err);  // Log any error
      return;
    }
    console.log('Employees:');
    results.forEach((employee) => {
      console.log(`ID: ${employee.id}, Name: ${employee.name}, Companies: ${employee.companies}`);  // Display each employee
    });
  });
}

// Function to update a company's name
async function updateCompany() {
  const companyId = await question('Enter company ID: ');  // Prompt for company ID
  const newName = await question('Enter new company name: ');  // Prompt for new company name
  const query = 'UPDATE companies SET name = ? WHERE id = ?';  // SQL query to update company
  connection.query(query, [newName, companyId], (err, results) => {
    if (err) {
      console.error('Error updating company: ', err);  // Log any error
      return;
    }
    console.log('Company updated successfully');  // Log success
  });
}

// Function to update an employee's name and company associations
async function updateEmployee() {
  const employeeId = await question('Enter employee ID: ');  // Prompt for employee ID
  const newName = await question('Enter new employee name: ');  // Prompt for new employee name
  const newCompanyIds = await question('Enter new company IDs (comma-separated): ');  // Prompt for new company IDs

  // Update the employee name in the employees table
  const updateEmployeeQuery = 'UPDATE employees SET name = ? WHERE id = ?';
  connection.query(updateEmployeeQuery, [newName, employeeId], (err, results) => {
    if (err) {
      console.error('Error updating employee: ', err);  // Log any error
      return;
    }

    // Remove existing company associations for the employee
    const deleteAssociationsQuery = 'DELETE FROM employee_company WHERE employee_id = ?';
    connection.query(deleteAssociationsQuery, [employeeId], (err, results) => {
      if (err) {
        console.error('Error removing existing company associations: ', err);  // Log any error
        return;
      }

      // Associate the employee with the new companies
      const companyIdArray = newCompanyIds.split(',').map(id => id.trim());  // Parse new company IDs
      const insertEmployeeCompanyQuery = 'INSERT INTO employee_company (employee_id, company_id) VALUES ?';
      const values = companyIdArray.map(companyId => [employeeId, companyId]);  // Create value pairs

      connection.query(insertEmployeeCompanyQuery, [values], (err, results) => {
        if (err) {
          console.error('Error associating employee with new companies: ', err);  // Log any error
          return;
        }
        console.log('Employee updated successfully');  // Log success
      });
    });
  });
}

// Function to delete a company and its associations
async function deleteCompany() {
  const companyId = await question('Enter company ID: ');  // Prompt for company ID

  // Delete the company from the companies table
  const deleteCompanyQuery = 'DELETE FROM companies WHERE id = ?';
  connection.query(deleteCompanyQuery, [companyId], (err, results) => {
    if (err) {
      console.error('Error deleting company: ', err);  // Log any error
      return;
    }

    // Remove the associations from the employee_company table
    const deleteAssociationsQuery = 'DELETE FROM employee_company WHERE company_id = ?';
    connection.query(deleteAssociationsQuery, [companyId], (err, results) => {
      if (err) {
        console.error('Error removing company associations: ', err);  // Log any error
        return;
      }
      console.log('Company deleted successfully');  // Log success
    });
  });
}

// Function to delete an employee and its associations
async function deleteEmployee() {
  const employeeId = await question('Enter employee ID: ');  // Prompt for employee ID

  // Remove the associations from the employee_company table
  const deleteAssociationsQuery = 'DELETE FROM employee_company WHERE employee_id = ?';
  connection.query(deleteAssociationsQuery, [employeeId], (err, results) => {
    if (err) {
      console.error('Error removing employee associations: ', err);  // Log any error
      return;
    }

    // Delete the employee from the employees table
    const deleteEmployeeQuery = 'DELETE FROM employees WHERE id = ?';
    connection.query(deleteEmployeeQuery, [employeeId], (err, results) => {
      if (err) {
        console.error('Error deleting employee: ', err);  // Log any error
        return;
      }
      console.log('Employee deleted successfully');  // Log success
    });
  });
}

// Main function to run the CRM menu
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

    const choice = await question('Enter your choice (1-9): ');  // Prompt for user choice

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
        // Close the database connection and readline interface
        connection.end((err) => {
          if (err) {
            console.error('Error closing the database connection: ', err);  // Log any error
            return;
          }
          console.log('Database connection closed');  // Log success
        });
        rl.close();
        process.exit(0);  // Exit the process
      default:
        console.log('Invalid choice. Please try again.');  // Handle invalid choice
    }
  }
}

main();  // Run the main function
