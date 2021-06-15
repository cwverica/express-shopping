process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
let items = require("./fakeDb");

let laCroix = { name: "La Croix", price: "11.99" }
let snickers = { name: "Snickers", price: "1.69" }
let skittles = { name: "Skittles", price: "1.49" }

beforeAll(() => {
    items.push(laCroix);
});

describe("GET /items", () => {
    test("Gets all the items", async () => {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([laCroix]);
    });
});

describe("POST /items", () => {
    test("Adds an item", async () => {
        const resp = await request(app)
            .post(`/items`)
            .send(snickers);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ "added": snickers });
        expect(items).toEqual([laCroix, snickers]);
    });
});

describe("GET /items/:name", () => {
    test("Gets the named item", async () => {
        const resp = await request(app).get(`/items/${snickers.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(snickers);
    });

    test("Returns error for unfound item", async () => {
        const resp = await request(app).get(`/items/DNE`);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ "error": { "message": "Cannot find that item", "status": 404 } });
    })
});

describe("PATCH /items/:name", () => {
    test("Updates the named item", async () => {
        const resp = await request(app)
            .patch(`/items/${snickers.name}`)
            .send(skittles);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ "updated": skittles });
        expect(items).toEqual([laCroix, skittles]);
    });

    test("Returns error for unfound item", async () => {
        const resp = await request(app)
            .patch(`/items/lemmysnicket`)
            .send(skittles);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ "error": { "message": "Cannot find that item", "status": 404 } });
    });
});

describe("DELETE /items/:name", () => {
    test("Deletes the named item", async () => {
        const resp = await request(app).delete(`/items/${skittles.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ "message": "Deleted" });
        expect(items).toEqual([laCroix]);
    });

    test("Returns error for already deleted/unfound item", async () => {
        const resp = await request(app).delete(`/items/${skittles.name}`);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({ "error": { "message": "Cannot find that item", "status": 404 } });
    });
});