import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface SearchBarProps extends TextInputProps {
  setFocus?: (focus: boolean) => void;
}

export default function SearchBar(props: SearchBarProps) {
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  let { query: pre } = useParams();

  useEffect(() => {
    if (pre) {
      setQuery(pre);
    }
  }, []);

  const search = () => {
    if (query === "") {
      return;
    }
    navigate(`/search/${query}`);
    console.log(`searching for ${query}`);
  };

  return (
    <TextInput
      icon={<IconSearch size="1.1rem" stroke={1.5} />}
      radius="xl"
      size="md"
      value={query}
      width="100%"
      onFocus={() => {
        if (props.setFocus) {
          props.setFocus(true);
        }
      }}
      onBlur={() => {
        if (props.setFocus) {
          props.setFocus(false);
        }
      }}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
          onClick={() => {
            search();
          }}
        >
          {theme.dir === "ltr" ? (
            <IconArrowRight size="1.1rem" stroke={1.5} />
          ) : (
            <IconArrowLeft size="1.1rem" stroke={1.5} />
          )}
        </ActionIcon>
      }
      rightSectionWidth={42}
      onChange={(event) => setQuery(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          search();
        }
      }}
      {...props}
    />
  );
}
