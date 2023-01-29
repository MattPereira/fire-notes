import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";

// UI component for main note content
export default function NoteContent({ note }) {
  const createdAt =
    typeof note?.createdAt === "number"
      ? new Date(note.createdAt)
      : note.createdAt.toDate();

  console.log("CREATED AT", new Date(createdAt).toLocaleDateString());

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Box>
      <Typography variant="p" sx={{ ml: 2 }}>
        Written by <Link href={`/${note.username}/`}>@{note.username}</Link> on{" "}
        {formattedDate}
      </Typography>
      <Box sx={{ border: "1px solid gray", p: 3, borderRadius: "20px" }}>
        <ReactMarkdown>{note?.content}</ReactMarkdown>
      </Box>
    </Box>
  );
}
