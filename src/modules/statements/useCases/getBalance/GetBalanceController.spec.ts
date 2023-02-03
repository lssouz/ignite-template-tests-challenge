
import request from 'supertest';
import { Connection } from 'typeorm';

import { createConnection } from '../../../../database';
import { app } from '../../../../app';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';

interface IRequest {
  email: string;
  password: string;
}

const user: ICreateUserDTO = {
  name: "Leonardo",
  email: "l@testes.com.br",
  password: "123456"
};

let connection: Connection;

describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(user);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    const login: IRequest = {
      email: "l@testes.com.br",
      password: "123456"
    };

    const responseToken = await request(app).post("/api/v1/sessions").send(login);
    const { token } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit")
      .send({
        description: "Deposito em conta",
        amount: 200.00
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(200);
    expect(response.body.balance).toEqual(200.00);
  });

  it("should not be able to get balance from non-existing user", async () => {
    const login: IRequest = {
      email: "ZZZ@testes.com.br",
      password: "987654"
    };

    const responseToken = await request(app).post("/api/v1/sessions").send(login);
    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('JWT invalid token!');
  });
})
