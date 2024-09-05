import { NoteData, RawNote } from "../pages/NoteList";

export let fetchRawNotes = async function () {
    let resp = await fetch('http://localhost:5000/api/notes/', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    switch (resp.status) {
        case 200: {
            let respJson = await resp.json();
            let notes = respJson as RawNote[];
            return notes;
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let createNote = async function ({ tags, ...data }: NoteData) {


    let resp = await fetch("http://localhost:5000/api/notes/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, tagIds: tags.map(tag => tag._id) }),
    })

    switch (resp.status) {
        case 200: {
            return true;
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let deleteNote = async function (id: string) {
    let resp = await fetch(`http://localhost:5000/api/notes/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
    })
    switch (resp.status) {
        case 200: {
            return true;
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let updateNote = async function (id: string, { tags, ...data }: NoteData) {
    let resp = await fetch(`http://localhost:5000/api/notes/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, tagIds: tags.map(tag => tag._id), id: id }),
    })
    switch (resp.status) {
        case 200: {
            return true;
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

