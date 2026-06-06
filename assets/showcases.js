// Multi-showcase library. Each showcase has its own clips & phrase metadata.
window.SHOWCASES = {
  "friend-like-me": {
    id: "friend-like-me",
    title: "Friend Like Me",
    subtitle: "Showcase · Swing",
    bpm: 99.4,
    countsPerBar: 8,          // 8-count phrasing
    duration: 134.36,
    full: "clips/friend-like-me/00_Full-Showcase.mp4",
    phrases: [
      { i:1,  file:"clips/friend-like-me/01_Intro-Setup.mp4",            name:"Intro / Set-up",   counts:11, start:0.00,   end:6.73,   focus:"Opening pose, entrance, find partner connection before the groove drops." },
      { i:2,  file:"clips/friend-like-me/02_Phrase1-First-Groove.mp4",   name:"First Groove",     counts:16, start:6.73,   end:16.49,  focus:"Initial basic swing action & travel pattern." },
      { i:3,  file:"clips/friend-like-me/03_Phrase2-Develop-Basic.mp4",  name:"Develop Basic",    counts:16, start:16.49,  end:26.36,  focus:"Add styling and partner shape changes." },
      { i:4,  file:"clips/friend-like-me/04_Phrase3-Travel.mp4",         name:"Travel",           counts:16, start:26.36,  end:36.20,  focus:"Cover floor with the swing rhythm." },
      { i:5,  file:"clips/friend-like-me/05_Phrase4-Build-To-Hit.mp4",   name:"Build to Hit",     counts:18, start:36.20,  end:47.00,  focus:"Prepare body & frame for the first musical accent." },
      { i:6,  file:"clips/friend-like-me/06_Phrase5-Hit-And-Release.mp4",name:"Hit & Release",    counts:17, start:47.00,  end:57.12,  focus:"Sharp shape on the accent, then drop back into groove." },
      { i:7,  file:"clips/friend-like-me/07_Phrase6-Second-Groove.mp4",  name:"Second Groove",    counts:16, start:57.12,  end:66.66,  focus:"Variation on the basic." },
      { i:8,  file:"clips/friend-like-me/08_Phrase7-Signature-Move.mp4", name:"Signature Move",   counts:16, start:66.66,  end:76.56,  focus:"Showcase trick / featured choreography." },
      { i:9,  file:"clips/friend-like-me/09_Phrase8-Energy-Climb.mp4",   name:"Energy Climb",     counts:20, start:76.56,  end:88.47,  focus:"Build sequence — biggest stamina demand." },
      { i:10, file:"clips/friend-like-me/10_Phrase9-BigBand-Break.mp4",  name:"Big-Band Break",   counts:17, start:88.47,  end:98.69,  focus:"Playful character & musicality moments." },
      { i:11, file:"clips/friend-like-me/11_Phrase10-Drive-To-Finale.mp4",name:"Drive to Finale", counts:17, start:98.69,  end:108.76, focus:"Accelerating shapes, drive forward." },
      { i:12, file:"clips/friend-like-me/12_Phrase11-Crescendo.mp4",     name:"Crescendo",        counts:16, start:108.76, end:118.68, focus:"Biggest tricks land here." },
      { i:13, file:"clips/friend-like-me/13_Phrase12-Finale-Hits.mp4",   name:"Finale Hits",      counts:16, start:118.68, end:128.59, focus:"Sharp accents, dramatic shapes." },
      { i:14, file:"clips/friend-like-me/14_Ending-Pose.mp4",            name:"Ending Pose",      counts:10, start:128.59, end:134.36, focus:"Settle into the closing pose and hold." },
    ],
  },

  "whole-new-world": {
    id: "whole-new-world",
    title: "A Whole New World",
    subtitle: "Showcase · Waltz (3/4)",
    bpm: 107.7,
    countsPerBar: 6,          // Waltz dance counts in 6 (two measures)
    duration: 148.65,
    full: "clips/whole-new-world/00_Full-Showcase.mp4",
    phrases: [
      { i:1,  file:"clips/whole-new-world/01_Intro-Setup.mp4",     name:"Intro / Set-up",        counts:18, start:0.00,   end:10.56,  focus:"Opening pose & frame — find partner connection before the melody enters." },
      { i:2,  file:"clips/whole-new-world/02_First-Theme.mp4",     name:"First Theme",           counts:18, start:10.56,  end:22.22,  focus:"Establish Waltz timing — gentle box, rise and fall." },
      { i:3,  file:"clips/whole-new-world/03_Travel.mp4",          name:"Travel",                counts:18, start:22.22,  end:33.90,  focus:"Travel down the long wall — natural turn or progressive step." },
      { i:4,  file:"clips/whole-new-world/04_Develop.mp4",         name:"Develop",               counts:24, start:33.90,  end:45.95,  focus:"Add styling and shape — outside partner positions." },
      { i:5,  file:"clips/whole-new-world/05_Build-To-Chorus.mp4", name:"Build to Chorus",       counts:18, start:45.95,  end:55.56,  focus:"Build energy — preparing for the lyrical lift." },
      { i:6,  file:"clips/whole-new-world/06_Chorus.mp4",          name:"Chorus — Whole New World", counts:30, start:55.56, end:71.17, focus:"Chorus moment — big sweeping shapes, signature presentation." },
      { i:7,  file:"clips/whole-new-world/07_Bridge.mp4",          name:"Bridge",                counts:24, start:71.17,  end:85.03,  focus:"Bridge section — quieter dynamic, intimate partner work." },
      { i:8,  file:"clips/whole-new-world/08_Second-Theme.mp4",    name:"Second Theme",          counts:18, start:85.03,  end:96.78,  focus:"Return of theme — variation on the basic." },
      { i:9,  file:"clips/whole-new-world/09_Build-To-Climax.mp4", name:"Build to Climax",       counts:24, start:96.78,  end:110.11, focus:"Energy climb — biggest tricks prepare here." },
      { i:10, file:"clips/whole-new-world/10_Climax.mp4",          name:"Climax",                counts:24, start:110.11, end:122.18, focus:"Showcase climax — featured choreography, lifts or oversways." },
      { i:11, file:"clips/whole-new-world/11_Resolve.mp4",         name:"Resolve",               counts:24, start:122.18, end:135.23, focus:"Resolve down — bring the music home." },
      { i:12, file:"clips/whole-new-world/12_Ending-Pose.mp4",     name:"Ending Pose",           counts:24, start:135.23, end:147.45, focus:"Final phrase — settle into a held closing shape." },
    ],
  },
};

window.DEFAULT_SHOWCASE = "friend-like-me";
