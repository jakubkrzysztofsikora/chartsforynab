import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import theme from "../src/theme";
import styled from "styled-components";
import { useRouter } from "next/router";
import React from "react";

const StyledAppDiv = styled.div`
  &.page {
    width: 100%;
    height: 100vh;

    & .appbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: fixed;
      height: 48px;
    }

    & .content {
      margin-top: 48px;
      padding: 20px;
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <AppSkeleton>
          <Component {...pageProps} />
        </AppSkeleton>
      </ThemeProvider>
    </>
  );
}

const AppSkeleton = ({ children }: { children: any }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const router = useRouter();

  return (
    <div>
      <StyledAppDiv className="page">
        <AppBar className="appbar">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            onClick={() => router.push("/")}
          >
            Charts for YNAB
          </Typography>
          <Button color="inherit">Login</Button>
        </AppBar>
        <div className="content">{children}</div>
      </StyledAppDiv>
      <Drawer
        open={sidebarOpen}
        anchor="left"
        onClose={() => setSidebarOpen(false)}
      >
        <Box role="presentation">
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Saving Plans"
                  onClick={() => {
                    router.push("/saving-plans");
                    setSidebarOpen(false);
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
