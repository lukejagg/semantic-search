import { Box, MantineProvider } from "@mantine/core";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/About";
import { Global } from "@mantine/core";
import jost from "./fonts/Jost.ttf";
import robotomono from "./fonts/RobotoMono.ttf";

import "./styles/animation.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <div>Contact</div>,
  },
]);
export default function App() {
  return (
    <>
      <Global
        styles={[
          {
            "@font-face": {
              fontFamily: "Jost",
              src: `url('${jost}') format("truetype")`,
            },
          },
          {
            "@font-face": {
              fontFamily: "RobotoMono",
              src: `url('${robotomono}') format("truetype")`,
            },
          },
        ]}
      />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          primaryColor: "blue",
          fontFamily:
            "RobotoMono, ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
          headings: { fontFamily: "RobotoMono" },
          colors: {
            // override dark colors to change them for all components
            // dark: [
            //   "#C1C2C5",
            //   "#A6A7AB",
            //   "#909296",
            //   "#5C5F66",
            //   "#141517",
            //   "#141517",
            //   "#141517",
            //   "#101113",
            //   "#141517",
            //   "#101113",
            // ],
            teal: [
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
              "#60EABC",
            ],
          },
        }}
      >
        <Box
          // sx={{
          //   background: "url(back.png)",
          //   backgroundRepeat: "repeat",
          //   backgroundColor: "white",
          // }}
          className="logo"
        ></Box>
        <div className="box"></div>
        <RouterProvider router={router} />
      </MantineProvider>
    </>
  );
}
