import {
  Card,
  Avatar,
  Text,
  Box,
  Container,
  Title,
  createStyles,
  rem,
  MediaQuery,
  SimpleGrid,
} from "@mantine/core";

type TeamMemberProps = {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
};

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
    boxSizing: "content-box",
    outline: `solid 0px ${theme.fn.primaryColor()}`,
    transition: "box-shadow 0.2s ease, outline 0.1s ease",
    "box-shadow": "0px 0px 0px 0px rgba(192,192,192,0.53)",
    "&:hover": {
      outlineWidth: "4px",
      boxShadow: "0px 0px 10px 4px rgba(192,192,192,0.53)",
    },
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

const TeamMember = ({ name, title, bio, imageUrl }: TeamMemberProps) => {
  const { classes, theme } = useStyles();

  return (
    <Card
      shadow="sm"
      withBorder
      sx={{ background: "transparent", flex: "1" }}
      mx="md"
      padding="lg"
      className={classes.card}
    >
      {/* <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Avatar src={imageUrl} alt={name} radius="md" size={110} mx={"auto"} />
      </MediaQuery> */}
      <Avatar src={imageUrl} alt={name} radius="md" size={210} mx={"auto"} />
      {/* <MediaQuery smallerThan="md" styles={{ display: "none" }}>
      </MediaQuery> */}
      <Text ta="center" weight={500} mt="md" size={"32px"}>
        {name}
      </Text>
      <Text ta="center" c="dimmed" fz="20px">
        {title}
      </Text>
      <p>{bio}</p>
    </Card>
  );
};

const TeamSection = () => {
  const { classes, theme } = useStyles();
  const teamMembers = [
    {
      name: "Zach Tang",
      title: "Backend Dev",
      bio: "",
      imageUrl: "/headshots/zach.png",
    },
    {
      name: "Lucas Jaggernauth",
      title: "ML Engineer",
      bio: "Ex-MLE @ Roblox | ML Research Assistant @ UT Dallas | Honors CS & Cognitive Science @ UT Dallas",
      imageUrl: "/headshots/luke.png",
    },
    {
      name: "Max Chiu",
      title: "Frontend Dev",
      bio: "Frontend dev at Econia",
      imageUrl: "/headshots/max.png",
    },
    // add more team members as needed
  ];

  return (
    <Container size="lg" py="xl" bg={""}>
      <Title order={2} ta="center" mt="sm" className={classes.title} id="team">
        Team
      </Title>
      {/* <Box sx={{ display: "flex" }}> */}
      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "sm", cols: 1 },
        ]}
      >
        {teamMembers.map((member) => (
          <TeamMember key={member.name} {...member} />
        ))}
      </SimpleGrid>
      {/* </Box> */}
    </Container>
  );
};

export default TeamSection;
