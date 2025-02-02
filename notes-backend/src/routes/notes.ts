import express from "express";
import { ObjectId } from "mongodb";
import { db } from '../db/conn.js';
//import {  CustomReq } from './users.js'
let notesRoutes = express.Router();

let checkId = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        let id = req.body.id;
        if (!id) {
            res.status(400).json({ "error": "No object id present in the request." })
            return
        }
        if (!ObjectId.isValid(id)) {
            res.status(400).json({ "error": "Object id not valid." })
            return
        }
        next();
    } catch (e) {
        console.error(e);
        throw e;
    }
}

notesRoutes.get("/notes",  async function (_req, res) {
    try {
        let result = await db
            .collection("notes")
            .find()
            .toArray();
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});


notesRoutes.get("/tags",  async function (_req, res) {
    try {

        let result = await db
            .collection("tags")
            .find()
            .toArray();
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});


notesRoutes.post("/notes/new",  async function (req, res) {
    try {
        let { title, markdown, tagIds } = req.body;
        let newNote = {
            title: title,
            markdown: markdown,
            tagIds: tagIds,
        };
        let result = await db.collection("notes").insertOne(newNote);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

notesRoutes.post("/tags/new",  async function (req, res) {
    try {
        let { label } = req.body;
        let newTag = {
            label: label,
        };
        let result = await db.collection("tags").insertOne(newTag);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

notesRoutes.put("/notes/update",  checkId, async function (req, res) {
    try {
        let { id, title, markdown, tagIds } = req.body;
        let myquery = { _id: new ObjectId(id) };
        let newvalues = {
            $set: {
                title: title,
                markdown: markdown,
                tagIds: tagIds,
            },
        };
        let result = await db.collection("notes").updateOne(myquery, newvalues);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

notesRoutes.put("/tags/update",  checkId, async function (req, res) {
    try {
        let { id, label } = req.body
        let myquery = { _id: new ObjectId(id) };
        let newvalues = {
            $set: {
                label: label,
            },
        };
        let result = await db.collection("tags").updateOne(myquery, newvalues);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

notesRoutes.delete("/notes/delete",  checkId, async function (req, res) {
    try {
        let { id } = req.body
        let myquery = { _id: new ObjectId(id) };
        let result = await db.collection("notes").deleteOne(myquery);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

notesRoutes.delete("/tags/delete",  checkId, async function (req, res) {
    try {
        let { id } = req.body
        let myquery = { _id: new ObjectId(id) };
        let result = await db.collection("tags").deleteOne(myquery);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

export { notesRoutes }