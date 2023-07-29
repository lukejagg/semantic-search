import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
  Image,
  Center,
  Transition,
} from "@mantine/core";

import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

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
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
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

    justifyContent: "center",
    width: "500px",

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

const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top", display: "block" },
  transitionProperty: "transform, opacity",
};

export default function Home() {
  const { classes } = useStyles();
  const [focused, setFocused] = useState(false);

  useEffect(() => {}, [focused]);

  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <motion.div
          animate={{ y: focused ? -40 : -10 }}
          transition={{ type: "tween" }}
        >
          <Center>
            <Image src="/logo.png" alt="logo" width={200} height={72} />
          </Center>
        </motion.div>

        <Transition
          mounted={focused}
          transition={"slide-down"}
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Container
              p={0}
              size={600}
              style={styles}
              sx={{ position: "absolute", top: 45 }}
            >
              <Text size="lg" color="dimmed" className={classes.description}>
                Search internal docs <i>intelligently</i>
              </Text>
            </Container>
          )}
        </Transition>

        <div className={classes.controls}>
          <SearchBar setFocus={setFocused} />
        </div>
      </div>
    </Container>
  );
}
