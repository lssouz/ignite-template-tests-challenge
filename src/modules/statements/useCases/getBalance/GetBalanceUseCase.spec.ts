import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

interface IRequest {
  user_id: string;
}

const user: ICreateUserDTO = {
  name: "Leonardo",
  email: "teste@matsuda.com.br",
  password: "123456"
};

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to get balance", async () => {
    const newUser = await createUserUseCase.execute(user);

    const deposit: ICreateStatementDTO = {
      user_id: newUser.id as string,
      description: "Deposito em conta",
      amount: 200.00,
      type: OperationType.DEPOSIT
    }

    await createStatementUseCase.execute(deposit);

    const getBalance = await getBalanceUseCase.execute({user_id: newUser.id as string});

    expect(getBalance.balance).toEqual(200);
  })

  it("should not be able to get balance from non-existing user", async () => {
    const user: IRequest = { user_id: "ZZZ123" };

    expect(async () => {
      await getBalanceUseCase.execute(user);
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
});
