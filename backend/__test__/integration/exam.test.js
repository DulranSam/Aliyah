const request = require("supertest");
const BASE = "http://localhost:8000";

describe("POST /saveExam", () => {
  it("should return 400 if the request body is empty", async () => {
    const response = await request(BASE)
      .post("/exam/saveExam")
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "Exam Details Missing!",
    });
  });

  it("should return 201 if the exam gets successfully saved", async () => {
    const response = await request(BASE)
      .post("/exam/saveExam")
      .send({
        examType: "Past Paper",
        examQuestions: ["p1_cg_1_w_2022_2", "p1_cg_7_s_2015_2", "p1_cg_6_w_2015_2"],
        userRef: "65febde2ea793268b6b6a26d",
        examModule: "Pure Mathematics I",
        examTopic: "None"
      });
    expect(response.statusCode).toBe(201);
  });
});

describe("POST /getExam", () => {
  it("should return 400 if the exam ID is missing", async () => {
    const response = await request(BASE)
    .post("/exam/getExam")
    .send({
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The exam reference ID is missing.",
    });
  });

  it("should return 400 if the question data is not matching records", async () => {
    const response = await request(BASE)
    .post("/exam/getExam")
    .send({
      examRef: "incorrect"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "No matching exam is found",
    })
  });

  it("should return 200 when the exam data is present", async () => {
    const response = await request(BASE)
    .post("/exam/getExam")
    .send({
      examRef: "65ff188636d01040da20c9ff"
    });
    expect(response.statusCode).toBe(200);
  })
});

describe("Post /getReceipt", () => {
  it("should return 400 if the exam reference is missing", async () => {
    const response = await request(BASE)
    .post("/exam/getReceipt")
    .send({
    })
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The exam reference ID is missing."
    })
  })

  it("should return 200 if the exam data is returned", async () => {
    const response = await request(BASE)
    .post("/exam/getReceipt")
    .send({
      examRef: "65ff188636d01040da20c9ff"
    })
    expect(response.statusCode).toBe(200);
  })
});

describe("Post /updateExam", () => {
  it("should return 400 if the exam reference is missing", async () => {
    const response = await request(BASE)
    .post("/exam/updateExam")
    .send({
      examRef: "",
      userRef: "65febde2ea793268b6b6a26d"
    })
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The exam reference ID is missing."
    })
  });

  it("should return 400 if the user ID is missing", async () => {
    const response = await request(BASE)
    .post("/exam/updateExam")
    .send({
      examRef: "65ff2c6b734c9a56393c53f6",
      userRef: ""
    })
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The user reference ID is missing."
    })
  });

  it("should return 200 if the updating data is all correct and it successfully updates", async () => {
    const response = await request(BASE)
    .post("/exam/updateExam")
    .send({
      examRef: "65ff2c6b734c9a56393c53f6",
      userRef: "65ff2c6b734c9a56393c53f6",
      mark: 5,
      totalMark: 25,
      correctQuestions: [],
      wrongQuestions: [],
      userAnswers: ["a", "b"],
    })
    expect(response.statusCode).toBe(200);
  });
})

