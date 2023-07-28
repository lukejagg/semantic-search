import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
  Box,
} from "@mantine/core";

import SearchBar from "../components/SearchBar";

import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchResult, { Search, Result } from "../components/SearchResult";
import { useSearch } from "../hooks/useSearch";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(120),
    paddingBottom: rem(80),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));
export default function SearchResults() {
  let { query } = useParams();
  const { data, isLoading } = useSearch(query || "");

  return (
    <>
      <Box>
        <SearchBar />
      </Box>
      <Box>
        {isLoading ? (
          <Text>Loading...</Text> // fade out opacity
        ) : (
          data?.map((result, i) => (
            <Result
              key={result.title + i}
              faviconUrl={result.faviconUrl}
              title={result.title}
              link={result.link}
              text={result.text}
            />
          ))
        )}
      </Box>
    </>
  );
}
