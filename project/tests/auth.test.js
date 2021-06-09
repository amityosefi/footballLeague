
const app = require('../main');
var request = require('supertest');
const DButils = require("../routes/utils/DButils");
jest.setTimeout(10000000);

const { check_if_username_exists, hash_password, check_username_and_password } = require("../routes/utils/auth_utils");

//unit tests + accepttance tests

describe("acceptance tests",() =>{

    test('check if username exists', async () => {
        const ans1 = await check_if_username_exists('mendel');
        expect(ans1).toEqual(true);
        const ans2 = await check_if_username_exists('yonatan');
        expect(ans2).toEqual(false);
        });


    test('change to hash password', async () => {
        const ans = (await hash_password('mendel123') === 'mendel123');
        expect(ans).toEqual(false);
        });
           

    test('check username and password', async () => {
        let user1 = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'shahar'`))[0];
        let isCorrect1 = false;
        if (user1 != undefined)
            isCorrect1 = await check_username_and_password(user1, 'horo', user1.password);
        expect(isCorrect1).toEqual(true);

        let user2 = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'yonatan'`))[0];
        let isCorrect2 = false;
        if (user2 != undefined)
            isCorrect2 = await check_username_and_password(user2, 'hakatan', user2.password);
        expect(isCorrect2).toEqual(false);

    });
});


describe("integration tests + acceptance tests",() =>{
    
    test("login correct username and password", async () => {
        const response = await request(app).post("/Login")
        .send({
            username: 'shahar',
            password: 'horo'

        })
        expect(response.statusCode).toBe(200)
    });

    test("login invalid parameters", async () => {
        const response = await request(app).post("/Login")
        .send({
            username: 'test',
            password: 'badpassword'

        })
        expect(response.statusCode).toBe(401)
    });

    test("Register success", async () => {
        const response = await request(app).post("/Register")
        .send({
            username: 'chana11',
            password: 'chana',
            email: 'chana@gmail.com',
            firstname: 'chana',
            lastname: 'dalfen',
            country: 'israel',
            imgUrl: 'pic'
        })
        expect(response.statusCode).toBe(201);
    });

    test("Register fail - username already exists", async () => {
        const response = await request(app).post("/Register")
        .send({
            username: 'amit',
            password: 'amit',
            email: 'chana@gmail.com',
            firstname: 'chana',
            lastname: 'dalfen',
            country: 'israel',
            imgUrl: 'pic'
        })
        expect(response.statusCode).toBe(409);
    });

    test("Registration and then Login success", async () => {
        await request(app).post("/Register")
        .send({
            username: 'adi11',
            password: 'li',
            email: 'adili@gmail.com',
            firstname: 'adi',
            lastname: 'li',
            country: 'israel',
            imgUrl: 'pic'
        })

    const response = await request(app).post("/Login")
        .send({
            username: 'adi11',
            password: 'li'
        })
        expect(response.statusCode).toBe(200)
    });

    test("Registration and then Login failed", async () => {
        await request(app).post("/Register")
        .send({
            username: 'adi9',
            password: 'li',
            email: 'adili@gmail.com',
            firstname: 'adi',
            lastname: 'li',
            country: 'israel',
            imgUrl: 'pic'
        })

    const response = await request(app).post("/Login")
        .send({
            username: 'adi87',
            password: 'adi43'
        })
        expect(response.statusCode).toBe(401)
    });

});


// describe("integration tests + acceptance tests",() =>{

//     const res = await request(app).post("/Logout").send({
//         //session.reset
//     });

//     expect(res.success).toEqual(true);

// });