const inquirer = require('inquirer');

const {
    getAllRoles,
    insertRole,
    deleteRole
} = require('../models/role');
const { displayHeadline, displayFooter } = require('../utils/logging');
const { getAllDepartmentNames } = require('./department');
const { getDepartmentID } = require('../models/department');

async function displayAllRoles() {
    try {
        const roles = await getAllRoles();
        const footer = displayHeadline('All Roles');
        console.table(roles);
        displayFooter(footer);
    } catch (err) {
        if (err) throw err;
    }
}

async function getAllRoleNames() {
    try {
        const roles = await getAllRoles();

        let roleNames = [];
        for (const role of roles) {
            roleNames.push(role.Title);
        }

        return roleNames;
    } catch (err) {
        if (err) throw err;
    }
}

async function addRole() {
    try {
        const departmentNames = await getAllDepartmentNames();

        const role = await inquirer.prompt([{
                type: 'input',
                name: 'title',
                message: 'Please enter the role that you would like to add: '
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please enter the salary assigned for this role: '
            },
            {
                type: 'list',
                name: 'department',
                message: 'To which department would you like to add this role? ',
                choices: departmentNames
            }
        ]);

        role.departmentID = await getDepartmentID(role.department);
        await insertRole(role);
    } catch (err) {
        if (err) throw err;
    }
}

async function removeRole() {
    try {
        const roleNames = await getAllRoleNames;

        const role = await inquirer.prompt([{
            type: 'list',
            name: 'title',
            message: 'Which role would you like to remove? ',
            choices: roleNames,
            loop: false
        }]);

        await deleteRole(role.title);
    } catch (err) {
        if (err) throw err;
    }
}

module.exports = {
    displayAllRoles,
    addRole,
    removeRole
};