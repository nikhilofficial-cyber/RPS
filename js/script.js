// ==== Firebase Setup ====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==== Multiplayer Setup ====
const roomId = "room123"; // Both players must use same roomId
const roomRef = db.ref("rooms/" + roomId);

// Initialize room if first time
roomRef.set({ player1: "", player2: "" });

// ==== DOM Elements ====
const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");
const consoleMain = document.getElementById("consoleMain");

// ==== Detect player (player1 or player2) ====
let playerId = prompt("Are you Player 1 or Player 2? Type 1 or 2");
playerId = playerId === "1" ? "player1" : "player2";

// ==== Send choice function ====
function sendChoice(choice) {
  roomRef.update({ [playerId]: choice });
}

// ==== Attach click events ====
rock.addEventListener("click", () => sendChoice("rock"));
paper.addEventListener("click", () => sendChoice("paper"));
scissors.addEventListener("click", () => sendChoice("scissors"));

// ==== Listen for changes in room (real-time) ====
roomRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const p1 = data.player1;
  const p2 = data.player2;

  // Update console
  consoleMain.innerHTML = `
        <p>Player 1: ${p1 || "-"}</p>
        <p>Player 2: ${p2 || "-"}</p>
      `;

  // Check if both players have made a choice
  if (p1 && p2) {
    let result = "";
    if (p1 === p2) result = "Draw!";
    else if (
      (p1 === "rock" && p2 === "scissors") ||
      (p1 === "paper" && p2 === "rock") ||
      (p1 === "scissors" && p2 === "paper")
    )
      result = "Player 1 Wins!";
    else result = "Player 2 Wins!";

    alert(result);

    // Reset for next round
    roomRef.update({ player1: "", player2: "" });
  }
});
