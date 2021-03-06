const inquirer = require('inquirer');
const cTable = require('console.table');

const {
    getEmployeeID,
    getAllEmployees,
    getAllEmployeesDetails,
    getManagerByID,
    getAllEmployeesByDepartment,
    getAllEmployeesByManager,
    getAllManagers,
    insertEmployee,
    setEmployeeManager,
    deleteEmployee,
    setEmployeeRole
} = require('../models/employee');
const { getAllDepartmentNames } = require('./department');
const { getDepartmentID } = require('../models/department');
const { getAllTitles, getRoleID } = require('../models/role');
const { displayHeadline, displayFooter } = require('../utils/logging');

async function displayAllEmployees() {
    try {
        const employees = await getAllEmployeesDetails();
        for (const employee of employees) {
            if (employee['manager_id'] !== null) {
                employee.Manager = await getManagerByID(employee['manager_id']);
                delete employee['manager_id'];
            } else {
                employee.Manager = 'None';
                delete employee['manager_id'];
            }
        }
        const footer = displayHeadline('All Employees');
        console.table(employees);
        displayFooter(footer);
    } catch (err) {
        if (err) {
            throw err;
        }
    }
}

async function displayAllEmployeesByDepartment() {
    try {
        const departmentNames = await getAllDepartmentNames();

        const department = await inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Please select a department ?',
            choices: departmentNames
        }]);

        const departmentID = await getDepartmentID(department.name);

        const employees = await getAllEmployeesByDepartment(departmentID);

        const footer = displayHeadline(`All Employees in ${department.name}`);
        console.table(employees);
        displayFooter(footer);
    } catch (err) {
        if (err) throw err;
    }
}

async function displayAllEmployeesByManager() {
    try {
        const managers = await getAllManagers();
        const manager = await inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Please select a department ?',
            choices: managers
        }]);

        const managerID = await getEmployeeID(manager.name);

        const employeesManaged = await getAllEmployeesByManager(managerID);

        const footer = displayHeadline(`All Employees under ${manager.name}`);
        console.table(employeesManaged);
        displayFooter(footer);
    } catch (err) {
        if (err) throw err;
    }
}

async function addEmployee() {
    // Get all titles from the role table
    const titles = await getAllTitles();

    // Get the list of employees from employee table
    const employees = await getAllEmployees();
    employees.unshift('None');

    try {
        const employee = await inquirer.prompt([{
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name? "
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name? "
            },
            {
                type: 'list',
                name: 'title',
                message: "What is employee's role? ",
                choices: titles
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is employee's manager ?",
                choices: employees
            }
        ]);

        employee.roleID = await getRoleID(employee.title);
        employee.managerID = await getEmployeeID(employee.manager);

        await insertEmployee(employee);
    } catch (err) {
        if (err) throw err;
    }
}

async function removeEmployee() {
    try {
        // Get the list of employees from employee table
        const employees = await getAllEmployees();

        const employee = await inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Which employee would you like to remove ?',
            choices: employees
        }]);

        const managers = await getAllManagers();

        if (managers.includes(employee.name)) {
            const managerID = await getEmployeeID(employee.name);
            const employeesManaged = await getAllEmployeesByManager(managerID);

            for (let employeeManaged of employeesManaged) {
                employeeManaged =
                    employeeManaged['First Name'] + ' ' + employeeManaged['Last Name'];
                setEmployeeManager(employeeManaged);
            }

            deleteEmployee(employee.name);
        } else {
            deleteEmployee(employee.name);
        }
    } catch (err) {
        if (err) throw err;
    }
}

async function updateEmployeeManager() {
    try {
        // Get the list of employees
        let employees = await getAllEmployees();

        let employee = await inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Please select an employee: ',
            choices: employees
        }]);

        employee = employee.name;
        employees = employees.filter(el => el !== employee);

        const manager = await inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Please select an employee to assign as the manager: ',
            choices: employees
        }]);

        manager.id = await getEmployeeID(manager.name);

        await setEmployeeManager(employee, manager.id);
    } catch (err) {
        if (err) throw err;
    }
}

async function updateEmployeeRole() {
    try {
        // Get the list of employees
        let employees = await getAllEmployees();

        let employee = await inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Please select an employee: ',
            choices: employees
        }]);

        const titles = await getAllTitles();

        const role = await inquirer.prompt([{
            type: 'list',
            name: 'title',
            message: "Please select a role as the employee's new role: ",
            choices: titles
        }]);
        const roleId = await getRoleID(role.title);
        await setEmployeeRole(employee.name, roleId);
    } catch (err) {
        if (err) throw err;
    }
}


module.exports = {
    displayAllEmployees,
    displayAllEmployeesByDepartment,
    displayAllEmployeesByManager,
    addEmployee,
    removeEmployee,
    updateEmployeeManager,
    updateEmployeeRole
};