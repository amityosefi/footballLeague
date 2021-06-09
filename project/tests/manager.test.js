
const app = require('../main');
var request = require('supertest');
const DButils = require("../routes/utils/DButils");
jest.setTimeout(10000000);


describe("manager test",() =>{

    test("login correct username and password", async () => {
        const response = await request(app).post("/manager/")
        .send({
         

        })
        expect(response.statusCode).toBe(200)
    });
});
