const btn = document.querySelector(".input");
const content = document.querySelector(".content");
const API_KEY = "AIzaSyCkDhTy8rgATJrh7dfDIc0UXDhaUyc7sCY"; // Replace with your YouTube API key

function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);

  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;

  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  const day = new Date();
  const hour = day.getHours();

  if (hour >= 0 && hour < 12) {
    speak("Good Morning Janaab...");
  } else if (hour >= 12 && hour < 17) {
    speak("Good Afternoon Janaab...");
  } else {
    speak("Good Evening Janaab...");
  }
}

function initializeKhilji() {
  if (!localStorage.getItem("khiljiInitialized")) {
    speak("Initializing KHILJI...");
    wishMe();
    localStorage.setItem("khiljiInitialized", "true");
  }
}

window.addEventListener("load", () => {
  initializeKhilji();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const currentIndex = event.resultIndex;
  const transcript = event.results[currentIndex][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  content.textContent = "Listening...";
  recognition.start();
});

function takeCommand(message) {
  if (message.includes("hey") || message.includes("hello")) {
    speak("Hello Sir, How May I Help You?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening YouTube...");
  } else if (message.includes("search youtube for")) {
    const query = message.replace("search youtube for", "").trim();
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank"
    );
    speak(`Searching YouTube for ${query}`);
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook...");
  } else if (message.includes("search for")) {
    const query = message.replace("search for", "").trim();
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
    speak(`Searching Google for ${query}`);
  } else if (message.includes("play")) {
    const query = message.replace("play", "").trim();
    playYouTubeVideo(query);
  } else if (
    message.includes("what is") ||
    message.includes("who is") ||
    message.includes("what are")
  ) {
    window.open(
      `https://www.google.com/search?q=${message.replace(" ", "+")}`,
      "_blank"
    );
    const finalText =
      "This is what I found on the internet regarding " + message;
    speak(finalText);
  } else if (message.includes("wikipedia")) {
    window.open(
      `https://en.wikipedia.org/wiki/${message
        .replace("wikipedia", "")
        .trim()}`,
      "_blank"
    );
    const finalText = "This is what I found on Wikipedia regarding " + message;
    speak(finalText);
  } else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    const finalText = "The current time is " + time;
    speak(finalText);
  } else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    const finalText = "Today's date is " + date;
    speak(finalText);
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    const finalText = "Opening Calculator";
    speak(finalText);
  } else if (message.includes("weather")) {
    const location = message.replace("weather", "").trim();
    window.open(
      `https://www.google.com/search?q=weather+${location}`,
      "_blank"
    );
    speak(`Checking the weather for ${location}`);
  } else if (message.includes("on youtube")) {
    const query = message.replace("on youtube", "").trim();
    playYouTubeVideo(query);
  } else if (message.includes("on google")) {
    const query = message.replace("on google", "").trim();
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
    speak(`Searching Google for ${query}`);
  }
  
  else if (message.includes("open word")) {
    speak("Opening Microsoft Word...");
    openApplication("word");
  } else if (message.includes("open excel")) {
    speak("Opening Microsoft Excel...");
    openApplication("excel");
  } else if (message.includes("open powerpoint")) {
    speak("Opening Microsoft PowerPoint...");
    openApplication("powerpoint");
  } else if (message.includes("open notepad")) {
    speak("Opening Notepad...");
    openApplication("notepad");
  } else if (message.includes("open calculator")) {
    speak("Opening Calculator...");
    openApplication("calculator");
  } else if (message.includes("open browser")) {
    speak("Opening default web browser...");
    openApplication("browser");
  } else {
    speak("Which platform do you want to search on, Google or YouTube?");
    recognition.onresult = (event) => {
      const platform = event.results[0][0].transcript.toLowerCase();
      if (platform.includes("google")) {
        window.open(
          `https://www.google.com/search?q=${message.replace(" ", "+")}`,
          "_blank"
        );
        speak(`Searching Google for ${message}`);
      } else if (platform.includes("youtube")) {
        playYouTubeVideo(message);
      } else {
        speak(
          "Sorry, I didn't catch that. Please specify either Google or YouTube."
        );
      }
    };
    recognition.start();
  }
}

async function playYouTubeVideo(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&type=video&maxResults=1`;
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    const videoId = data.items[0].id.videoId;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    // Open the video in a new window
    const videoWindow = window.open("", "_blank");
    videoWindow.document.write(
      `<html>
         <body style="margin:0">
           <iframe id="videoFrame" width="100%" height="100%" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
           <script>
             const iframe = document.getElementById('videoFrame');
             iframe.onload = function() {
               const requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen || iframe.msRequestFullScreen;
               if (requestFullScreen) {
                 requestFullScreen.call(iframe);
               }
             };
           </script>
         </body>
       </html>`
    );

    speak(`Playing ${query} on YouTube`);
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    speak("Sorry, I could not fetch the video.");
  }
}
