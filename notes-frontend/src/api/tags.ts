import { Tag } from "../pages/NoteList";

export let fetchTags = async function () {
    let resp = await fetch('http://localhost:5000/api/tags/', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    switch (resp.status) {
        case 200: {
            let respJson = await resp.json();
            let tags = respJson as Tag[];
            return tags;
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let updateTag = async function (id: string, label: string) {
    let resp = await fetch("http://localhost:5000/api/tags/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, label: label }),
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

export let addTag = async function (label: string) {

    let resp = await fetch("http://localhost:5000/api/tags/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ label: label }),
    })
    switch (resp.status) {
        case 200: {
            let jsonResp = await resp.json()
            return jsonResp.insertedId;
        }
        default: {
            throw new Error("Something went wrong");
        }
    }

}

export let deleteTag = async function (id: string) {
    let resp = await fetch(`http://localhost:5000/api/tags/delete`, {
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