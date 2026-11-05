const scenarios = [
  {
    id:1, title:"The urgent IT support call", type:"PHONE CALL", role:"Caller claiming to be IT support", headline:"A caller wants your one-time password",
    description:"You receive an unexpected call from someone who says they are from the college IT help desk. They claim your account will be locked unless you verify it immediately.",
    quote:"“I am fixing a security issue right now. Read the six-digit code that just arrived on your phone so I can protect your account.”",
    clues:["Unexpected contact claiming authority","Creates fear and urgency","Requests a one-time password (OTP)","Caller identity has not been independently verified"],
    answers:[
      ["Share the OTP because the caller says they are IT staff.","An authority claim is not proof of identity."],
      ["End the call and contact IT using the number on the official college website.","Verify independently and never share an OTP."],
      ["Ask the caller to wait while you send your password by message.","Passwords and OTPs should never be shared."]
    ], correct:1, tactic:"Pretexting and impersonation", explanation:"Correct response: end the unexpected call and contact the help desk through a trusted number you find independently. A legitimate support worker should not need your password or OTP.",
    takeaway:"Never disclose passwords, OTPs, recovery codes, or authentication approvals to an unexpected caller."
  },
  {
    id:2, title:"The friendly social media message", type:"SOCIAL MEDIA", role:"Unknown account posing as a classmate", headline:"A stranger asks for personal details",
    description:"An unfamiliar profile sends a friendly message saying they are organizing a student group. They ask for your phone number, date of birth, college ID photo, and a verification code.",
    quote:"“We are adding everyone to the group. Send your details and the code you receive so I can confirm you are a real student.”",
    clues:["Unknown profile and unverified identity","Requests several personal details","Asks for a verification code","Uses friendliness and group membership as pressure"],
    answers:[
      ["Send the details because the person sounds friendly.","Friendly language does not establish trust."],
      ["Share only the verification code, not the other details.","A verification code is sensitive authentication information."],
      ["Do not share anything; verify the organizer through an official class channel and report the account if suspicious.","Use a trusted channel and limit personal information."]
    ], correct:2, tactic:"Trust-building and information harvesting", explanation:"Correct response: do not provide personal information or verification codes. Confirm the organizer through a known class representative or official college channel.",
    takeaway:"Share personal information only when necessary, with a verified recipient, through an appropriate channel."
  },
  {
    id:3, title:"The unexpected prize", type:"TEXT MESSAGE", role:"Unknown sender claiming you won a prize", headline:"You must pay to claim a reward",
    description:"A text message says you have won a new smartphone in a contest you do not remember entering. It asks for a small processing fee and says the offer expires in ten minutes.",
    quote:"“Congratulations! You are our lucky winner. Pay the small processing charge now or your prize will be given to someone else.”",
    clues:["Unexpected prize","Small upfront payment requested","Artificial countdown creates pressure","No verifiable contest information"],
    answers:[
      ["Pay quickly before the offer expires.","Do not let a countdown rush a payment."],
      ["Ignore the message and verify any claimed contest through its official website or organizer.","An unexpected prize and fee are warning signs."],
      ["Reply with your bank details to check whether the prize is genuine.","Never send financial details to an unknown sender."]
    ], correct:1, tactic:"Baiting and urgency", explanation:"Correct response: do not pay or provide information. Verify the contest through a known official source. Unexpected prizes that require fees are a common manipulation pattern.",
    takeaway:"If an offer seems too good to be true, pause and verify it independently."
  },
  {
    id:4, title:"Someone follows you inside", type:"PHYSICAL / OFFICE", role:"Unknown visitor at a restricted entrance", headline:"A stranger asks you to hold a secure door",
    description:"You are entering a restricted computer lab using your access card. A person you do not recognize walks behind you carrying boxes and asks you to hold the door because their hands are full.",
    quote:"“Could you hold that door? I left my access card upstairs. I work with the maintenance team.”",
    clues:["Person has no visible access credential","Relies on politeness and a plausible story","Asks you to bypass an access-control process","You cannot confirm their role"],
    answers:[
      ["Hold the door because it would be rude not to.","Politeness should not override physical security."],
      ["Let them follow you in, then ask their name.","Do not grant access first and verify later."],
      ["Keep the door secure and direct them to reception or authorized staff for access.","Each person should use their own approved access method."]
    ], correct:2, tactic:"Tailgating and authority pretext", explanation:"Correct response: do not allow an unknown person to enter behind you. Politely direct them to reception or security so their access can be verified.",
    takeaway:"Never lend your access card or bypass a secure entry procedure for another person."
  },
  {
    id:5, title:"The manager's urgent request", type:"WORKPLACE MESSAGE", role:"Message from an unverified account posing as a manager", headline:"A request to buy gift cards immediately",
    description:"You receive a message from a display name that looks like your manager. The account says they are in a meeting and asks you to buy gift cards, then send the codes privately.",
    quote:"“I need this done quietly before my next meeting. Buy the cards now and send me the codes. I will explain later.”",
    clues:["Unexpected request involving money","Asks for gift card codes","Creates secrecy and urgency","Display name does not verify the account"],
    answers:[
      ["Buy the cards because the display name matches your manager.","Display names can be copied or spoofed."],
      ["Verify the request by contacting your manager through a known phone number or workplace channel; report it if unconfirmed.","Use an independent trusted channel before any payment."],
      ["Ask the sender to send a photo of their ID in the same chat.","Do not rely on evidence supplied through the suspicious conversation."]
    ], correct:1, tactic:"Impersonation, urgency, and secrecy", explanation:"Correct response: verify using a known contact method, not by replying to the suspicious account. Gift card code requests and secrecy are strong warning signs.",
    takeaway:"Treat unexpected money or gift-card requests as unverified until confirmed through a separate trusted channel."
  },
  {
    id:6, title:"The helpful stranger's USB", type:"IN-PERSON / DEVICE", role:"Unknown person offering a found USB drive", headline:"A stranger offers a USB drive they found",
    description:"Someone near the computer lab says they found a USB drive and thinks it may belong to a student. They ask you to plug it into a lab computer to identify the owner.",
    quote:"“I found this outside. Just plug it in and open the files; maybe you can find the owner's name.”",
    clues:["Unknown USB device","Encourages connecting untrusted media","Curiosity and helpfulness are being used","Could expose a device or network to risk"],
    answers:[
      ["Plug it into your personal laptop to check the files.","Do not connect unknown storage devices."],
      ["Plug it into a lab computer because it is not your own device.","This could put shared systems at risk."],
      ["Do not connect it; hand it to campus IT or lost property according to policy.","Use the approved process for unknown devices."]
    ], correct:2, tactic:"Baiting and curiosity", explanation:"Correct response: never plug an unknown USB drive into a computer. Give it to campus IT or the designated lost-property team according to local policy.",
    takeaway:"Treat unknown removable media as untrusted. Let authorized staff handle it safely."
  }
];

let activeId = null;
let selected = null;
let results = {};
let safeCount = 0;
const $ = id => document.getElementById(id);

function renderScenarios(){
  $("scenarioList").innerHTML = "";
  scenarios.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "scenario-btn" + (s.id === activeId ? " active" : "");
    b.innerHTML = `<span class="scenario-number">0${s.id}</span><span class="scenario-label"><strong>${s.title}</strong><small>${s.type}</small></span><span class="scenario-state ${results[s.id] ? "done" : ""}">${results[s.id] ? "✓ DONE" : "OPEN"}</span>`;
    b.addEventListener("click", () => openScenario(s.id));
    $("scenarioList").appendChild(b);
  });
}

function openScenario(id){
  activeId = id;
  selected = null;
  const s = scenarios.find(x => x.id === id);
  $("welcome").classList.add("hidden");
  $("scenarioView").classList.remove("hidden");
  $("scenarioTitle").textContent = s.title;
  $("level").textContent = results[id] ? "COMPLETED" : "ACTIVE";
  $("sceneType").textContent = s.type;
  $("sceneTime").textContent = `SCENARIO 0${s.id} / 06`;
  $("personIcon").textContent = ["☎","◎","★","▣","✉","▤"][id-1];
  $("sceneRole").textContent = s.role.toUpperCase();
  $("sceneHeadline").textContent = s.headline;
  $("sceneDescription").textContent = s.description;
  $("sceneQuote").textContent = s.quote;
  $("clueList").innerHTML = s.clues.map((c,i) => `<div class="clue"><span>0${i+1}</span>${c}</div>`).join("");
  $("answerList").innerHTML = "";
  s.answers.forEach((answer,i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "answer";
    b.innerHTML = `<span class="answer-mark">${String.fromCharCode(65+i)}</span><span><strong>${answer[0]}</strong><small>${answer[1]}</small></span>`;
    b.addEventListener("click", () => chooseAnswer(i));
    $("answerList").appendChild(b);
  });
  $("feedback").classList.add("hidden");
  $("feedback").classList.remove("bad");
  $("submitAnswer").disabled = true;
  if(results[id]){
    document.querySelectorAll(".answer").forEach((b,i) => {
      b.disabled = true;
      if(i === results[id].choice) b.classList.add("selected");
    });
    showFeedback(s, results[id].choice, results[id].correct, true);
  }
  renderScenarios();
}

function chooseAnswer(index){
  if(!activeId || results[activeId]) return;
  selected = index;
  document.querySelectorAll(".answer").forEach((b,i) => b.classList.toggle("selected",i===index));
  $("submitAnswer").disabled = false;
}

$("submitAnswer").addEventListener("click", () => {
  if(activeId === null || selected === null || results[activeId]) return;
  const s = scenarios.find(x => x.id === activeId);
  const correct = selected === s.correct;
  results[activeId] = {choice:selected,correct};
  if(correct) safeCount++;
  document.querySelectorAll(".answer").forEach(b => b.disabled = true);
  $("submitAnswer").disabled = true;
  showFeedback(s,selected,correct,false);
  updateStats();
  renderScenarios();
});

function showFeedback(s,choice,correct,review){
  const box = $("feedback");
  box.classList.remove("hidden");
  box.classList.toggle("bad",!correct);
  box.innerHTML = `<strong>${review ? "Your saved result" : (correct ? "✓ Safe decision" : "✕ Review this decision")} · ${correct ? "Correct" : "Try again in the next scenario"}</strong><b>Manipulation tactic:</b> ${s.tactic}<br>${s.explanation}<br><br><b>Remember:</b> ${s.takeaway}`;
  $("level").textContent = "COMPLETED";
}

function updateStats(){
  const done = Object.keys(results).length;
  const pct = Math.round(done / scenarios.length * 100);
  $("completedCount").innerHTML = `${done} <sup>/ 6</sup>`;
  $("safeCount").textContent = safeCount;
  $("progressValue").textContent = pct + "%";
  $("progressFill").style.width = pct + "%";
  $("finalScore").innerHTML = `${safeCount} <sup>/ 6</sup>`;
  $("remaining").textContent = `${6-done} AVAILABLE`;
  $("resultText").textContent = done === 6
    ? (safeCount >= 5 ? "Excellent awareness. You consistently chose safe verification steps." : safeCount >= 3 ? "Good progress. Review the tactics and practise pausing before responding." : "Keep learning. Review each explanation and remember to verify independently.")
    : `${done} of 6 situations completed.`;
}

$("restart").addEventListener("click", () => {
  activeId = null;
  selected = null;
  results = {};
  safeCount = 0;
  $("scenarioView").classList.add("hidden");
  $("welcome").classList.remove("hidden");
  $("scenarioTitle").textContent = "Select a scenario";
  $("level").textContent = "WAITING";
  $("feedback").classList.add("hidden");
  updateStats();
  renderScenarios();
});

updateStats();
renderScenarios();
