
import request from 'supertest';
import { Connection } from 'typeorm';

import { createConnection } from '../../../../database';
import { app } from '../../../../app';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';

let connection: Connection;

interface IRequest {
  email: string;
  password: string;
}

const user: ICreateUserDTO = {
  name: "Leonardo",
  password: "123456",
  email: "teste@testes.com.br"
};

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(user);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const login: IRequest = {
      email: "teste@testes.com.br",
      password: "123456"
    };

    const response = await request(app).post("/api/v1/sessions").send(login);

    expect(response.status).toBe(200)
  });

  it("should not be able to authenticate an non existent user", async () => {
    const login: IRequest = {
      email: "ZZZ@testes.com.br",
      password: "987654"
    };

    const response = await request(app).post("/api/v1/sessions").send(login);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Incorrect email or password');
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const login: IRequest = {
      email: "teste@testes.com.br",
      password: "987654"
    };

    const response = await request(app).post("/api/v1/sessions").send(login);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Incorrect email or password');
  });
});
