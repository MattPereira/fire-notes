import { auth } from "../lib/firebase";
import { useState, useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import Link from "../src/Link";

import { UserContext } from "../lib/context";
import { useRouter } from "next/router";

const pages = [{ text: "My Notes", path: "/admin" }];
const settings = ["My Profile", "Logout"];

export default function Navbar() {
  const { user, username } = useContext(UserContext);
  const router = useRouter();

  console.log("USER", user);

  const theme = useTheme();
  console.log(theme);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              color: "white",
              px: 1,
              py: 0.5,
            }}
          >
            <WhatshotIcon
              sx={{
                display: "flex",
                mr: 1,
                color: theme.palette.primary.main,
                fontSize: "45px",
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                fontSize: "2.25rem",
                display: "flex",
                fontFamily: "Righteous",
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              FireNotes
            </Typography>
          </Box>
          <Box>
            {/* user is signed-in and has username */}
            {username && (
              <Box sx={{ display: "flex" }}>
                <Box sx={{ mr: 3 }}>
                  {pages.map((page) => (
                    <Button
                      key={page.text}
                      component={Link}
                      href={page.path}
                      sx={{
                        my: 2,
                        color: "white",
                        display: "block",
                        fontSize: "1.15rem",
                      }}
                    >
                      {page.text}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt="User Avatar"
                        referrerPolicy="no-referrer"
                        src={user?.photoURL}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      component={Link}
                      href={`/${username}`}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">My Profile</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push("/");
                        auth.signOut();
                        handleCloseUserMenu;
                      }}
                    >
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}

            {/* user is not signed OR has not created username */}
            {!username && (
              <Button
                disableElevation
                variant="contained"
                component={Link}
                href="/enter"
                sx={{
                  bgcolor: "white",
                  color: "black",
                  fontFamily: "cubano",
                  fontSize: "1.15rem",
                  "&:hover": {
                    bgcolor: theme.palette.secondary.main,
                  },
                }}
              >
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
