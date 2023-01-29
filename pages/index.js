import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
// import Link from "../src/Link";
import Link from "next/link";

import { toast } from "react-hot-toast";

import Loader from "../components/Loader";
import { useState } from "react";
import { firestore, fromMillis, noteToJSON } from "../lib/firebase";
import NoteFeed from "../components/NoteFeed";

// Max note to query per page
const LIMIT = 5;

export async function getServerSideProps() {
  const notesQuery = firestore
    .collectionGroup("notes")
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const notes = (await notesQuery.get()).docs.map(noteToJSON);

  return {
    props: { notes }, //will be passed to the page component as props
  };
}

export default function Homepage(props) {
  const [notes, setNotes] = useState(props.notes);
  const [loading, setLoading] = useState(false);
  const [notesEnd, setNotesEnd] = useState(false);

  console.log("notes", notes);

  const getMoreNotes = async () => {
    setLoading(true);
    const last = notes[notes.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("notes")
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newNotes = (await query.get()).docs.map((doc) => doc.data());

    setNotes(notes.concat(newNotes));
    setLoading(false);

    if (newNotes.length < LIMIT) {
      setNotesEnd(true);
    }
  };

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Home Page
      </Typography>

      <NoteFeed notes={notes} />

      {!loading && !notesEnd && (
        <Button onClick={getMoreNotes}>Load more</Button>
      )}

      {notesEnd && "You have reached the end!"}
    </Box>
  );
}
