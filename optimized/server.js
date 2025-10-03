const express = require("express");
const cors = require("cors");
const { Worker } = require("worker_threads");  // import Worker
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Helper function to run worker
function runWorker(number) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "worker.js"), {
      workerData: { number }
    });

    worker.on("message", (result) => resolve(result));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

// Endpoint
app.post("/api/process-data", async (req, res) => {
  const number = req.body.number || 40;
  const start = Date.now();

  try {
    const result = await runWorker(number);
    const end = Date.now();
    res.json({
      result,
      timeTaken: (end - start) / 1000
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);

