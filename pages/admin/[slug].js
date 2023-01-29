import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { TextField, Button, Box, Typography, Alert, Grid } from "@mui/material";
import ImageUploader from "../../components/ImageUploader";

export default function AdminNoteEdit(props) {
  return (
    <>
      <AuthCheck>
        <NoteManager />
      </AuthCheck>
    </>
  );
}

function NoteManager() {
  const [preview, setPreview] = useState(true);

  const router = useRouter();
  const { slug } = router.query;
  console.log("ROUTER", router);

  const noteRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("notes")
    .doc(slug);
  const [note] = useDocumentData(noteRef);

  return (
    <main>
      {note && (
        <>
          <section style={{ marginBottom: "2rem" }}>
            <Typography variant="h1">{note.title}</Typography>

            <NoteForm
              noteRef={noteRef}
              defaultValues={note}
              preview={preview}
            />
          </section>
          <section>
            <Box sx={{ mb: 1, textAlign: "center" }}>
              <Typography variant="p">ID: {note.slug}</Typography>
            </Box>

            <Box sx={{ mb: preview ? 0 : 1, textAlign: "center" }}>
              <Button
                sx={{ mr: 1 }}
                variant="contained"
                color="secondary"
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Link
                href={`/${note.username}/${note.slug}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" color="info">
                  Show Live
                </Button>
              </Link>
            </Box>
          </section>
        </>
      )}
    </main>
  );
}

function NoteForm({ defaultValues, noteRef, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const updateNote = async ({ content }) => {
    await noteRef.update({
      content,
      updatedAt: serverTimestamp(),
    });

    reset({ content });

    toast.success("Note updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updateNote)}>
      {preview && (
        <Box>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </Box>
      )}

      <Box>
        <TextField
          multiline
          rows={20}
          sx={{
            width: "100%",
            fontSize: "20px",
            borderRadius: "10px",
            mb: 2,
            bgcolor: "white",
            "& fieldset": { border: "none" },
          }}
          name="content"
          {...register("content", {
            maxLength: {
              value: 20000,
              message: "content is over 20,000 characters",
            },
            minLength: {
              value: 10,
              message: "content is less than 10 characters",
            },
            required: { value: true, message: "content is required" },
          })}
        />
        {errors?.content && (
          <Alert severity="warning">{errors.content.message}</Alert>
        )}

        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item xs={10}>
            <ImageUploader />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!isDirty || !isValid}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}
