const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// CPU-heavy task: recursive Fibonacci
function heavyTask(n) {
  if (n <= 1) return 1;
  return heavyTask(n - 1) + heavyTask(n - 2);
}

// Endpoint
app.post("/api/process-data", (req, res) => {
  const number = req.body.number || 40; // heavy enough to block
  const start = Date.now();

  const result = heavyTask(number);

  const end = Date.now();
  res.json({
    result,
    timeTaken: (end - start) / 1000 + "s"
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
