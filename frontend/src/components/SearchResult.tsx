import { Box, Container, Image, Paper, Text, Title } from "@mantine/core";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

export type Search = {
  faviconUrl: string;
  title: string;
  link: string;
  description: string;
  skeleton?: boolean;
};

function truncateText(text: string, maxLength = 200) {
  if (text.length <= maxLength) {
    return text;
  }

  var truncatedText = text.substring(0, maxLength) + "...";
  return truncatedText;
}
function htmlDecode(content: string) {
  let e = document.createElement("div");
  e.innerHTML = content;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function getFaviconUrl(url: string) {
  if (url.includes("localhost")) {
    return "/favicon.ico";
  }

  if (url.includes("docs.google")) {
    return "/docs.ico";
  }
  if (url.includes("confluence")) {
    return "/confluence.ico";
  }
  if (url.includes("github")) {
    return "/github.ico";
  }
  if (url.includes("sites.google")) {
    return "/sites.ico";
  }
  return undefined;
}
export function Result({
  faviconUrl,
  title,
  link,
  description,
  skeleton,
}: Search) {
  const registerAnalytics = (id: string) => {
    axios.post("http://127.0.0.1:8000/action/link", { body: id });
    console.log(link);
    window.open(link, "_blank");
  };
  if (skeleton) {
    return (
      <Container mt={20} ml={0} pl={0}>
        <Paper shadow="none">
          <Box sx={{ display: "flex", padding: "10px" }}>
            <Box>
              <Box w={32} h={82} sx={{ fontSize: "32px" }}>
                <Skeleton circle={true} />
              </Box>
              {/* <Image
                src={faviconUrl || "/favicon.ico"}
                alt="Favicon"
                width={32}
                height={32}
              /> */}
            </Box>
            <Box style={{ marginLeft: "1rem" }}>
              <Title
                order={4}
                style={{
                  textDecoration: "none",
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={() => {
                  registerAnalytics(link);
                }}
                w={"200px"}
              >
                <Skeleton />
              </Title>
              <Text size="xs" c="dimmed">
                <Text w={"300px"}>
                  <Skeleton />
                </Text>
              </Text>
              <Text w={"800px"}>
                <Skeleton count={3} />
              </Text>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }
  return (
    <Container mt={20} ml={0} pl={0}>
      <Paper shadow="none">
        <Box sx={{ display: "flex", padding: "10px" }}>
          <Box>
            <Image
              src={getFaviconUrl(link) || "/favicon.ico"}
              alt="Favicon"
              width={32}
              height={32}
            />
          </Box>
          <Box style={{ marginLeft: "1rem" }}>
            <Title
              order={4}
              style={{
                textDecoration: "none",
                color: "blue",
                cursor: "pointer",
              }}
              onClick={() => {
                registerAnalytics(link);
              }}
            >
              {title || "No title"}
            </Title>
            <Text size="xs" c="dimmed">
              <Text
                dangerouslySetInnerHTML={{ __html: htmlDecode(link) ?? "" }}
              ></Text>
            </Text>
            <Text
              dangerouslySetInnerHTML={{
                __html: truncateText(description),
              }}
            >
              {/* {truncateText(description)} */}
            </Text>
          </Box>
        </Box>
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
