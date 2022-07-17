import React, { useState, useEffect } from "react";
import Banner from "./Banner";
import TerminalOutput from "./TerminalOutput";
import InputArea from "./InputArea";
import ErrorMessage from "./ErrorMessage";
import WelcomeMessage from "./WelcomeMessage";

// Just a little helper function so I don't have to continually update my age
const getAge = (birthDate: Date) => {
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const downloadFile = (uri: string, downloadName: string) => {
  const link = document.createElement("a");
  link.download = downloadName;
  link.href = uri;
  link.click();
  link.remove();
};

type TerminalProps = {
  terminalPrompt?: string;
  banner?: string;
  welcomeMessage?: string;
};
const Terminal = (props: TerminalProps) => {
  const { terminalPrompt = ">", banner, welcomeMessage } = props;
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(3);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const scrollLastCommandTop = () => {
    scrollRef.current?.scrollIntoView();
  };

  useEffect(scrollLastCommandTop, [output]);

  const echoCommands = [
    "help",
    "about",
    "experience",
    "education",
    "projects",
    "links",
    "skills",
  ] as const;
  type EchoCommand = typeof echoCommands[number];

  const utilityCommands = [
    "cv",
    "all",
    "clear",
  ] as const;
  type UtilityCommand = typeof utilityCommands[number];

  const allCommands = [...echoCommands, ...utilityCommands] as const;
  type Command = typeof allCommands[number];

  function isEchoCommand(arg: string): arg is EchoCommand {
    return (echoCommands as ReadonlyArray<string>).includes(arg);
  }

  function isUtilityCommand(arg: string): arg is UtilityCommand {
    return (utilityCommands as ReadonlyArray<string>).includes(arg);
  }

  function isValidCommand(arg: string): arg is Command {
    return isEchoCommand(arg) || isUtilityCommand(arg);
  }

  const glow = (text: string) => {
    return <span className="terminal-glow">{text}</span>;
  };

  const commands: { [key in EchoCommand]: JSX.Element } = {
    help: (
      <div>
        <p>
          Just type any of the commands below to get some more info.
          You can even type a few letters and press [Tab] or '.' to 
          autocomplete.
        </p>
        <dl>
          <dt>about</dt>
          <dd>Some general information about me</dd>
          <dt>experience</dt>
          <dd>My work experience</dd>
          <dt>education</dt>
          <dd>What I've been studying for the past few years</dd>
          <dt>projects</dt>
          <dd>A curated selection of some of my projects</dd>
          <dt>skills</dt>
          <dd>Some of the things that I'm pretty good at</dd>
          <dt>links</dt>
          <dd>Email, GitHub, LinkedIn</dd>
          <dt>cv</dt>
          <dd>Check out my CV [pdf - 156KB]</dd>
          <dt>all</dt>
          <dd>Tell me everything</dd>
          <dt>clear</dt>
          <dd>Clears the terminal of all output</dd>
        </dl>
      </div>
    ),

    about: (
      <div>
        <p>
          Hey there! As you probably know, my name is {glow("Tanguy Perron")}.
          I'm a {getAge(new Date(2001, 10, 15))} year old{" "}
          {glow("Electronic and Information Engineering student")} doing a
          Master of Engineering at {glow("Imperial College London")}.
        </p>
        <p>
          I am French and did my {glow("French Scientific Baccalauréat")} in France, 
          near Paris. I achieved the {glow("Highest Honours")} with a grade of{" "}
          {glow("19.55/20 (~97.75%)")}. I then moved to London (UK) to pursue 
          my higher studies.
        </p>
        <p>
          I since have been studying at {glow("Imperial College London")} and
          could not have made a better choice! For the past{" "}
          {getAge(new Date(2019, 10, 1)) + 1} years, I have been studying
          the fundamentals of computer electronics and 
          programming and I am fascinated by it. I am also dabbling in some 
          higher-level subjects, such as Artificial Intelligence and Computer
          Vision, and I am loving every second of it (although the difficulty
          is extremely high and I've been facing many challenges).{" "}
          <em>
              To learn more about my studies, you can type 'education'. And to
              learn about the projects I have done so far at Imperial College,
              you can type 'projects'.
          </em>
        </p>
        <p>
          Alongside my studies, I have had some work experience as a{" "}
          {glow("Full Stack and Cloud Developer")}, and I am currently
          pursuing an internship as a {glow("Data Scientist")}.{" "}
          <em>
            To learn more about my work experiences, you can type 'experience'.
          </em>
        </p>
        <p>
          Some of my current interests include: emerging technologies,
          machine learning, mobile development, and photography.
        </p>
        <p>
          Please feel free to get in touch with me to discuss any opportunities.
          You can find different ways to reach me by typing 'links',
          and if you would like to check out my {glow("CV")}, simply type 'cv'
          or click{" "}
          <a href="CV.pdf" download="Tanguy Perron - Curriculum Vitae.pdf">
            here
          </a>
          .
        </p>
      </div>
    ),

    experience: (
      <>
        <dl>
          <dt>Apr-Sep 2022 • Data Scientist Intern • Institut de Recherches Servier (FR)</dt>
          <dd>Unfortunately, because of confidentiality reasons, I cannot discuss what I have been working on for now.</dd>

          <br/>
          <dt>Jul-Sep 2021 • Full-stack and Cloud Developer • UniVerse (Remote)</dt>
          <dd>I served as a Full Stack and Cloud Developer to build a social application for Android, iOS and Web.</dd>
          <dd>I worked on both {glow("front and back-end")} components of the app, as well as on the design of the{" "}
              {glow("databases and DevOps")}.</dd>
          <dd>This work was carried in Dart using the Flutter framework, with integration of Google Firebase services.</dd>
          <dd>I also researched and produced reports on technologies that the company wished to adopt.</dd>
          <dd>I worked alongside the {glow("company's CTO")} as well as independently, relying on both my
              communication and team-working skills, and my autonomy.</dd>

          <br/>
          <dt>Aug-Sep 2020 • Multi-skilled Crew Member • McDonald's (FR)</dt>
          <dd>I worked for over a month during the summer at McDonald's as a Multi-skilled Crew Member.</dd>
          <dd>
            I was responsible for several tasks:
            <ul>
              <li>some requiring a high level of autonomy, discipline and organization 
                  (e.g. taking orders, cleaning and maintenance)</li>
              <li>others challenging my team working skills and communication to achieve {glow("high-efficiency")} standards 
                  (e.g. preparing products, assembling orders and helping customers)</li>
            </ul>
          </dd>
          <dd>Overall, I discovered what it is like to be apart of a {glow("collaborating team")} in such a huge company.</dd>
        </dl>
      </>
    ),

    education: (
      <>
        <dl>
          <dt>2019-Today • Electronic and Information MEng • Imperial College London (UK)</dt>
          <dd>Currently in my third year, on track to achieve {glow("First-class Honours")}.</dd>
          <dd>
            The main modules that I have studied include:
            <ul>
              <li>Artificial Intelligence</li>
              <li>Machine Learning</li>
              <li>Computer Vision</li>
              <li>High Level Programming</li>
              <li>Embedded Systems</li>
              <li>Software Systems</li>
              <li>Operations Research</li>
            </ul>
          </dd>
          <dd>
            Optional modules undertook:
            <ul>
              <li>Designing Interventions for Behavioural Change</li>
              <li>Creative Digital Platforms</li>
              <li>Introduction to Psychology</li>
            </ul>
          </dd>

          <br/>
          <dt>2016-2019 • French Scientific Baccalauréat • Lycée Blaise Pascal (FR)</dt>
          <dd>Achieved a score of 19.55/20 overall (~97.75%).</dd>
          <dd>Received the {glow("Highest Honours")}.</dd>
          <dd>
            Optional modules undertook:
            <ul>
              <li>Spanish</li>
              <li>Latin</li>
            </ul>
          </dd>
        </dl>
      </>
    ),

    projects: (
      <>
        <dl>
          <dt>
            NotiSound (IoT Device) • Year 2 Embedded Systems CW -{" "}
            <a
              href="https://github.com/tlp19/NotiSound-returnSuccess4"
              target="_blank"
              rel="noopener noreferrer">
              GitHub repository
            </a>
          </dt>
          <dd>sentence.</dd>
          <dd>sentence.</dd>
          <dd>sentence.</dd>

          <br/>
          <dt>
            Music Synthesizer OS • Year 2 Embedded Systems CW -{" "}
            <a
              href="https://github.com/tlp19/ES-synth-returnSuccess4"
              target="_blank"
              rel="noopener noreferrer">
              GitHub repository
            </a>
          </dt>
          <dd>sentence.</dd>
          <dd>sentence.</dd>
          <dd>sentence.</dd>

          <br/>
          <dt>
            Neural Network library • Year 2 Machine Learning CW - <em>Private repository</em>
          </dt>
          <dd>sentence.</dd>
          <dd>sentence.</dd>
          <dd>sentence.</dd>

          <br/>
          <dt>
            Mars Rover • Year 2 Final Project -{" "}
            <a
              href="https://github.com/tlp19/MarsRover-returnSuccess3"
              target="_blank"
              rel="noopener noreferrer">
              GitHub repository
            </a>
          </dt>
          <dd>sentence.</dd>
          <dd>sentence.</dd>
          <dd>sentence.</dd>
        </dl>
      </>
    ),

    skills: (
      <>
        {/* Color coding
          10-13      00DE12
          6-9        99D100
          0-5        D16200 */}

        <div className="terminal-heading">Natural Languages</div>
        <dl>
          <dt>English</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
              ############
            </span>
            {"  "}
            ##
          </dd>
          <dt>French</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
              #############
            </span>
            {" "}
            ##
          </dd>
          <dt>German</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              ######
            </span>
            {"        "}
            ##
          </dd>
          <dt>Spanish</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              ######
            </span>
            {"        "}
            ##
          </dd>
        </dl>

        <div className="terminal-heading">Programming Languages</div>
        <dl>
          <dt>Python</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
              ###########
            </span>
            {"   "}
            ##
          </dd>
          <dt>Dart</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
              ##########
            </span>
            {"    "}
            ##
          </dd>
          <dt>C and C++</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              ########
            </span>
            {"      "}
            ##
          </dd>
          <dt>F#</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              ######
            </span>
            {"        "}
            ##
          </dd>
          <dt>SystemVerilog</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#D16200", textShadow: "0 0 5px #D16200" }}>
              #####
            </span>
            {"         "}
            ##
          </dd>
          <dt>MatLab</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#D16200", textShadow: "0 0 5px #D16200" }}>
              #####
            </span>
            {"         "}
            ##
          </dd>
        </dl>

        <div className="terminal-heading">Cloud &amp; Infrastructure</div>
        <dl>
          <dt>GCP / Firebase</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              #########
            </span>
            {"     "}
            ##
          </dd>
          <dt>AWS</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              #######
            </span>
            {"       "}
            ##
          </dd>
          <dt>DevOps</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              #######
            </span>
            {"       "}
            ##
          </dd>
          <dt>
            Infrastructures <br />
            <span style={{ fontSize: "smaller" }}>
              (VMs, WSL, Docker, DBs, etc.)
            </span>
          </dt>
          <dd>
            ##{" "}
            <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
              #######
            </span>
            {"       "}
            ##
          </dd>
        </dl>

        <div className="terminal-heading">Web, Desktop and Mobile</div>
        <dl>
          <dt>Flutter</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
              ##########
            </span>
            {"    "}
            ##
          </dd>
          <dt>General web development</dt>
          <dd>
            ##{" "}
            <span style={{ color: "#D16200", textShadow: "0 0 5px #D16200" }}>
              #####
            </span>
            {"         "}
            ##
          </dd>
        </dl>
      </>
    ),

    links: (
      <>
        <dl>
          <dt>Email</dt>
          <dd>
            <a href="mailto:tanguy.perron19@imperial.ac.uk">
              tanguy.perron19@imperial.ac.uk
            </a>
          </dd>
          <dt>GitHub</dt>
          <dd>
            <a
              href="https://github.com/tlp19"
              target="_blank"
              rel="noopener noreferrer">
              github.com/tlp19
            </a>
          </dd>
          <dt>LinkedIn</dt>
          <dd>
            <a
              href="https://www.linkedin.com/in/tanguy-perron/"
              target="_blank"
              rel="noopener noreferrer">
              linkedin.com/in/tanguy-perron
            </a>
          </dd>
        </dl>
      </>
    ),
  };

  const processCommand = (input: string) => {
    // Store a record of this command with a ref to allow us to scroll it into view.
    // Note: We use a ref callback here because setting the ref directly, then clearing output seems to set the ref to null.
    const commandRecord = (
      <div
        ref={(el) => (scrollRef.current = el)}
        className="terminal-command-record"
      >
        <span className="terminal-prompt">{terminalPrompt}</span>{" "}
        <span>{input}</span>
      </div>
    );

    // Add command to to history if the command is not empty
    if (input.trim()) {
      setHistory([...history, input]);
      setHistoryIndex(history.length + 1);
    }

    // Now process command, ignoring case
    const inputCommand = input.toLowerCase();
    if (!isValidCommand(inputCommand)) {
      setOutput([
        ...output,
        commandRecord,
        <div className="terminal-command-output">
          <ErrorMessage command={inputCommand} />
        </div>,
      ]);
    } else if (isEchoCommand(inputCommand)) {
      setOutput([
        ...output,
        commandRecord,
        <div className="terminal-command-output">{commands[inputCommand]}</div>,
      ]);
    } else if (isUtilityCommand(inputCommand)) {
      switch (inputCommand) {
        case "clear": {
          setOutput([]);
          break;
        }
        case "all": {
          // Output all commands in a custom order.
          const allCommandsOutput = [
            "about",
            "experience",
            "education",
            "projects",
            "skills",
            "links",
          ].map((command) => (
            <>
              <div className="terminal-section">{command.toUpperCase()}</div>
              <div className="terminal-section">{"-".repeat(command.length)}</div>
              <div className="terminal-command-output">
                {commands[command as EchoCommand]}
              </div>
            </>
          ));

          setOutput([commandRecord, ...allCommandsOutput]);
          break;
        }
        case "cv": {
          setOutput([...output, commandRecord]);
          downloadFile("CV.pdf", "Tanguy Perron - Curriculum Vitae.pdf");
          break;
        }
      }
    }
  };

  const getHistory = (direction: "up" | "down") => {
    let updatedIndex;
    if (direction === "up") {
      updatedIndex = historyIndex === 0 ? 0 : historyIndex - 1;
    } else {
      updatedIndex =
        historyIndex === history.length ? history.length : historyIndex + 1;
    }
    setHistoryIndex(updatedIndex);
    return updatedIndex === history.length ? "" : history[updatedIndex];
  };

  const getAutocomplete = (input: string) => {
    const matchingCommands = allCommands.filter((c) => c.startsWith(input));
    if (matchingCommands.length === 1) {
      return matchingCommands[0];
    } else {
      const commandRecord = (
        <div
          ref={(el) => (scrollRef.current = el)}
          className="terminal-command-record"
        >
          <span className="terminal-prompt">{terminalPrompt}</span>{" "}
          <span>{input}</span>
        </div>
      );
      setOutput([...output, commandRecord, matchingCommands.join("    ")]);
      return input;
    }
  };

  const focusOnInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      // Prevent tab from moving focus
      event.preventDefault();
    }
    inputRef.current?.focus();
  };

  return (
    <div className="terminal-container" tabIndex={-1} onKeyDown={focusOnInput}>
      <div className="terminal-content">
        {banner && <Banner banner={banner} />}
        {welcomeMessage && (
          <WelcomeMessage message={welcomeMessage} inputRef={inputRef} />
        )}
        <TerminalOutput outputs={output} />
        <InputArea
          setOutput={setOutput}
          processCommand={processCommand}
          getHistory={getHistory}
          getAutocomplete={getAutocomplete}
          inputRef={inputRef}
          terminalPrompt={terminalPrompt}
        />
      </div>
    </div>
  );
};

export default Terminal;
