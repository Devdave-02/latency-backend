const { parentPort, workerData } = require("worker_threads");

// CPU-heavy task: recursive Fibonacci
function heavyTask(n) {
  if (n <= 1) return 1;
  return heavyTask(n - 1) + heavyTask(n - 2);
}

// Run the task and send result back
const result = heavyTask(workerData.number);
parentPort.postMessage(result);

