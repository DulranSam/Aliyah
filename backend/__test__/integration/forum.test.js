const { describe } = require("node:test");
const request = require("supertest");
const app = "http://localhost:8000";

describe("Forum Routes", () => {
  describe("GET /", () => {
    it("should return 400 and all forums", async () => {
      const response = await request(app).post("/forum").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: "Invalid search parameters." });
    });

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
        question: "What is the square root of 4?",
        topic: "Pure Mathematics I",
      });
      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({
        Alert: "What is the square root of 4? was Already posted before!",
      });
    });
  });
  // Add more test cases for other routes
});
