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

    it("should return 404 if no forums found", async () => {
      const response = await request(app)
        .post("/forum")
        .send({ searchParams: "not-found" });
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: "No results found!" });
    });

    it("should return 200 and all forums", async () => {
      const response = await request(app)
        .post("/forum")
        .send({ searchParams: "Pure Mathematics I" });
      expect(response.statusCode).toBe(200);
    });
  });
  // Add more test cases for other routes
});
