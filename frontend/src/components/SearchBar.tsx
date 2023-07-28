import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";

export default function SearchBar(props: TextInputProps) {
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");

  const search = () => {
    console.log("Search");
  };

  return (
    <TextInput
      icon={<IconSearch size="1.1rem" stroke={1.5} onClick={() => {}} />}
      radius="xl"
      size="md"
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
        >
          {theme.dir === "ltr" ? (
            <IconArrowRight size="1.1rem" stroke={1.5} />
          ) : (
            <IconArrowLeft size="1.1rem" stroke={1.5} />
          )}
        </ActionIcon>
      }
      placeholder="Search questions"
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
