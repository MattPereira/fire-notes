import AuthCheck from "../../components/AuthCheck";
import NoteFeed from "../../components/NoteFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

import { Box, Typography, TextField, Button, Grid } from "@mui/material";

export default function AdminNotesPage(props) {
  return (
    <main>
      <Typography variant="h1">Admin Page</Typography>
      <AuthCheck>
        <CreateNewNote />
        <NoteList />
      </AuthCheck>
    </main>
  );
}

function NoteList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("notes");
  const query = ref.orderBy("createdAt", "desc");
  const [querySnapshot] = useCollection(query);

  const notes = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <Typography
        variant="h4"
        sx={{ ml: 3, mb: 2, fontFamily: "cubano", fontSize: "2.75rem" }}
      >
        My Notes
      </Typography>
      <NoteFeed notes={notes} admin />
    </>
  );
}

function CreateNewNote() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new note in firestore
  const createNote = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("notes")
      .doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await ref.set(data);

    toast.success("Note created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <Box sx={{ mb: 5 }}>
      {/* <Typography variant="h4">Create Note</Typography> */}
      <form onSubmit={createNote}>
        <Grid container justifyContent="center">
          <Grid item sx={{ width: "50%" }}>
            <TextField
              value={title}
              sx={{ width: "100%", mb: 1, bgcolor: "white" }}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title of new note"
            />
            <Box
              sx={{
                bgcolor: "black",
                borderRadius: "5px",
                color: "white",
                px: 1,
                py: 0.5,
              }}
            >
              <Typography variant="p">
                <strong>slug :</strong> {slug}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              disabled={!isValid}
              variant="contained"
              color="success"
              sx={{
                height: "56px",
                ml: 1,
              }}
            >
              Create Note
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
