const request = require("supertest");
const BASE = "http://localhost:8000";

describe("POST /getQuestion", () => {
    it("should return 400 if the request body is missing the question ID", async () => {
      const response = await request(BASE)
        .post("/getQuestion")
        .send({
            questionID: ""
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        Alert: "The question ID is missing!",
      });
    });
  
    it("should return 200 if the question is successfully retrieved", async () => {
      const response = await request(BASE)
        .post("/getQuestion")
        .send({
            questionID: "s1_p_1_w_2022_2"
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.questionID).toEqual("s1_p_1_w_2022_2");
    });
  });

  describe("POST /getAllQuestions", () => {

    it("should return 400 when the module ID is missing or wrong", async () => {
        const response = await request(BASE)
        .post("/getQuestion/getAllQuestions")
        .send({
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        Alert: "The module ID is missing!"
      });
    });

    it("should return 200 when the module ID is correct", async () => {
        const response = await request(BASE)
        .post("/getQuestion/getAllQuestions")
        .send({
            moduleID: "p1"
        });
      expect(response.statusCode).toBe(200);
    });
  })