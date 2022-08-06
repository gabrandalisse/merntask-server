import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";

describe("unit test for users routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_MONGO!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
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
});
