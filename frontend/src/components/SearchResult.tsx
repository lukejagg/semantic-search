import { Image, Paper, Text, Title } from "@mantine/core";
import axios from "axios";

export type Search = {
  faviconUrl: string;
  title: string;
  link: string;
  text: string;
};

export function Result({ faviconUrl, title, link, text }: Search) {
  const registerAnalytics = (id: string) => {
    axios.post("localhost:8001/analytics", { id });
    window.open(link, "_blank");
  };
  return (
    <Paper shadow="xs">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <Image src={faviconUrl} alt="Favicon" width={32} height={32} />
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
      <Text>{text}</Text>
    </Paper>
  );
}

export default function SearchResult() {
  return (
    <div>
      <Result
        faviconUrl="https://example.com/favicon.ico"
        title="Search Result Title"
        link="https://example.com"
        text="This is the search result text."
      />
    </div>
  );
}
