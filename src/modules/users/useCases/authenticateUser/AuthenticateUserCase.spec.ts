import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

const newUser: ICreateUserDTO = {
  name: "Leonardo",
  password: "123456",
  email: "teste@testes.com.br"
};

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () =>{
    await createUserUseCase.execute(newUser);

    const authenticate = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password
    });

    expect(authenticate).toHaveProperty("token");
  });

  it("should not be able to authenticate an non existent user", async () => {
    expect(async () =>{
      await authenticateUserUseCase.execute({
        email: "zzz@testes.com.br",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    expect(async () =>{
      await authenticateUserUseCase.execute({
        email: "teste@testes.com.br",
        password: "987654"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
