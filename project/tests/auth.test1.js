
// const app = require('../main');
// var request = require('supertest');
// const DButils = require("../routes/utils/DButils");
// jest.setTimeout(10000000);


// describe("auth test",() =>{

//     test("login correct username and password", async () => {
//         const response = await request(app).post("/Login")
//         .send({
//             username: 'amit',
//             password: 'amit'

//         })
//         expect(response.statusCode).toBe(200)
//     });
// });

// describe("auth test",() =>{

//     test("login invalid parameters", async () => {
//         const response = await request(app).post("/Login")
//         .send({
//             username: 'test',
//             password: 'badpassword'

//         })
//         expect(response.statusCode).toBe(401)
//     });
// });


// describe("auth test",() =>{

//     test("Register success", async () => {
//         const response = await request(app).post("/Register")
//         .send({
//             username: 'chana',
//             password: 'chana',
//             email: 'chana@gmail.com',
//             firstname: 'chana',
//             lastname: 'dalfen',
//             country: 'israel',
//             imgUrl: 'pic'
//         })
//         expect(response.statusCode).toBe(201);
//     });
// });

// describe("auth test",() =>{

//     test("Register fail - username already exists", async () => {
//         const response = await request(app).post("/Register")
//         .send({
//             username: 'amit',
//             password: 'chana',
//             email: 'chana@gmail.com',
//             firstname: 'chana',
//             lastname: 'dalfen',
//             country: 'israel',
//             imgUrl: 'pic'
//         })
//         expect(response.statusCode).toBe(409);
//     });
// });