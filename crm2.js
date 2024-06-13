"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql"); // Import the MySQL module
var readline = require("readline"); // Import the readline module for reading user input
var dotenv = require("dotenv"); //Import the dotenv module to read .env file
// Load environment variables from .env file
dotenv.config();
// Create a readline interface for input and output
var rl = readline.createInterface({
    input: process.stdin, // Use standard input (keyboard) for input
    output: process.stdout, // Use standard output (console) for output
});
// Promisify the readline.question method to use async/await
function question(query) {
    return new Promise(function (resolve) {
        rl.question(query, resolve); // Resolve the promise with the user's input
    });
}
// Create a MySQL connection with specified configuration
var connection = mysql.createConnection({
    host: process.env.DB_HOST, // Database host
    user: process.env.DB_USER, // Database user
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name
});
// Connect to the MySQL database
connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to the database: ', err); // Log any connection error
        return;
    }
    console.log('Connected to the database'); // Log successful connection
});
// SQL query to create the 'companies' table if it doesn't exist
var createCompaniesTableQuery = "\n  CREATE TABLE IF NOT EXISTS companies (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(255) NOT NULL\n  );\n";
// SQL query to create the 'employees' table if it doesn't exist
var createEmployeesTableQuery = "\n  CREATE TABLE IF NOT EXISTS employees (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(255) NOT NULL\n  );\n";
// SQL query to create the 'employee_company' join table if it doesn't exist
var createEmployeeCompanyTableQuery = "\n  CREATE TABLE IF NOT EXISTS employee_company (\n    employee_id INT,\n    company_id INT,\n    PRIMARY KEY (employee_id, company_id),\n    FOREIGN KEY (employee_id) REFERENCES employees(id),\n    FOREIGN KEY (company_id) REFERENCES companies(id)\n  );\n";
// Execute the query to create the 'companies' table
connection.query(createCompaniesTableQuery, function (err, results) {
    if (err) {
        console.error('Error creating companies table: ', err); // Log any error
        return;
    }
    console.log('Companies table created successfully'); // Log successful creation
    // Execute the query to create the 'employees' table
    connection.query(createEmployeesTableQuery, function (err, results) {
        if (err) {
            console.error('Error creating employees table: ', err); // Log any error
            return;
        }
        console.log('Employees table created successfully'); // Log successful creation
        // Execute the query to create the 'employee_company' table
        connection.query(createEmployeeCompanyTableQuery, function (err, results) {
            if (err) {
                console.error('Error creating employee_company table: ', err); // Log any error
                return;
            }
            console.log('Employee_Company table created successfully'); // Log successful creation
        });
    });
});
// Function to create a new company
function createCompany() {
    return __awaiter(this, void 0, void 0, function () {
        var name, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter company name: ')];
                case 1:
                    name = _a.sent();
                    query = 'INSERT INTO companies (name) VALUES (?)';
                    connection.query(query, [name], function (err, results) {
                        if (err) {
                            console.error('Error creating company: ', err); // Log any error
                            return;
                        }
                        console.log('Company created successfully'); // Log successful creation
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Function to create a new employee and associate with companies
function createEmployee() {
    return __awaiter(this, void 0, void 0, function () {
        var name, companyIds, insertEmployeeQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter employee name: ')];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, question('Enter company IDs (comma-separated): ')];
                case 2:
                    companyIds = _a.sent();
                    insertEmployeeQuery = 'INSERT INTO employees (name) VALUES (?)';
                    connection.query(insertEmployeeQuery, [name], function (err, results) {
                        if (err) {
                            console.error('Error creating employee: ', err); // Log any error
                            return;
                        }
                        var employeeId = results.insertId; // Get the new employee's ID
                        // Associate the employee with the specified companies
                        var companyIdArray = companyIds.split(',').map(function (id) { return id.trim(); }); // Parse company IDs
                        var insertEmployeeCompanyQuery = 'INSERT INTO employee_company (employee_id, company_id) VALUES ?';
                        var values = companyIdArray.map(function (companyId) { return [employeeId, companyId]; }); // Create value pairs
                        connection.query(insertEmployeeCompanyQuery, [values], function (err, results) {
                            if (err) {
                                console.error('Error associating employee with companies: ', err); // Log any error
                                return;
                            }
                            console.log('Employee created and associated with companies successfully'); // Log success
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Function to read and display all companies
function readCompanies() {
    var query = 'SELECT * FROM companies'; // SQL query to select all companies
    connection.query(query, function (err, results) {
        if (err) {
            console.error('Error reading companies: ', err); // Log any error
            return;
        }
        console.log('Companies:');
        results.forEach(function (company) {
            console.log("ID: ".concat(company.id, ", Name: ").concat(company.name)); // Display each company
        });
    });
}
// Function to read and display all employees with their associated companies
function readEmployees() {
    var query = "\n    SELECT e.id, e.name, GROUP_CONCAT(c.name) AS companies\n    FROM employees e\n    LEFT JOIN employee_company ec ON e.id = ec.employee_id\n    LEFT JOIN companies c ON ec.company_id = c.id\n    GROUP BY e.id, e.name;\n  "; // SQL query to select employees and their associated companies
    connection.query(query, function (err, results) {
        if (err) {
            console.error('Error reading employees: ', err); // Log any error
            return;
        }
        console.log('Employees:');
        results.forEach(function (employee) {
            console.log("ID: ".concat(employee.id, ", Name: ").concat(employee.name, ", Companies: ").concat(employee.companies)); // Display each employee
        });
    });
}
// Function to update a company's name
function updateCompany() {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, newName, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter company ID: ')];
                case 1:
                    companyId = _a.sent();
                    return [4 /*yield*/, question('Enter new company name: ')];
                case 2:
                    newName = _a.sent();
                    query = 'UPDATE companies SET name = ? WHERE id = ?';
                    connection.query(query, [newName, companyId], function (err, results) {
                        if (err) {
                            console.error('Error updating company: ', err); // Log any error
                            return;
                        }
                        console.log('Company updated successfully'); // Log success
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Function to update an employee's name and company associations
function updateEmployee() {
    return __awaiter(this, void 0, void 0, function () {
        var employeeId, newName, newCompanyIds, updateEmployeeQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter employee ID: ')];
                case 1:
                    employeeId = _a.sent();
                    return [4 /*yield*/, question('Enter new employee name: ')];
                case 2:
                    newName = _a.sent();
                    return [4 /*yield*/, question('Enter new company IDs (comma-separated): ')];
                case 3:
                    newCompanyIds = _a.sent();
                    updateEmployeeQuery = 'UPDATE employees SET name = ? WHERE id = ?';
                    connection.query(updateEmployeeQuery, [newName, employeeId], function (err, results) {
                        if (err) {
                            console.error('Error updating employee: ', err); // Log any error
                            return;
                        }
                        // Remove existing company associations for the employee
                        var deleteAssociationsQuery = 'DELETE FROM employee_company WHERE employee_id = ?';
                        connection.query(deleteAssociationsQuery, [employeeId], function (err, results) {
                            if (err) {
                                console.error('Error removing existing company associations: ', err); // Log any error
                                return;
                            }
                            // Associate the employee with the new companies
                            var companyIdArray = newCompanyIds.split(',').map(function (id) { return id.trim(); }); // Parse new company IDs
                            var insertEmployeeCompanyQuery = 'INSERT INTO employee_company (employee_id, company_id) VALUES ?';
                            var values = companyIdArray.map(function (companyId) { return [employeeId, companyId]; }); // Create value pairs
                            connection.query(insertEmployeeCompanyQuery, [values], function (err, results) {
                                if (err) {
                                    console.error('Error associating employee with new companies: ', err); // Log any error
                                    return;
                                }
                                console.log('Employee updated successfully'); // Log success
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Function to delete a company and its associations
function deleteCompany() {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, deleteCompanyQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter company ID: ')];
                case 1:
                    companyId = _a.sent();
                    deleteCompanyQuery = 'DELETE FROM companies WHERE id = ?';
                    connection.query(deleteCompanyQuery, [companyId], function (err, results) {
                        if (err) {
                            console.error('Error deleting company: ', err); // Log any error
                            return;
                        }
                        // Remove the associations from the employee_company table
                        var deleteAssociationsQuery = 'DELETE FROM employee_company WHERE company_id = ?';
                        connection.query(deleteAssociationsQuery, [companyId], function (err, results) {
                            if (err) {
                                console.error('Error removing company associations: ', err); // Log any error
                                return;
                            }
                            console.log('Company deleted successfully'); // Log success
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Function to delete an employee and its associations
function deleteEmployee() {
    return __awaiter(this, void 0, void 0, function () {
        var employeeId, deleteAssociationsQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, question('Enter employee ID: ')];
                case 1:
                    employeeId = _a.sent();
                    deleteAssociationsQuery = 'DELETE FROM employee_company WHERE employee_id = ?';
                    connection.query(deleteAssociationsQuery, [employeeId], function (err, results) {
                        if (err) {
                            console.error('Error removing employee associations: ', err); // Log any error
                            return;
                        }
                        // Delete the employee from the employees table
                        var deleteEmployeeQuery = 'DELETE FROM employees WHERE id = ?';
                        connection.query(deleteEmployeeQuery, [employeeId], function (err, results) {
                            if (err) {
                                console.error('Error deleting employee: ', err); // Log any error
                                return;
                            }
                            console.log('Employee deleted successfully'); // Log success
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Main function to run the CRM menu
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!true) return [3 /*break*/, 19];
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
                    return [4 /*yield*/, question('Enter your choice (1-9): ')];
                case 1:
                    choice = _b.sent();
                    _a = choice;
                    switch (_a) {
                        case '1': return [3 /*break*/, 2];
                        case '2': return [3 /*break*/, 4];
                        case '3': return [3 /*break*/, 6];
                        case '4': return [3 /*break*/, 7];
                        case '5': return [3 /*break*/, 8];
                        case '6': return [3 /*break*/, 10];
                        case '7': return [3 /*break*/, 12];
                        case '8': return [3 /*break*/, 14];
                        case '9': return [3 /*break*/, 16];
                    }
                    return [3 /*break*/, 17];
                case 2: return [4 /*yield*/, createCompany()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 4: return [4 /*yield*/, createEmployee()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 6:
                    readCompanies();
                    return [3 /*break*/, 18];
                case 7:
                    readEmployees();
                    return [3 /*break*/, 18];
                case 8: return [4 /*yield*/, updateCompany()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 10: return [4 /*yield*/, updateEmployee()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 12: return [4 /*yield*/, deleteCompany()];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 14: return [4 /*yield*/, deleteEmployee()];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 16:
                    // Close the database connection and readline interface
                    connection.end(function (err) {
                        if (err) {
                            console.error('Error closing the database connection: ', err); // Log any error
                            return;
                        }
                        console.log('Database connection closed'); // Log success
                    });
                    rl.close();
                    process.exit(0); // Exit the process
                    _b.label = 17;
                case 17:
                    console.log('Invalid choice. Please try again.'); // Handle invalid choice
                    _b.label = 18;
                case 18: return [3 /*break*/, 0];
                case 19: return [2 /*return*/];
            }
        });
    });
}
main(); // Run the main function
