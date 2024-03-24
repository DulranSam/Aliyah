const request = require("supertest");
const BASE = "https://aliyah-dlyb.onrender.com";

describe("POST /resources", () => {
  const dummyData = {
    topic: "Pure Mathematics I",
    title: "testing",
    about: "yes",
    subtopic: "no",
    link: "something",
  };

  const dummyData2 = {
    topic: "Pure Mathematics I",
    about: "yes",
    subtopic: "no",
  };

  it("should get learning resources", async () => {
    const response = await request(BASE).get("/resources");
    expect(response.statusCode).toBe(200);
    // Replace the next line with your expected response comparison
    expect(response.body).toBeDefined();
  });

  it("should return error when required fields are not filled", async () => {
    const response = await request(BASE).post("/resources").send(dummyData2);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      Alert: "Required fields not filled! (topic and title!)",
    });
  });

  it("should add learning resource", async () => {
    const response = await request(BASE).post("/resources").send(dummyData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      Alert: "Added Learning Resource to Learn",
    });
  });
});

describe("POST /resources/topic/learned", () => {
  const theTopic = "Pure Mathematics I";

  it("should render data when valid topic is provided", async () => {
    const response = await request(BASE)
      .post("/resources/topic/learned")
      .send({ topic: theTopic });
    expect(response.statusCode).toBe(200);
    // Replace the next line with your expected response comparison
    expect(response.body).toBeDefined();
  });
});
