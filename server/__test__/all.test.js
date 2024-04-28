const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { Anime, User } = require("../models");

let userToken1;
let userToken2;

//>>>> BEFORE <<<<
beforeAll(async () => {
  try {
    let user = await User.create({
      email: "a@mail.com",
      password: "123",
    });
  } catch (error) {
    console.log(error.message);
  }
});

//>>>>>>>>> ADD-USER
describe("Testing POST /add-user", () => {
  //>>SUCCESS LOGIN
  test("success add-user", async () => {
    const response = await request(app)
      .post("/add-user")
      .send({ email: "go@mail.com", password: "12345" });
    const { body, status } = response;
    // console.log(body, status, ">>>>>>>>>>");

    expect(status).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
    });
  });

  //>>EMAIL NOT INPUT
  test("email not input", async () => {
    const response = await request(app)
      .post("/add-user")
      .send({ email: "", password: "12345" });
    const { body, status } = response;
    // console.log(body, status, ">>>>>>>>>>");

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Email is required");
  });

  //>>INVALID EMAIL FORMAT
  test("invalid email format", async () => {
    const response = await request(app)
      .post("/add-user")
      .send({ email: "abc", password: "12345" });
    const { body, status } = response;
    // console.log(body, status, ">>>>>>>>>>");

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Invalid email format");
  });

  //>>PASSWORD NOT INPUT
  test("password not input", async () => {
    const response = await request(app)
      .post("/add-user")
      .send({ email: "abc@mail.com", password: "" });
    const { body, status } = response;
    // console.log(body, status, ">>>>>>>>>>");

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Password is required");
  });

  //>>EMAIL ALREADY EXISTS
  test("email alreadey exists", async () => {
    const response = await request(app)
      .post("/add-user")
      .send({ email: "go@mail.com", password: "12345" });
    const { body, status } = response;
    // console.log(body, status, ">>>>>>>>>>");

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Email already exists");
  });
});

//>>>>>>>>> LOGIN
describe("Testing POST /login", () => {
  //>>SUCCESS LOGIN
  test("success login", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "a@mail.com", password: "123" });
    const { body, status } = response;
    userToken1 = body.access_token;

    const responseUser2 = await request(app)
      .post("/login")
      .send({ email: "go@mail.com", password: "12345" });
    userToken2 = responseUser2.body.access_token;
    // console.log(userToken1, ">>>>> TOKEN1", userToken2, ">>>>> TOKEN2");

    expect(status).toBe(200);
    expect(body).toMatchObject({
      access_token: expect.any(String),
      email: expect.any(String),
    });
  });

  //>> EMAIL NOT INPUT
  test("not inputted email", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "", password: "123" });

    const { body, status } = response;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Email/Password is required");
  });

  //>> PASSWORD NOT INPUT
  test("not inputted password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "a@mail.com", password: "" });

    const { body, status } = response;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Email/Password is required");
  });

  //>> INVALID EMAIL
  test("invalid email", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "aSD@gmail.com", password: "12345" });

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Invalid Email/Password");
  });

  //>> INVALID PASSWORD
  test("invalid password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "go@mail.com", password: "qweqwe" });

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Invalid Email/Password");
  });
});

//>>>>>>> CREATE ANIME
describe("Testing POST /anime", () => {
  //>> SUCCESS
  test("success create anime", async () => {
    let dataInsert = {
      url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
      title: "Sousou banyakin dulu lagi",
      score: 9.31,
    };

    const response = await request(app)
      .post("/anime")
      .set("Authorization", `Bearer ${userToken1}`)
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(201);
    expect(body).toMatchObject({
      anime: {
        id: 1,
        url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
        imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
        title: "Sousou banyakin dulu lagi",
        score: 9.31,
        userScore: 0,
        status: "Plan to watch",
        UserId: 1,
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      },
    });
  });

  //>> NOT LOGGED IN
  test("not logged in", async () => {
    let dataInsert = {
      url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
      title: "Sousou banyakin dulu lagi",
      score: 9.31,
    };

    const response = await request(app).post("/anime").send(dataInsert); //<< without authorization

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthenticated");
  });

  ///>> INVALID TOKEN
  test("invalid token", async () => {
    let dataInsert = {
      url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
      title: "Sousou banyakin dulu lagi",
      score: 9.31,
    };

    const response = await request(app)
      .post("/anime")
      .set("Authorization", `Bearer ${userToken1}123`) //<< add random char
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthenticated");
  });

  ///>> INVALID INPUT
  test("invalid input", async () => {
    let dataInsert = {
      url: "",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
      title: "",
      score: 9.31,
    };

    const response = await request(app)
      .post("/anime")
      .set("Authorization", `Bearer ${userToken1}`)
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "url is required");
  });
});

//>>>>>>> GET ANIME
describe("Testing GET /anime", () => {
  //>> SUCCESS
  test("success get anime", async () => {
    const response = await request(app)
      .get("/anime")
      .set("Authorization", `Bearer ${userToken1}`);

    const { body, status } = response;

    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });
});

//>>>>>>> GET ANIME BY ID
describe("Testing GET /anime/:id", () => {
  //>> SUCCESS
  test("success get anime by id", async () => {
    let testId = 1;
    const response = await request(app)
      .get(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}`);

    const { body, status } = response;

    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: 1,
      url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
      title: "Sousou banyakin dulu lagi",
      score: 9.31,
      userScore: 0,
      status: "Plan to watch",
      UserId: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      User: {
        id: 1,
        email: "a@mail.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });
});

//>>>>>>> UPDATE ANIME
describe("Testing PUT /anime/:id", () => {
  //>> SUCCESS UPDATE
  test("success update anime", async () => {
    let testId = 1;
    let dataInsert = {
      userScore: 8,
      status: "Finished",
    };

    const response = await request(app)
      .put(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}`)
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(200);
    expect(body).toMatchObject({
      anime: {
        id: 1,
        url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
        imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
        title: "Sousou banyakin dulu lagi",
        score: 9.31,
        userScore: 8,
        status: "Finished",
        UserId: 1,
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      },
    });
  });

  //>> NOT LOGGED IN
  test("not logged in", async () => {
    let testId = 1;
    let dataInsert = {
      userScore: 8,
      status: "Finished",
    };

    const response = await request(app)
      .put(`/anime/${testId}`) //>> no .set authorization
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthenticated");
  });

  //>> INVALID TOKEN
  test("invalid token", async () => {
    let testId = 1;
    let dataInsert = {
      userScore: 8,
      status: "Finished",
    };

    const response = await request(app)
      .put(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}123`) //>> add random char
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthenticated");
  });

  //>> DATA NOT FOUND
  test("data not found", async () => {
    let testId = 23; //>> id more than data in database
    let dataInsert = {
      userScore: 8,
      status: "Finished",
    };

    const response = await request(app)
      .put(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}`)
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found.");
  });

  //>> UNAUTHORIZED
  test("unauthorized", async () => {
    let testId = 1;
    let dataInsert = {
      userScore: 8,
      status: "Finished",
    };

    const response = await request(app)
      .put(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken2}`)
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(403);
    expect(body).toHaveProperty("message", "You are not authorized");
  });

  //>> INVALID INPUT
  test("invalid input", async () => {
    let testId = 1;
    let dataInsert = {
      userScore: "",
      status: "",
    };

    const response = await request(app)
      .put(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}`)
      .send(dataInsert);

    const { body, status } = response;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "userScore is required");
  });
});

//>>>>>>> DELETE ANIME
describe("Testing DELETE /anime/:id", () => {
  //>> NOT LOGGED IN
  test("not logged in", async () => {
    let testId = 1;
    const anime = await Anime.findByPk(testId);

    const response = await request(app).delete(`/anime/${testId}`); //>> no .set authorization

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthenticated");
  });

  //>> INVALID TOKEN
  test("invalid token", async () => {
    let testId = 1;
    const anime = await Anime.findByPk(testId);

    const response = await request(app)
      .delete(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}123`); //>> add random char

    const { body, status } = response;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthenticated");
  });

  //>> DATA NOT FOUND
  test("data not found", async () => {
    let testId = 23; //>> id more than data in database
    const anime = await Anime.findByPk(testId);

    const response = await request(app)
      .delete(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}`);

    const { body, status } = response;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found.");
  });

  //>> UNAUTHORIZED
  test("unauthorized", async () => {
    let testId = 1;
    const anime = await Anime.findByPk(testId);

    const response = await request(app)
      .delete(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken2}`);

    const { body, status } = response;

    expect(status).toBe(403);
    expect(body).toHaveProperty("message", "You are not authorized");
  });

  //>> SUCCESS DELETE
  test("success delete anime", async () => {
    let testId = 1;
    const anime = await Anime.findByPk(testId);

    const response = await request(app)
      .delete(`/anime/${testId}`)
      .set("Authorization", `Bearer ${userToken1}`);

    const { body, status } = response;

    expect(status).toBe(200);
    expect(body).toHaveProperty("message", `${anime.title} success to delete`);
  });
});

//>>>> AFTER <<<<
afterAll(async () => {
  try {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await sequelize.queryInterface.bulkDelete("Animes", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
});
