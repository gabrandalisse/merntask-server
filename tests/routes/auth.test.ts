import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../../src/models/User";

describe("unit test for auth routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_MONGO!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return an error when the user do not exists", async () => {
    jest
      .spyOn(User, "findOne")
      .mockImplementation(() => Promise.resolve(false) as any);

    const res = await request(app).post("/api/auth").send({
      email: "test-user@gmail.com",
      password: "test-user-pass",
    });

    expect(res.body).toStrictEqual({
      msg: "the user do not exists",
    });
  });

  it("should return an error when the user password is incorrect", async () => {
    jest
      .spyOn(User, "findOne")
      .mockImplementation(() => Promise.resolve({}) as any);

    jest
      .spyOn(bcryptjs, "compare")
      .mockImplementation(() => Promise.resolve(false) as any);

    const res = await request(app).post("/api/auth").send({
      email: "test-user@gmail.com",
      password: "test-user-pass",
    });

    expect(res.body).toStrictEqual({
      msg: "the password is incorrect",
    });
  });

  it("should return a token when the user is authenticated", async () => {
    jest
      .spyOn(User, "findOne")
      .mockImplementation(() => Promise.resolve({}) as any);

    jest
      .spyOn(bcryptjs, "compare")
      .mockImplementation(() => Promise.resolve(true) as any);

    const res = await request(app).post("/api/auth").send({
      email: "test-user@gmail.com",
      password: "test-user-pass",
    });

    expect(res.body).toHaveProperty("token");
  });
});
