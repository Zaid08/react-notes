import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Note, Tag } from "./NoteList";
import { useContext } from "react";
import { deleteNote } from "../api/notes";

export function NoteDetails() {
    const navigate = useNavigate()
    let { state } = useLocation();
    let note = state.note as Note;
    let availableTags = state.availableTags as Tag[];

    async function onDeleteNote(id: string) {
        try {
            let deleted = await deleteNote(id);
            deleted && navigate("/", { replace: true })
        } catch (error: any) {
             window.alert(error); 
        }
    }
    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>{note.title}</h1>
                    {note.tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className="flex-wrap">
                            {note.tags.map(tag => (
                                <Badge className="text-truncate" key={tag._id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to={`/${note.id}/edit`} state={{ note: note, availableTags: availableTags }} replace={true}>
                            <Button variant="primary">Edit</Button>
                        </Link>
                        <Button onClick={() => {
                            onDeleteNote(note.id);
                        }} variant="outline-danger">Delete</Button>
                        <Link to="/">
                            <Button variant="outline-secondary">Back</Button>
                        </Link>
                    </Stack>
                </Col>
            </Row>
            <ReactMarkdown>{note.markdown}</ReactMarkdown>
        </>
    )
}