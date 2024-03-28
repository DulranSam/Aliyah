const request = require("supertest");
const BASE = "https://aliyah-dlyb.onrender.com";

describe("POST getTopics", () => {
  it("should return 400 if the topic source is missing", async () => {
    const response = await request(BASE).post("/getTopics").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The topic source is missing!",
    });
  });

  it("should return 200 if the data was returned with no problem", async () => {
    const response = await request(BASE).post("/getTopics").send({
      sourceKey: "p1",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.topicKeys).toEqual([
      "q",
      "f",
      "cg",
      "cm",
      "t",
      "s",
      "d",
      "i",
    ]);
  });
});

describe("POST /getModuleProbs", () => {
  it("should return 400 if the username is missing", async () => {
    const response = await request(BASE)
      .post("/getTopics/getModuleProbs")
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The username is missing!",
    });
  });

  it("should return 200 if the probability data is succsesfully received", async () => {
    const response = await request(BASE)
      .post("/getTopics/getModuleProbs")
      .send({
        username: "_TESTCASE_",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toEqual("_TESTCASE_");
  });
});

describe("POST /getTopicKeyFromTopic", () => {
  it("should return 400 if the source is missing", async () => {
    const response = await request(BASE)
      .post("/getTopics/getTopicKeyFromTopic")
      .send({
        source: "",
        topic: "Quadratics",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "The source is missing!",
    });
  });

  it("should return 400 if the source is missing", async () => {
    const response = await request(BASE)
      .post("/getTopics/getTopicKeyFromTopic")
      .send({
        source: "Pure Mathematics I",
        topic: "",
      });
    expect(response.statusCode).toBe(400);
  });

  it("should return 200 if the correct key is returned", async () => {
    const response = await request(BASE)
      .post("/getTopics/getTopicKeyFromTopic")
      .send({
        source: "Pure Mathematics I",
        topic: "Quadratics",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.topicKey).toEqual("q");
  });
});
