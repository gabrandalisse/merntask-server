import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";

describe("unit test for tasks routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_MONGO!);
  });

  beforeEach(() => {
    jest.spyOn(jwt, "verify").mockReturnValue({
      user: {
        id: "test-id",
      },
    } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return an array of errors when the request to create a task have a empty object", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({})
      .set("x-auth-token", "test-token");

    expect(res.body).toStrictEqual({
      errors: [
        {
          msg: "the name is required",
          param: "name",
          location: "body",
        },
        {
            msg: "the project is required",
            param: "project",
            location: "body",
          },
      ],
    });
  });
});
