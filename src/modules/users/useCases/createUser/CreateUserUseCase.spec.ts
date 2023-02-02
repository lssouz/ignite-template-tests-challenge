import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
    beforeEach(() => {
      inMemoryUsersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to create new users", async () => {
      const user = await createUserUseCase.execute({
        name: "Leonardo",
        password: "123456",
        email: "teste@testes.com"
      });

      const findUser = await inMemoryUsersRepository.findByEmail(user.email);

      expect(findUser).toHaveProperty("id");
    })

    it ("should not be able to create new users when email is already token", async () => {
      const user: ICreateUserDTO = {
        name: "Leonardo",
        password: "123456",
        email: "teste@testes.com"
      };

      expect(async () => {
        await createUserUseCase.execute(user);
        await createUserUseCase.execute(user);
      }).rejects.toBeInstanceOf(AppError);
    });
})
