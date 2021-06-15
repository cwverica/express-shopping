const express = require("express");
const router = new express.Router();
const myError = require('./myError');
const items = require('./fakeDb');


/*
GET /items - this should render a list of shopping items.
Here is what a response looks like:

[{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]
*/

router.get('/', (req, res, next) => {
    return res.json(items);
});

/*
POST /items - this route should accept JSON data and add it to the shopping list.
Here is what a sample request/response looks like:

{“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}
*/

router.post('/', (req, res, next) => {
    try {
        console.log(req.json)
        let name = req.body.name;
        let price = req.body.price;
        const item = { name, price };
        items.push(item);
        return res.json({ "added": item })
    } catch (e) {
        return next(e);
    }
});

/*
GET /items/:name - this route should display a single item’s name and price.
Here is what a sample response looks like:

{“name”: “popsicle”, “price”: 1.45}
*/

router.get('/:name', (req, res, next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        if (!item) { throw new myError("Cannot find that item", 404) };
        return res.json(item)
    } catch (e) {
        return next(e);
    }
});

/*
PATCH /items/:name, this route should modify a single item’s name and/or price.
Here is what a sample request/response looks like:

{“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}
*/

router.patch('/:name', (req, res, next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        if (!item) { throw new myError("Cannot find that item", 404) };
        item.name = req.body.name;
        item.price = req.body.price;
        console.log(items);
        return res.json({ "updated": item })
    } catch (e) {
        return next(e);
    }
});

/*
DELETE /items/:name - this route should allow you to delete a specific item from the array.

Here is what a sample response looks like:

{message: “Deleted”}
*/

router.delete('/:name', (req, res, next) => {
    try {
        const indx = items.findIndex(i => i.name === req.params.name);
        if (indx === -1) { throw new myError("Cannot find that item", 404) };
        items.splice(indx, 1);
        console.log(items);
        return res.json({ "message": "Deleted" })
    } catch (e) {
        return next(e);
    }
});

module.exports = router;