import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import {
  Typography,
  Button,
  Box,
  TextField,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";

import { UserContext } from "../lib/context";
import { useContext, useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

import { useRouter } from "next/router";

export default function EnterPage() {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      <Typography variant="h1">Login Page</Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {user ? (
          !username ? (
            <UsernameForm />
          ) : (
            <SignOutButton />
          )
        ) : (
          <SignInButton />
        )}
      </Box>
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const router = useRouter();
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <Button
      variant="outlined"
      onClick={() => {
        signInWithGoogle();
      }}
      sx={{
        fontFamily: "Montserrat",
        fontWeight: 700,
        fontSize: "1.25rem",
        textTransform: "none",
      }}
    >
      <Box component="img" src="/googleG.png" sx={{ width: "25px", mr: 1 }} />{" "}
      Sign in with Google
    </Button>
  );
}

// Sign out button
function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      onClick={() => {
        auth.signOut();
        router.push("/");
      }}
    >
      Log Out
    </Button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();

    //redirect user to their newly created profile page
    router.push(`/${formValue}`);
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <Box sx={{ width: { xs: "75%", sm: "50%", lg: "33%" } }}>
        {/* <Typography variant="h3">Choose A Custom Username</Typography> */}
        <form onSubmit={onSubmit}>
          {/* <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          /> */}
          <TextField
            id="username"
            value={formValue}
            onChange={onChange}
            label="Choose username"
            variant="outlined"
            sx={{ width: "100%" }}
            helperText={UsernameMessage(formValue, isValid, loading)}
            required
          />
          {/* <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          /> */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!isValid}
            >
              Choose
            </Button>
          </Box>

          <Table sx={{ mt: 5 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                  Debug State
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>{formValue}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Loading</TableCell>
                <TableCell>{loading.toString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Valid Choice</TableCell>
                <TableCell>{isValid.toString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form>
      </Box>
    )
  );
}

function UsernameMessage(username, isValid, loading) {
  if (loading) {
    return "Checking";
  } else if (isValid) {
    return `${username} is available!`;
  } else if (username.length < 3) {
    return `Must be at least 3 characters long`;
  } else if (username && !isValid) {
    return `That username is taken!`;
  } else {
    return ``;
  }
}
