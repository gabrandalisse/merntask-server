import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import User from "../../src/models/Users";

describe("unit test for users routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_MONGO!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return an array of errors when the request to create user have a empty object", async () => {
    const res = await request(app).post("/api/users").send({});
    expect(res.body).toStrictEqual({
      errors: [
        {
          msg: "the name is required",
          param: "name",
          location: "body",
        },
        {
          msg: "the email is required",
          param: "email",
          location: "body",
        },
        {
          msg: "the password must be at least 6 characters long",
          param: "password",
          location: "body",
        },
      ],
    });
  });

  it("should return the correct error when the name is missing in the request", async () => {
    const res = await request(app).post("/api/users").send({
      email: "test@test.com",
      password: "test-pass",
    });

    expect(res.body).toStrictEqual({
      errors: [
        {
          msg: "the name is required",
          param: "name",
          location: "body",
        },
      ],
    });
  });

  it("should return the correct error when the email is invalid in the request", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Gabriel",
      password: "test-pass",
      email: "fake.com",
    });

    expect(res.body).toMatchObject({
      errors: [
        {
          msg: "the email is required",
          param: "email",
          location: "body",
        },
      ],
    });
  });

  it("should return the correct error when the password is less than 6 characters long in the request", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Gabriel",
      password: "test",
      email: "fake@test.com",
    });

    expect(res.body).toMatchObject({
      errors: [
        {
          msg: "the password must be at least 6 characters long",
          param: "password",
          location: "body",
        },
      ],
    });
  });

  it("should return a token when the user is created correctly", async () => {
    jest
      .spyOn(User, "findOne")
      .mockImplementation(() => Promise.resolve(null) as any);
    jest.spyOn(User.prototype, "save").mockReturnValue(true);

    const res = await request(app).post("/api/users").send({
      name: "Gabriel",
      password: "test-password",
      email: "fake@test.com",
    });

    expect(res.body).toHaveProperty("token");
  });

  it("should return a error when the user to create already exists", async () => {
    jest
      .spyOn(User, "findOne")
      .mockImplementation(() => Promise.resolve({}) as any);

    const res = await request(app).post("/api/users").send({
      name: "Gabriel",
      password: "test-password",
      email: "fake@test.com",
    });

    expect(res.body).toStrictEqual({
      msg: "the user already exists",
    });
  });
});
