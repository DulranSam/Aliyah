const { describe } = require("node:test");
const request = require("supertest");
const app = "https://aliyah-dlyb.onrender.com";

describe("Forum Routes", () => {
  describe("GET /", () => {
    it("should return 200 and all forums", async () => {
      const response = await request(app)
        .post("/forum")
        .send({ searchParams: "" });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("POST /addQuestion", () => {
    it("should return 400 and no question/topic", async () => {
      const response = await request(app).post("/forum/addQuestion").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ Alert: "NO Question/Topic!" });
    });

    it("should return 201 and question added", async () => {
      const response = await request(app).post("/forum/addQuestion").send({
        question: "What is the square root of 9?",
        topic: "Pure Mathematics I",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        Alert: "What is the square root of 9? Added!",
      });
    });

    it("should return 409 and question already posted", async () => {
      const response = await request(app).post("/forum/addQuestion").send({
        question: "What is the square root of 9?",
        topic: "Pure Mathematics I",
      });
      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({
        Alert: "What is the square root of 9? was Already posted before!",
      });
    });

    it("it should return 400 coz no body was given", async () => {
      const response = await request(app)
        .post("/forum/deleteQuestionByTitle")
        .send({});
      expect(response.statusCode).toBe(400);
    });

    it("it should return 404 coz question not found", async () => {
      const response = await request(app)
        .post("/forum/deleteQuestionByTitle")
        .send({ question: "@#$%^&&**()())_" });
      expect(response.statusCode).toBe(404);
    });

    it("it should return 200 coz question deleted", async () => {
      const response = await request(app)
        .post("/forum/deleteQuestionByTitle")
        .send({ question: "What is the square root of 9?" });
      expect(response.statusCode).toBe(200);
    });
  });

  // Add more test cases for other routes
});
