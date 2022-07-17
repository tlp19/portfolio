import React from "react";
import "./App.css";
import Terminal from "./components/Terminal";

const welcomeMessage = `Hi! I'm Tanguy. Welcome to my personal portfolio.

To get started, type 'help' to view a list of available commands.
`;

const bannerCondensed_peaks =
  "     _/\\/\\/\\/\\/\\/\\__________________________________________________________________/\\/\\/\\/\\/\\___\n" +
  "    _____/\\/\\______/\\/\\/\\______/\\/\\/\\/\\______/\\/\\/\\/\\__/\\/\\__/\\/\\__/\\/\\__/\\/\\______/\\/\\____/\\/\\_ \n" +
  "   _____/\\/\\__________/\\/\\____/\\/\\__/\\/\\__/\\/\\__/\\/\\__/\\/\\__/\\/\\__/\\/\\__/\\/\\______/\\/\\/\\/\\/\\___  \n" +
  "  _____/\\/\\______/\\/\\/\\/\\____/\\/\\__/\\/\\____/\\/\\/\\/\\__/\\/\\__/\\/\\____/\\/\\/\\/\\______/\\/\\_________   \n" +
  " _____/\\/\\______/\\/\\/\\/\\/\\__/\\/\\__/\\/\\________/\\/\\____/\\/\\/\\/\\________/\\/\\______/\\/\\_________    \n" +
  "_______________________________________/\\/\\/\\/\\________________/\\/\\/\\/\\_____________________     \n";

const bannerCondensed_small =
  "  _____                           ___      \n" +
  " |_   _|_ _ _ _  __ _ _  _ _  _  | _ \\     \n" +
  "   | |/ _` | ' \\/ _` | || | || | |  _/     \n" +
  "   |_|\\__,_|_||_\\__, |\\_,_|\\_, | |_|(_)    \n" +
  "                |___/      |__/            \n";

const bannerCondensed = bannerCondensed_small;

const prompt = ">";

function App() {
  return (
    <Terminal
      welcomeMessage={welcomeMessage}
      banner={bannerCondensed}
      terminalPrompt={prompt}
    />
  );
}

export default App;
