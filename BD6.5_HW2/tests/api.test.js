let request = require("supertest");
let http = require("http");
let { app, addEmployee, addCompany, validateEmployee, validateCompany } = require("../index");



jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  addEmployee: jest.fn(),
  addCompany: jest.fn(),
  validateEmployee: jest.fn((employee) => {
    if (! employee.name || typeof employee.name !== "string") {
      return "Name is required and should be a string";
    } else if (! employee.companyId || typeof employee.companyId !== "number") {
      return "Company Id is required and should be a number";
    } else {
      return null;
    }
  }),
  validateCompany: jest.fn((company) => {
    if (! company.name || typeof company.name !== "string") {
      return "Company name is required and should be a string";
    } else {
      return null;
    }
  })
}));

let server ;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Exercise 3: Test Add a New Employee with Valid Input
  it("POST API /api/employees should add new employee and return a status code as 201", async () => {
    let addedEmployee = { id: 1, name: "John Doe", companyId: 1 };
    addEmployee.mockResolvedValue(addedEmployee);
    let result = await request(server).post("/api/employees").send({ name: "John Doe", companyId: 1 });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedEmployee);
  });
  // Exercise 4: Test Add a New Employee with Invalid Input
  it("POST API /api/employees should return status code 400 for invalid employee input", async () => {
    let result = await request(server).post("/api/employees").send({name: "John Doe"});
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("Company Id is required and should be a number");
  });
  // Exercise 5: Test Add a New Company with Valid Input
  it("POST API /api/companies should add new company and return status code as 201", async () => {
    let addedCompany = { id: 1, name: "Techcorp"};
    addCompany.mockResolvedValue(addedCompany);
    let result = await request(server).post("/api/companies").send({name: "Techcorp"});
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedCompany);
  });
  // Exercise 6: Test Add a New Company with Invalid Input
  it("POST API /api/companies should return status code as 400 for invalid company input", async () => {
    let result = await request(server).post("/api/companies").send({id: 1});
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("Company name is required and should be a string");
  });
  });
  describe("Validation Function Testing", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    // Exercise 7: Test Employee Validation Function with Jest Mocks
    it("validateEmployee function should return null for valid employee input", () => {
      expect(validateEmployee({name: "John Doe", companyId: 1})).toBeNull();
      });
      // Exercise 8: Test Employee Validation Function Error Handling with Jest Mocks
      it("validateEmployee function should return an error message for invalid employee input", () => {
        expect(validateEmployee({name: "John Doe"})).toEqual("Company Id is required and should be a number");
        expect(validateEmployee({companyId: 1})).toEqual("Name is required and should be a string");
      });
      // Exercise 9: Test Company Validation Function with Jest Mocks
      it("validateCompany function should return null for valid company input", () => {
        expect(validateCompany({name: "Techcorp"})).toBeNull();
      });
      // Exercise 10: Test Company Validation Function Error Handling with Jest Mocks
      it("validateCompany function should return an error message for invalid company input", () => {
        expect(validateCompany({})).toEqual("Company name is required and should be a string");
      });

  });