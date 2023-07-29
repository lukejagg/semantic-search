import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Search } from "../components/SearchResult";

export const useSearch = (search: string): UseQueryResult<Search[]> => {
  return useQuery(
    ["search", search],
    async () => {
      // return [
      //   {
      //     link: "svelte.txt",
      //     description:
      //       " Conclusion: Svelte is a groundbreaking framework that challenges traditional approaches to building web applications. Its compile-time nature, lack of virtual DOM, and reactivity system provide a fresh and efficient way to create high-performance web applications. As Svelte continues to gain popularity, it is becoming a preferred choice for developers seeking to build modern, responsive, and optimized web experiences with minimal overhead. Whether you are a seasoned developer or just starting your web development journey, exploring Svelte offers an exciting glimpse into the future of web frameworks.``` ",
      //   },
      //   {
      //     link: "roblox.txt",
      //     description:
      //       " The platform has become a global phenomenon, especially among younger audiences. It provides a creative outlet for aspiring game developers and allows players to immerse themselves in a vast and constantly evolving gaming universe. ",
      //   },
      //   {
      //     link: "minecraft.txt",
      //     description:
      //       " Conclusion: Minecraft is a captivating and enduring game that has captivated players of all ages. Its simple yet deep gameplay mechanics, coupled with its creative freedom, have made it a cultural phenomenon. Whether you seek adventure, creativity, or a platform for learning, Minecraft continues to offer an immersive and enchanting experience for players around the world.``` ",
      //   },
      //   {
      //     link: "solidjs.txt",
      //     description:
      //       " 5. Active Community: Although relatively newer than some other frameworks, SolidJS has a growing and supportive community, with contributions and updates regularly. ",
      //   },
      //   {
      //     link: "react.txt",
      //     description:
      //       " React is an open-source JavaScript library maintained by Facebook and a vibrant community of developers. It is widely used for building user interfaces, particularly for single-page applications (SPAs). React was first introduced in 2013 and has since gained tremendous popularity in the web development world. ",
      //   },
      // ];
      const response = await fetch(
        `http://127.0.0.1:8000/action/search/${search}`
      );
      const data = await response.json();
      return data as Search[];
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );
};
