import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import { FilterType } from "../../src/types/enums";
import ProjectRepository from "../../src/repositories/ProjectRepository";

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
      .set("x-auth-token", "test-token")
      .send({});

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
    const saveSpy = jest
      .spyOn(ProjectRepository.prototype, "create")
      .mockReturnValue(true as any);

    await request(app)
      .post("/api/projects")
      .set("x-auth-token", "test-token")
      .send({
        name: "test-project-name",
      });

    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it("should call the correct functions when it gets all the projects", async () => {
    const findSpy = jest.spyOn(ProjectRepository.prototype, "find");

    await request(app).get("/api/projects").set("x-auth-token", "test-token");

    expect(findSpy).toHaveBeenCalledWith("test-id", FilterType.OWNER);
  });

  it("should throw error when the request to update a project does not have the name", async () => {
    const res = await request(app)
      .put("/api/projects/62f02e4c09b4f9a3117e0d91")
      .set("x-auth-token", "test-token")
      .send({});

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
    const findByIdSpy = jest.spyOn(ProjectRepository.prototype, "findOne");

    await request(app)
      .put("/api/projects/62f02e4c09b4f9a3117e0d91")
      .set("x-auth-token", "test-token")
      .send({
        name: "test-project",
      });

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
  });
});
