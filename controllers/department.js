const {
    getAllDepartments
} = require('../models/department');
const { displayHeadline, displayFooter } = require('../utils/logging');

/**
 * @description   Retrievess all depatment names
 * @returns       An array object of department names
 */
async function getAllDepartmentNames() {
    try {
        const departments = await getAllDepartments();

        let departmentNames = [];
        for (const department of departments) {
            departmentNames.push(department.Name);
        }

        return departmentNames;
    } catch (err) {
        if (err) throw err;
    }
}

module.exports = {
    getAllDepartmentNames
};