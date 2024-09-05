import { useContext, useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { EditTagsModal } from "../components/EditTagsModal";
import { NoteCard } from "../components/NoteCard";
import { fetchRawNotes } from "../api/notes";
import { deleteTag, fetchTags, updateTag } from "../api/tags";

export type Note = {
    id: string
} & NoteData
export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}
export type Tag = {
    _id: string
    label: string
}

export type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}
export type EditTagsModalProps = {
    tags: Tag[]
    handleClose: () => void
    show: boolean
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
    editButonsStates: boolean[]
    setEditButonsStates: (data: boolean[]) => void
}
export type RawNote = {
    _id: string
} & RawNoteData

export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}

export function NoteList() {
    let [notes, setNotes] = useState<RawNote[]>([])
    let [tags, setTags] = useState<Tag[]>([])
    let notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag._id)), id: note._id }
        })
    }, [notes, tags])
    let [selectedTags, setSelectedTags] = useState<Tag[]>([])
    let [title, setTitle] = useState("")
    let [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)
    let [editButonsStates, setEditButonsStates] = useState<boolean[]>([])
    let navigate = useNavigate();
    let filteredNotes = useMemo(() => {
        return notesWithTags.filter(note => {
            return (
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag =>
                        note.tags.some(noteTag => noteTag._id === tag._id)
                    ))
            )
        })
    }, [title, selectedTags, notesWithTags])
    useEffect(() => {
        getNotes()
    }, [notes.length])
    useEffect(() => {
        getTags()
    }, [tags.length])

    async function getNotes() {
        try {
            let notes = await fetchRawNotes();
            notes && setNotes(notes);
        }
        catch (error: any) {
             window.alert(error);
        }
    }

    async function getTags() {
        try {
            let tags = await fetchTags();
            tags && setTags(tags!);
        }
        catch (error: any) {
             window.alert(error); 
        }
    }

    async function onUpdateTag(id: string, label: string) {
        try {
            let updated = await updateTag(id, label)
            updated && getTags();
        } catch (error: any) {
             window.alert(error); 
        }
    }

    async function onDeleteTag(id: string) {
        try {
            let updated = await deleteTag(id)
            updated && getTags();
        } catch (error: any) {
             window.alert(error); 
        }
    }

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col><h1>Notes</h1></Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <ButtonGroup>
                            <Button variant="primary" onClick={() => {
                                navigate("/new", { state: { tags: tags } });
                            }}>Create</Button>
                            <Button variant="outline-secondary" onClick={() => {
                                setEditTagsModalIsOpen(true)
                                setEditButonsStates(Array(tags.length).fill(true))
                            }}>Edit Tags</Button>
                        </ButtonGroup>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect

                                value={selectedTags.map(tag => {
                                    return {
                                        label: tag.label,
                                        value: tag._id
                                    }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, _id: tag.value }
                                    }))
                                }}
                                options={tags.map(tag => {
                                    return { label: tag.label, value: tag._id }
                                })}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3" >
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard note={{
                            title: note.title,
                            markdown: note.markdown,
                            tags: note.tags,
                            id: note.id
                        }}
                            availableTags={tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal editButonsStates={editButonsStates} setEditButonsStates={(data) => setEditButonsStates(data)} deleteTag={onDeleteTag} updateTag={onUpdateTag} show={editTagsModalIsOpen} handleClose={() => { setEditTagsModalIsOpen(false) }} availableTags={tags} />
        </>
    )
}

