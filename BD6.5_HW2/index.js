let express = require("express");
let app = express();
app.use(express.json());

let employees = [];
let companies = [];

// function to add new employee.
async function addEmployee(newEmployeeData) {
  let addedEmployee = { id: employees.length + 1, ...newEmployeeData };
  employees.push(addedEmployee);
  return addedEmployee;
}
// function to add new company
async function addCompany(newCompanyData) {
  let addedCompany = { id: companies.length + 1, ...newCompanyData };
  companies.push(addedCompany);
  return addedCompany;
}
// function to validate  the input employee details
function validateEmployee(employee) {
  if (! employee.name || typeof employee.name !== "string") {
    return "Name is required and should be a string";
  } else if (! employee.companyId || typeof employee.companyId !== "number") {
    return "Company Id is required and should be a number";
  } else {
    return null;
  }
}
// function to validate input company details.
function validateCompany(company) {
  if (! company.name || typeof company.name !== "string") {
    return "Company name is required and should be a string";
  } else {
    return null;
  }
}
// Exercise 1: Add a New Employee
app.post("/api/employees", async (req, res) => {
  let newEmployeeData = req.body;
  try {
    let error = validateEmployee(newEmployeeData);
    if (error) {
      return res.status(400).send(error);
    }
    let result = await addEmployee(newEmployeeData);
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "internal server error"});
  }
});
// Exercise 2: Add a New Company
app.post("/api/companies", async (req, res) => {
  let newCompanyData = req.body;
  try {
    let error = validateCompany(newCompanyData);
    if (error) {
      return res.status(400).send(error);
    }
    let result = await addCompany(newCompanyData);
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error."});
  }
});
module.exports = { app, addEmployee, addCompany, validateEmployee, validateCompany };