import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import Project from "../../src/models/Project";

describe("unit test for projects routes", () => {
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

  it("should return an array of errors when the request to create project have a empty object", async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({})
      .set("x-auth-token", "test-token");

    expect(res.body).toStrictEqual({
      errors: [
        {
          msg: "the name of the project is required",
          param: "name",
          location: "body",
        },
      ],
    });
  });

  it("should call the proper functions when a project is created", async () => {
    const saveSpy = jest.spyOn(Project.prototype, "save").mockReturnValue(true);

    await request(app)
      .post("/api/projects")
      .send({
        name: "test-project-name",
      })
      .set("x-auth-token", "test-token");

    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it("should call the correct functions when it gets all the projects", async () => {
    const findSpy = jest.spyOn(Project, "find");

    await request(app).get("/api/projects").set("x-auth-token", "test-token");

    expect(findSpy).toHaveBeenCalledWith({ owner: "test-id" });
  });

  it("should throw error when the request to update a project does not have the name", async () => {
    const res = await request(app)
      .put("/api/projects/62f02e4c09b4f9a3117e0d91")
      .send({})
      .set("x-auth-token", "test-token");

    expect(res.body).toStrictEqual({
      errors: [
        {
          msg: "the name of the project is required",
          param: "name",
          location: "body",
        },
      ],
    });
  });

  it("should call proper functions when updating a project", async () => {
    const findByIdSpy = jest.spyOn(Project, "findById");

    await request(app)
      .put("/api/projects/62f02e4c09b4f9a3117e0d91")
      .send({
        name: "test-project",
      })
      .set("x-auth-token", "test-token");

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith("62f02e4c09b4f9a3117e0d91");
  });
});
