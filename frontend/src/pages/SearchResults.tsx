import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
  Box,
  Image,
  Center,
} from "@mantine/core";

import SearchBar from "../components/SearchBar";

import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [delay, setDelay] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) {
      setDelay(true);
      setTimeout(() => {
        setDelay(false);
      }, 2500);
    }
  }, []);

  return (
    <Container maw={"70rem"}>
      <Center mb={20}>
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={72}
          sx={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        />
      </Center>
      <Box>
        <SearchBar />
      </Box>
      <Text size="xs" c="dimmed" ml={10} mt={10}>
        {data?.length} results for "{query}"
      </Text>
      <Box
        sx={
          isLoading || delay
            ? {
                maskImage:
                  "linear-gradient(to bottom, black 0%, transparent 100%);",
              }
            : {}
        }
      >
        {isLoading || delay ? (
          <>
            <Result
              faviconUrl={""}
              title={""}
              link={""}
              description={""}
              skeleton={true}
            />{" "}
            <Result
              faviconUrl={""}
              title={""}
              link={""}
              description={""}
              skeleton={true}
            />{" "}
            <Result
              faviconUrl={""}
              title={""}
              link={""}
              description={""}
              skeleton={true}
            />{" "}
            <Result
              faviconUrl={""}
              title={""}
              link={""}
              description={""}
              skeleton={true}
            />{" "}
          </>
        ) : (
          data?.map((result, i) => (
            <Result
              key={result.title + i}
              faviconUrl={result.faviconUrl}
              title={result.title}
              link={result.link}
              description={result.description}
            />
          ))
        )}
      </Box>
    </Container>
  );
}
