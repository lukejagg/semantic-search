import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  Loader,
  Autocomplete,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface SearchBarProps extends TextInputProps {
  setFocus?: (focus: boolean) => void;
}

type Autocomplete = string[];

export const useAutocomplete = (
  search: string
): UseQueryResult<Autocomplete> => {
  return useQuery(
    ["autocomplete", search],
    async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/action/autocomplete/${search}`
      );
      const data = await response.json();
      return data as Autocomplete;
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );
};

export default function SearchBar(props: SearchBarProps) {
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  let { query: pre } = useParams();
  const [delay, setDelay] = useState(false);

  const { data, isFetching } = useAutocomplete(query || "-");

  useEffect(() => {
    if (isFetching && query) {
      setDelay(true);
      setTimeout(() => {
        setDelay(false);
      }, 250);
    }
  }, [query]);

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
    <Autocomplete
      icon={
        query && (isFetching || delay) ? (
          <Loader size="1rem" />
        ) : (
          <IconSearch size="1.1rem" stroke={1.5} />
        )
      }
      radius="xl"
      size="md"
      value={query}
      data={query && data ? data : []}
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
      onChange={(event) => setQuery(event)}
      filter={() => true}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          search();
        }
      }}
    />
  );
}
