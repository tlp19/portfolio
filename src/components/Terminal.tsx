import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Banner from "./Banner";
import TerminalOutput from "./TerminalOutput";
import InputArea from "./InputArea";
import ErrorMessage from "./ErrorMessage";
import WelcomeMessage from "./WelcomeMessage";
import fireworks from "./fireworks";

// Import images
import cps1Image from "../assets/cps1.png";
import cps2Image from "../assets/cps2.png";
import cps3Image from "../assets/cps3.png";
// import errundsImage from "../assets/errunds_app.png";
// import ideFundamentalsImage from "../assets/ide_fundamentals.png";
// import impactImage from "../assets/impact_app.png";
import notisoundAppImage from "../assets/notisound_app.png";
import notisoundNotifImage from "../assets/notisound_notification.png";
import notisoundTechImage from "../assets/notisound_tech.png";
import roverImage from "../assets/rover.png";
// import sussysImage from "../assets/sustainable_systems.png";
import wheeleSimImage from "../assets/wheele_sim.png";
import wheeleChairImage from "../assets/wheele_wheelchair.png";
import fypCoverImage from "../assets/fyp_cover.jpg";
import fypDeviceImage from "../assets/fyp_device.png";
import fypBenchmarkImage from "../assets/fyp_benchmark.png";
import fypTrackingImage from "../assets/fyp_tracking.png";
import fypSystemDiagramImage from "../assets/fyp_system_diagram.png";
import synthDependencyGraphImage from "../assets/synth_dependency_graph.png";


// Just a little helper function so I don't have to continually update my age
const getAge = (birthDate: Date) => {
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  console.log(age);
  var m = today.getMonth() - birthDate.getMonth() + 1; // Adjusting for zero-based month index
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
    console.log('decrease');
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

// Define a structure for the image map for clarity
interface ImageDetails {
  url: string;
  caption: string;
  displayName?: string;
}
type OpenImageViewerType = (imageName: string) => void;

// Takes the current image/project name and the image map, returning a sorted list of project keys.
const getProjectImageKeys = (imageName: string, imageMap: Record<string, ImageDetails>): string[] => {
    
    // 1. Determine the Project Key Prefix (e.g., 'fyp' from 'fyp_tracking')
    const projectKey = imageName.split('_')[0];
    const filterPrefix = projectKey + '_';

    // 2. Filter images that start with this prefix
    const allProjectImages = Object.keys(imageMap).filter(key => key.startsWith(filterPrefix));

    console.log("Project Key:", projectKey);
    console.log("All Project Images:", allProjectImages);

    // 3. Handle Grouping and Sorting
    if (allProjectImages.length >= 1) {
        // Multi-image project: Return sorted list
        return allProjectImages.sort((a, b) => 
            a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        );
    } else if (imageMap[imageName]) {
        // No suffix: Return just the current image
        return [imageName];
    } else {
        // No matching images found
        return [];
    }
};

// --- Link Generation Component ---
// This handles the display logic for the clickable image links.
const generateProjectImageLinks = (
    projectPrefix: string, 
    imageMap: Record<string, ImageDetails>, 
    openImageViewer: OpenImageViewerType,
    fileExtension: string = "" 
) => {
    
    // Use the core logic to get the sorted list of keys for the project prefix
    const projectImageKeys = getProjectImageKeys(projectPrefix, imageMap);

    if (projectImageKeys.length === 0) {
        return <span>(No images found for this project.)</span>;
    }

    // Map the keys to JSX elements
    const links = projectImageKeys.map((key, index) => {
      const imageDetails = imageMap[key];
        
      // Determine the Display Label:
      let displayLabel = imageDetails.displayName;

      if (!displayLabel) {
          // Fallback: Use the suffix of the key
          const parts = key.split('_');
          const suffix = parts.length > 1 ? parts.slice(1).join('_') : key;
          
          // 1. Remove leading numbers and any subsequent underscore/separator
          let cleanedLabel = suffix.replace(/^[0-9]+[_-]?/, '').trim();
          
          // 2. Retain all underscores
          displayLabel = cleanedLabel.replace(/ /g, '_'); 
          
          // 3. FIX: If displayLabel is now empty (e.g., if suffix was "10"), use the full key.
          if (!displayLabel) {
              displayLabel = key; 
          }

          // Add the file extension if provided
          if (fileExtension && !displayLabel.endsWith(fileExtension)) {
              displayLabel += fileExtension;
          }
      }
      
      if (!displayLabel) return null;

      const linkElement = (
          <span
              key={key}
              onClick={() => openImageViewer(key)} 
              style={{ color: "lightblue", cursor: "pointer"}}
          >
              {displayLabel}
          </span>
      );
      
      const separator = index === projectImageKeys.length - 1 ? "." : ", ";

      return (
          <React.Fragment key={`link-${key}`}>
              {linkElement}
              {separator}
          </React.Fragment>
      );
    });

    return links;
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
  const imageViewerRef = useRef<HTMLDivElement>(null);
  const imageMap: Record<string, ImageDetails> = useMemo(() => ({
    // Name the Image Key as Project_ViewerNumber_DisplayName
    // Display name can also be overwritten using the displayName field to bypass string processing
    "cps_1_input": { url: cps1Image, caption: "Cyber-Physical Systems - Wave Generator input" },
    "cps_2_output": { url: cps2Image, caption: "Cyber-Physical Systems - Wave Generator output" },
    "cps_3_mechanism": { url: cps3Image, caption: "Cyber-Physical Systems - Wave Generator mechanism" },
    // "errunds": { url: errundsImage, caption: "SoloX - Errunds mobile app design" },    
    // "impact_app": { url: impactImage, caption: "Impact - Mobile app design" },
    // "impact_trip": { url: impactImage, caption: "Impact - Field trip to trucker rest stop for observations and interviews" },
    // "sussys": { url: sussysImage, caption: "Sustainable Systems - Circular supply chain diagram" },
    // "ide_fundamentals": { url: ideFundamentalsImage, caption: "IDE Fundamentals - Smart Craft, a DIY electronics kit" },
    "fyp_1_main": { url: fypCoverImage, caption: "MEng FYP - Computer vision for zero-waste food containers" },
    "fyp_2_device": { url: fypDeviceImage, displayName: "device.jpeg", caption: "MEng FYP - Physical device" },
    "fyp_3_system": { url: fypSystemDiagramImage, caption: "MEng FYP - Software system diagram" },
    "fyp_4_benchmark": { url: fypBenchmarkImage, caption: "MEng FYP - Computer vision models benchmarking" },
    "fyp_5_tracking": { url: fypTrackingImage, caption: "MEng FYP - Custom motion-based tracking algorithm" },
    "wheele_1_wheelchair": { url: wheeleChairImage, caption: "WHEEL-E - The wheelchair and its simulated model"},
    "wheele_2_simulation": { url: wheeleSimImage, caption: "WHEEL-E - Simulation of the wheelchair with its motors and sensors" },
    "notisound_1_app": { url: notisoundAppImage, caption: "NotiSound - Mobile app design" },
    "notisound_2_phone": { url: notisoundNotifImage, displayName: "phone.jpeg", caption: "NotiSound - Example notification" },
    "notisound_3_tech": { url: notisoundTechImage, displayName: "tech.jpeg", caption: "NotiSound - Technology" },
    "synth_dependency_graph": { url: synthDependencyGraphImage, caption: "Music Synthesizer OS - Tasks dependency graph" },
    "rover": { url: roverImage, caption: "Mars Rover - The Rover and its control interface" },   
  }), []);

  const [imageViewer, setImageViewer] = useState<ImageDetails | null>(null);
  const [currentImageName, setCurrentImageName] = useState<string | null>(null);

  const openImageViewer = (imageName: string) => {
      setCurrentImageName(imageName);
      setImageViewer(imageMap[imageName as keyof typeof imageMap]);
  };

  // --- Navigation Logic ---

  const nextImage = useCallback(() => {
      if (!currentImageName) return;

      // Use the external helper directly
      const projectImageNames = getProjectImageKeys(currentImageName, imageMap);
      
      if (projectImageNames.length <= 1) return; 

      const currentIndex = projectImageNames.indexOf(currentImageName);
      const nextIndex = (currentIndex + 1) % projectImageNames.length;
      const nextImageName = projectImageNames[nextIndex];
      
      setCurrentImageName(nextImageName);
      setImageViewer(imageMap[nextImageName as keyof typeof imageMap]);
  }, [currentImageName, imageMap]);

  const prevImage = useCallback(() => {
      if (!currentImageName) return;

      // Use the external helper directly
      const projectImageNames = getProjectImageKeys(currentImageName, imageMap);
      
      if (projectImageNames.length <= 1) return;

      const currentIndex = projectImageNames.indexOf(currentImageName);
      const prevIndex = (currentIndex - 1 + projectImageNames.length) % projectImageNames.length;
      const prevImageName = projectImageNames[prevIndex];
      
      setCurrentImageName(prevImageName);
      setImageViewer(imageMap[prevImageName as keyof typeof imageMap]);
  }, [currentImageName, imageMap]);
  
  // --- Effect Hook ---

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
          if (imageViewer) {
              if (event.key === "ArrowLeft") {
                  prevImage();
              } else if (event.key === "ArrowRight") {
                  nextImage();
              }
          }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
          window.removeEventListener("keydown", handleKeyDown);
      };
  }, [imageViewer, nextImage, prevImage]);

  // ---------------------------------------

  const scrollLastCommandTop = () => {
    scrollRef.current?.scrollIntoView();
  };

  useEffect(scrollLastCommandTop, [output]);

  const echoCommands = [
    "help",
    "h",
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
    "pew",
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

  //  -----  CONTENT OF SECTIONS  -----

  const helpContent = (
    <div>
      <p>
        Just type any of the commands below to display the relevant information.
        You can even type a few letters and press [Tab] or '.' to 
        autocomplete.
      </p>
      <dl>
        <dt>about</dt>
        <dd>Some general information about me</dd>
        <dt>experience</dt>
        <dd>My work experience to date</dd>
        <dt>education</dt>
        <dd>What and where I've been studying</dd>
        <dt>projects</dt>
        <dd>A curated selection of some of my projects</dd>
        <dt>skills</dt>
        <dd>Some of the things that I'm pretty good at</dd>
        <dt>links</dt>
        <dd>LinkedIn, GitHub, Email</dd>
        <dt>cv</dt>
        <dd>Check out my CV [pdf - 154KB]</dd>
        <dt>all</dt>
        <dd>Displays everything at once (good if you're in a hurry)</dd>
        <dt>clear</dt>
        <dd>Clears the terminal</dd>
        <dt>pew</dt>
        <dd>A not so secret easter egg</dd>
      </dl>
    </div>
  );

  const aboutContent = (
    <div>
      <p>
        Hiya! As you probably know, my name is {glow("Tanguy Perron")}.
        I'm a {getAge(new Date(2001, 10, 15))} year old{" "}
        {glow("Computer Engineer and Human-Centred Designer")},{" "}
        and have just graduated from{" "}
        {glow("Innovation Design Engineering (MSc/MA)")}{" "}
        at {glow("Imperial College London")} and the {glow("Royal College of Art")}.
      </p>
      <p>
        I am French and did my French Scientific Baccalauréat
        {" "}near Paris. I achieved the {glow("Highest Honours")} with a grade
        of 19.55/20 (~97.75%). I then moved to London (UK) to pursue 
        my further studies...
      </p>
      <p>
        I have since studied at {glow("Imperial College London")} and 
        the {glow("Royal College of Art")} and
        could not have made a better choice!
      </p>
      <p>
        I started by doing an {glow("MEng in Electronic and Information Engineering")} at{" "}
        {glow("Imperial College London")}, where I have learned
        about computer electronics, programming, as well as higher level subjects
        such as machine learning and computer vision.

        I then decided to do an {glow("MA/MSc in Innovation Design Engineering")} at  
        both {glow("Imperial College London")} and the {glow("Royal College of Art")},
        where I have been learning about design processes, user-centred and behavioural
        design, service design, systems design, UI/UX design and the
        sustainability of it all.{" "}

        <em>
            {"  "}To learn more about my studies, you can type 'education', and to
            learn about the projects I've done so far, you can type 'projects'.
        </em>
      </p>
      <p>
        Alongside my studies, I have had some work experience as a{" "}
        {glow("Full Stack and Cloud Developer")} as well as a {glow("Data Scientist")}.{" "}
        <em>
          {"  "}To learn more about my work experiences, you can type 'experience'.
        </em>
      </p>
      <p>
        Some of my current interests include: emerging technologies,
        machine learning, mobile development, photography and sailing.
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
  );

  const experienceContent = (
    <>
      <dl>
      <dt>Jul-Aug 2024 • UI/UX Designer & Frontend Developer • Villa Schmidt (Remote)</dt>
        <dd>I worked as a UX/UI designer and front-end developer for a high-end furniture retailer based in Germany for 2 months.</dd>
        <dd>I redesigned several key elements of their website, such as the landing page, product cards,
            product listings, search filters, product details page, product configurator, contact information
            section, header, footer and cookie banner (GDPR compliant).</dd>
        <dd>I then implemented said front-end elements in the Nuxt3 framework using TypeScript in a fully reactive way
            to work seamlessly across all key devices used by their clients.</dd>

        <br/>
        <dt>Apr-Sep 2022 • Data Scientist Intern • Institut de Recherches Servier (FR)</dt>
        <dd>I carried out work as part of the JUMP-Cell Painting Consortium of the Broad Institute of Harvard and MIT.{" "}
            This Consortium is creating a new data-driven approach to drug discovery based on cellular imaging, image analysis, and high dimensional data analytics.{" "}
            More notably, it aims at making cell images as computable as genomes and transcriptomes.</dd>
        <dd>I developed a CLI program in Python to perform Quality Control tasks on the collected cell-painting images.{" "}
            This program was later made open-source and I am still the main active contributor.</dd>
        <dd>I also developed a GUI tool in Python to allow the team to explore new aspects of their high dimensional data.{" "}
            In particular, this tool relied on dimensionality reduction algorithms (UMAP, t-SNE) to extract meaningful information from an SQLite database.</dd>

        <br/>
        <dt>Jul-Sep 2021 • Full-stack and Cloud Developer • UniVerse (Remote)</dt>
        <dd>I served as a Full Stack and Cloud Developer to build a social application for Android, iOS and Web.</dd>
        <dd>I worked on both front and back-end components of the app, as well as on the design of the{" "}
            databases and DevOps.</dd>
        <dd>This work was carried out in Dart using the Flutter framework, with the integration of Google Firebase services.</dd>
        <dd>I also researched and produced reports on technologies that the company wished to adopt.</dd>
        <dd>I worked alongside the company's CTO as well as independently, relying on both my
            communication and team-working skills, as well as my autonomy.</dd>

        <br/>
        <dt>Aug-Sep 2020 • Multi-skilled Crew Member • McDonald's (FR)</dt>
        <dd>I worked for over a month during the summer at McDonald's as a Multi-skilled Crew Member.</dd>
        <dd>
          I was responsible for several tasks:
          <ul>
            <li>some requiring a high level of autonomy, discipline and organization 
                (e.g. taking orders, cleaning and maintenance)</li>
            <li>others challenging my team working skills and communication to achieve high-efficiency standards 
                (e.g. preparing products, assembling orders and helping customers)</li>
          </ul>
        </dd>
        <dd>Overall, I discovered what it is like to be a part of a collaborating team in such a huge company.</dd>
      </dl>
    </>
  );

  const educationContent = (
    <>
      <dl>
        <dt>2023-2025 • Innovation Design Engineering (MSc/MA) • Imperial College London & Royal College of Art (UK)</dt>
        <dd>Graduated {glow("MSc with Merits")}.</dd>
        <dd>
          The main modules that I have studied include:
          <ul>
            <li>Design Principles</li>
            <li>Human-Centred and Behavioural Design</li>
            <li>Cyber-Physical Systems</li>
            <li>Transdisciplinary Practices</li>
            <li>Sustainable Systems</li>
            <li>Regenerative Materials Structures and Aesthetics</li>
          </ul>
        </dd>
        <dd>
          Optional modules undertook:
          <ul>
            <li>User Interfaces and Interactions</li>
          </ul>
        </dd>

        <br/>
        <dt>2019-2023 • Electronic and Information Engineering (MEng) • Imperial College London (UK)</dt>
        <dd>Achieved {glow("First-class Honours")}.</dd>
        <dd>
          The main modules that I have studied include:
          <ul>
            <li>Artificial Intelligence</li>
            <li>Machine Learning & Deep Learning</li>
            <li>Computer Vision</li>
            <li>Principles of Distributed Ledgers</li>
            <li>Privacy Engineering</li>
            <li>High-Level Programming</li>
            <li>Optimization</li>
            <li>Human-Centred Robotics</li>
            <li>Embedded Systems</li>
            <li>Software Systems</li>
          </ul>
        </dd>
        <dd>
          Optional modules undertook:
          <ul>
            <li>Collective Intelligence</li>
            <li>Designing Interventions for Behavioural Change</li>
            <li>Creative Digital Platforms</li>
            <li>Introduction to Psychology</li>
          </ul>
        </dd>

        <br/>
        <dt>2016-2019 • French Scientific Baccalauréat • Lycée Blaise Pascal (FR)</dt>
        <dd>Achieved a score of 19.55/20 overall (~97.75%) including:
          <ul>
            <li>18/20 (90%) in Mathematics</li>
            <li>19/20 (95%) in Physics and Chemistry</li>
          </ul>
        </dd>
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
  );

  const projectsContent = (
    <>
      <dl>
      <dt>
          Wave Generator • MSc/MA Cyber-Physical Systems Project -{" "}
          <a
            href="https://github.com/tlp19/CyberPhysicalSystems"
            target="_blank"
            rel="noopener noreferrer">
            GitHub repository
          </a>
        </dt>
        <dd>
          Images:{" "}
          {generateProjectImageLinks("cps", imageMap, openImageViewer, ".png")}
        </dd>
        <dd>
          The project was designed to be used in a live performance setting, where the user drops an object into a recording box, and the wave generator responds differently based on the material of the object (e.g. wood, metal or plastic).
        </dd>
        <dd>
          It was developed using Arduino for motor control, Processing for sound input and communications, and Wekinator for Machine Learning classification tasks.
        </dd>
        <dd>
          OSC messages are used for communication between Processing and Wekinator, and UART serial communication between Processing and Arduino.
        </dd>
        <dd>
          The main steps of the mechanism and software are as follows:
          <ul>
            <li>The object's collision sound is recorded using a microphone, and the audio is processed in real-time using Processing.</li>
            <li>The sound's main constituent frequencies are extracted by performing a FFT (Fast Fourier Transform), and are then sent to Wekinator where a machine learning model classifies the sound into one of three classes (wood, metal or plastic).</li>
            <li>The class is then sent back to Processing, which relays it to the Arduino.</li>
            <li>The Arduino then actuates 4 servo-motors in unique patterns based on the class returned.</li>
            <li>Each servo controls 4 cams that lift wooden sticks in a third-class lever configuration to produce the desired wave effect.</li>
          </ul>
        </dd>

        <br/>
        <dt>
          Computer vision for zero-waste food containers • MEng Final Year Project -{" "}
          <a
            href="https://github.com/tlp19/final-year-project"
            target="_blank"
            rel="noopener noreferrer">
            GitHub repository
          </a>
        </dt>
        <dd>
          Images:{" "}
          {generateProjectImageLinks("fyp", imageMap, openImageViewer, ".png")}
        </dd>
        <dd>
          This project dealt with the implementation of a smart return kiosk for reusable cups.
          Multiple systems were implemented and integrated on a Raspberry Pi to ensure an efficient product robust to adversaries.
        </dd>
        <dd>
          A comparison of different QR code scanning libraries was carried out to find the best suited for our application. 
        </dd>
        <dd>
          A custom dataset of 400 cup images was constructed and manually labelled (1000 images after data augmentation).
          This was followed by a benchmark of 3 families of object detection architectures trained on this custom data: YOLOv8, EfficientDet and MobileNetV2.
        </dd>
        <dd>
          I designed and implemented a custom object tracking algorithm based on motion tracking.
        </dd>
        <dd>
          Some of the main tasks performed by the final system are:
          <ul>
            <li>Motion & Colour detection, using webcams</li>
            <li>QR code decoding, using webcams</li>
            <li>Weight measuring, using load cells</li>
            <li>Object detection, using webcams</li>
            <li>Object tracking, using webcams</li>
            <li>Collection trapdoor actuation, using a continuous servo motor</li>
            <li>User Interface, using an LED ring</li>
          </ul>
        </dd>
        <dd>
          Overall, this project allowed me to put to the test all the skills and knowledge that I had been acquiring throughout my Electronic and Information Engineering degree, ranging from hardware communication protocols to state-of-the-art machine learning models for object detection, all while challenging my understanding of embedded systems and their limitations.
        </dd>

        <br/>
        <dt>
          WHEEL-E • Year 4 Human-Centred Robotics Project -{" "}
          <a
            href="https://github.com/HCR-Smart-Wheelchair-2023/Smart-Wheelchair-Main"
            target="_blank"
            rel="noopener noreferrer">
            GitHub repository
          </a>
        </dt>
        <dd>
          Images:{" "}
          {generateProjectImageLinks("wheele", imageMap, openImageViewer, ".png")}
        </dd>
        <dd>
          WHEEL-E is a smart autonomous wheelchair that aims to improve the independence and social life of people with disabilities.
        </dd>
        <dd>
          The wheelchair can be controlled by voice commands or via an accessible user interface to navigate to specific locations autonomously.
          It can analyse where the surrounding people are going and avoid collisions preemptively.
          The wheelchair also has a laser path-indicator to inform the bystanders of where the wheelchair is going.
        </dd>
        <dd>This project was carried out in groups of 14, and the software of the wheelchair was programmed using ROS (Robot Operating System), which we had to learn on the job.</dd>
        <dd>I was responsible for implementing a simulation environment using the Gazebo software, so that any development made on the software of the wheelchair could be tested before being deployed to the real wheelchair.
          This therefore made the development of new features much faster and safer.</dd>
        <dd>Overall, high team-working skills and excellent communication were required to successfully coordinate with
          my 13 coworkers.</dd>

        <br/>
        <dt>
          NotiSound (IoT Device) • Year 3 Embedded Systems CW -{" "}
          <a
            href="https://github.com/tlp19/NotiSound-returnSuccess4"
            target="_blank"
            rel="noopener noreferrer">
            GitHub repository
          </a>
        </dt>
        <dd>
          Images:{" "}
          {generateProjectImageLinks("notisound", imageMap, openImageViewer, ".png")}
        </dd>
        <dd>
          NotiSound is an IoT device that, when paired with its App, alerts people with hearing disabilities of
          sound events in their homes. This could be their doorbell ringing, or a fire alarm going off.
        </dd>
        <dd>
          NotiSound can also be used in large houses or apartments where the doorbell may not be loud enough
          to be heard from everywhere.
        </dd>
        <dd>
          This project was carried out in groups of 4. My 3 coworkers worked on the Hardware of the project while I,
          due to my experience, worked on the App.</dd>
        <dd>The App was written in Dart using the Flutter framework and currently fully supports Android.</dd>
        <dd>
          It integrates the Google Firebase services, and more specifically Cloud Messaging, to allow messages
          to be sent from the Hardware to the User's phone. Phone notifications are then dispatched to alert the
          User.
        </dd>
        <dd>
          The App's graphical interface contains a Homepage with the history of all alerts received, an Analytics page,
          as well as a Settings page to register new Hardware devices.
        </dd>
        <dd>
          The Hardware devices are made of a Raspberry Pi Zero (WiFi enabled) and a microphone.
          A custom CNN model is run locally to classify the sounds picked up by the microphone,
          and then send the according messages to the App.
        </dd>
        <dd>
          Working alongside my teammates, I had to design the App to meet strict communication requirements
          to ensure a fully functioning interface with the Hardware.
        </dd>
        <dd>
          You can watch our user demo video{" "}
          <a
            href="https://youtu.be/4ptqJhXfUXw"
            target="_blank"
            rel="noopener noreferrer">
            here
          </a>
          , or watch a technical demo of our project{" "}
          <a
            href="https://www.youtube.com/watch?v=70v0xNBIKIo"
            target="_blank"
            rel="noopener noreferrer">
            here
          </a>
          .
        </dd>

        <br/>
        <dt>
          Music Synthesizer OS • Year 3 Embedded Systems CW -{" "}
          <a
            href="https://github.com/tlp19/ES-synth-returnSuccess4"
            target="_blank"
            rel="noopener noreferrer">
            GitHub repository
          </a>
        </dt>
        <dd>
          Images:{" "}
          {generateProjectImageLinks("synth", imageMap, openImageViewer, ".png")}
        </dd>
        <dd>For this project, we worked in a group of 4 to create the Real-Time Operating System of a Music Synthesizer.</dd>
        <dd>The OS was written in C and C++ and uses Threads and Interrupts to execute all the important concurrent tasks.</dd>
        <dd>
          To ensure safe access and synchronization of data, it relies on shared resources such as Mutexes,
          Atomic operations and Queues.
        </dd>
        <dd>
          A Real-Time Critical Analysis report was produced to prove that all tasks could (and would) meet their deadlines.
          A Dependency Graph was also drawn to ensure that there were no deadlocks (infinite loops) in our implementation.
          Both of those documents can be found in our Analysis Report{" "}
          <a
            href="https://github.com/tlp19/ES-synth-returnSuccess4#readme"
            target="_blank"
            rel="noopener noreferrer">
            here
          </a>
          .
        </dd>
        <dd>
          Some of the more complex features that we implemented are:
          <ul>
            <li>2 types of output waveforms (Sawtooth and Sinusoidal)</li>
            <li>Support for multiple octaves</li>
            <li>Scalable hardware (stackable keyboards connected via a CAN Bus)</li>
            <li>Polyphony (multiple notes playing at the same time)</li>
          </ul>
        </dd>
        <dd>
          Overall, this project taught me a lot about Operating Systems and the strict requirements they have to meet.
          It was a real challenge to write efficient, but safe, code with timing and memory constraints always in mind.
        </dd>

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
        <dd>
          Images:{" "}
          {generateProjectImageLinks("rover", imageMap, openImageViewer, ".png")}
        </dd>
        <dd>For this project, we worked in a group of 6 to build and program a remote-controlled semi-autonomous Rover.</dd>
        <dd>I programmed an ESP32 SoC in Arduino C++ to be the hub of communications with 3 other sub-systems.</dd>
        <dd>I used the MQTT protocol (and implemented a Broker) to communicate with a Web-App over WiFi to control the rover.</dd>
        <dd>My sub-system also handled communications to both an FPGA (computer vision) and an
            Arduino Nano board (motors controller) using the UART Protocol.</dd>
        <dd>I designed custom instruction sets to decode and interpret all commands from all sub-systems.</dd>
        <dd>I also implemented a custom obstacle-avoidance system triggered by external sensors.</dd>
        <dd>Overall, team-working skills and good communication were required to successfully coordinate with
            my 5 coworkers.</dd>
        <dd>
          You can view a video demonstration of our Rover{" "}
          <a
            href="https://www.youtube.com/watch?v=-rey-J0QVjc"
            target="_blank"
            rel="noopener noreferrer">
            here
          </a>
          .
        </dd>
      </dl>
    </>
  );

  const skillsContent = (
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
            #############
          </span>
          {" "}
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
        <dt>Spanish</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
            #######
          </span>
          {"       "}
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
      </dl>

      <div className="terminal-heading">Programming Languages</div>
      <dl>
        <dt>Python</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
            ############
          </span>
          {"  "}
          ##
        </dd>
        <dt>Dart</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#00DE12", textShadow: "0 0 5px #00DE12" }}>
            ###########
          </span>
          {"   "}
          ##
        </dd>
        <dt>C and C++</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#00DE12", textShadow: "0 0 5px #99D100" }}>
            ##########
          </span>
          {"    "}
          ##
        </dd>
        <dt>F#</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
            #######
          </span>
          {"       "}
          ##
        </dd>
        <dt>Lua</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
            ######
          </span>
          {"        "}
          ##
        </dd>
        <dt>Julia</dt>
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
        <dt>Web development</dt>
        <dd>
          ##{" "}
          <span style={{ color: "#99D100", textShadow: "0 0 5px #99D100" }}>
            ########
          </span>
          {"      "}
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
            ########
          </span>
          {"      "}
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

    </>
  );

  const linksContent = (
    <>
      <dl>
        <dt>LinkedIn</dt>
        <dd>
          <a
            href="https://www.linkedin.com/in/tanguy-perron/"
            target="_blank"
            rel="noopener noreferrer">
            linkedin.com/in/tanguy-perron
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

        <dt>Email</dt>
        <dd>
          <a href="mailto:tanguy.p@pm.me">
            tanguy.p@pm.me
          </a>
        </dd>
      </dl>
    </>
  );

  const commands: { [key in EchoCommand]: JSX.Element } = {
    help: helpContent,
    h: helpContent,
    about: aboutContent,
    experience: experienceContent,
    education: educationContent,
    projects: projectsContent,
    skills: skillsContent,
    links: linksContent,
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

          setOutput([...output, commandRecord, <br />, ...allCommandsOutput]);
          break;
        }
        case "cv": {
          setOutput([...output, commandRecord]);
          downloadFile("CV.pdf", "Tanguy Perron - Curriculum Vitae.pdf");
          break;
        }
        case "pew": {
          // play an ascii firework animation, one frame at a time
          // the frames are in the fireworks array
          const previousOutput = output;
          let frame = 0;
          const interval = setInterval(() => {
            if (frame < fireworks.length) {
              setOutput([fireworks[frame]]);
              frame++;
            } else {
              clearInterval(interval);
              setOutput([...previousOutput, commandRecord]);
            }
          }, 90);
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
        {imageViewer && (
          <div className="image-viewer-popup" ref={imageViewerRef}>
            <button className="image-viewer-close" onClick={() => setImageViewer(null)}>
              X Close
            </button>
            <button className="image-viewer-arrow image-viewer-arrow-prev" onClick={prevImage}>
              {"<"}
            </button>
            <img src={imageViewer.url} alt="Full Size" className="image-viewer-image" />
            <button className="image-viewer-arrow image-viewer-arrow-next" onClick={nextImage}>
              {">"}
            </button>
            <div className="image-viewer-caption">{imageViewer.caption}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;