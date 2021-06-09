const request = require('supertest');
// const request = supertest
const DButils = require("../utils/DButils");
var express = require("express");
// const app = require('../../main');

const app = express();
app.use(express.json());
const port = 3001;
app.listen(port);


const { check_if_username_exists, hash_password, check_username_and_password } = require("../utils/auth_utils");

//unit tests + accepttance tests

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
        const isnCorrect1 = await check_username_and_password(user1, 'horo');
        expect(isnCorrect1).toEqual(false);

        let user2 = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'yonatan'`))[0];
        const isnCorrect2 = await check_username_and_password(user2, 'hakatan');
        expect(isnCorrect2).toEqual(true);

        });


//integration tests

    test('registration success', async () => {

        const res = await request(app).post("/Register").send({

            username: "chana",
            password: "chana123",
            email: "chana@gmail.com",
            firstname: "chana",
            lastname: "dalf",
            country: "israel",
            imageUrl: "https://cloudinary.com"

        });
        expect(res.status).toEqual(201);
    });


    test('login success', async () => {

            const res = await request(app).post("/Login").send({

                username: "amit",
                password: "amit",   
            });

        expect(res.status).toEqual(200);
    });


//regresion tests

    test('logout succsess', async () => {

        const res = await request(app).post("/Logout").send({
            //session.reset
        });

    expect(res.success).toEqual(true);
    });