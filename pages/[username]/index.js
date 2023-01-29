/** NextJS note: static routes have priority so "/admin" will take priority over the dynamic "/[username]" */

import UserProfile from "../../components/UserProfile";
import NoteFeed from "../../components/NoteFeed";
import { getUserWithUsername, noteToJSON } from "../../lib/firebase";

// This function automatically gets called by NextJS anytime "/[username]" is requested
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let notes = null;

  if (userDoc) {
    user = userDoc.data();
    const notesQuery = userDoc.ref
      .collection("notes")
      .orderBy("createdAt", "desc")
      .limit(5);

    console.log("NOTE QUERY DOCS", notesQuery.get().docs);
    notes = (await notesQuery.get()).docs.map(noteToJSON);
  }

  return {
    props: { user, notes }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, notes }) {
  console.log("NOTES", notes);
  console.log("User", user);

  return (
    <main>
      <UserProfile user={user} />
      <NoteFeed notes={notes} />
    </main>
  );
}
