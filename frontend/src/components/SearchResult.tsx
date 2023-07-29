import { Container, Image, Paper, Text, Title } from "@mantine/core";
import axios from "axios";

export type Search = {
  faviconUrl: string;
  title: string;
  link: string;
  description: string;
};

export function Result({ faviconUrl, title, link, description }: Search) {
  const registerAnalytics = (id: string) => {
    axios.post("http://127.0.0.1:8000/action/link", { body: id });
    window.open(link, "_blank");
  };
  return (
    <Container mt={20}>
      <Paper shadow="xs">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Image
            src={faviconUrl || "/favicon.ico"}
            alt="Favicon"
            width={32}
            height={32}
          />
          <Title order={4} style={{ marginLeft: "1rem" }}>
            {title}
          </Title>
        </div>
        <a
          // href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            registerAnalytics(link);
          }}
        >
          <Text>{link}</Text>
        </a>
        <Text>{description}</Text>
      </Paper>
    </Container>
  );
}

export default function SearchResult() {
  return (
    <div>
      <Result
        faviconUrl="https://example.com/favicon.ico"
        title="Search Result Title"
        link="https://example.com"
        description="This is the search result text."
      />
    </div>
  );
}
