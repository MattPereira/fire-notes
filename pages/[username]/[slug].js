import NoteContent from "../../components/NoteContent";
import { firestore, getUserWithUsername, noteToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Typography, Button, Box } from "@mui/material";

export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let note;
  let path;

  if (userDoc) {
    const noteRef = userDoc.ref.collection("notes").doc(slug);

    note = noteToJSON(await noteRef.get());
    path = noteRef.path;
  }

  return {
    props: { note, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // Improve by using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("notes").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //  { params: {username, slug}}
    // ],
    paths,
    fallback: "blocking",
  };
}

export default function Note(props) {
  const noteRef = firestore.doc(props.path);
  const [realtimeNote] = useDocumentData(noteRef);

  const note = realtimeNote || props.note;

  console.log("NOTE", note);

  return (
    <main>
      <Typography variant="h1">{note.title}</Typography>
      <section>
        <Box sx={{ mb: 2 }}>
          <NoteContent note={note} />
        </Box>
        <Box sx={{ textAlign: "end" }}>
          <Button
            variant="contained"
            color="warning"
            href={`/admin/${note.slug}`}
          >
            Edit
          </Button>
        </Box>
      </section>
    </main>
  );
}
