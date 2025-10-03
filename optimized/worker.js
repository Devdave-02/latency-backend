const { parentPort, workerData } = require("worker_threads");

function heavyTask(n) {
  if (n <= 1) return 1;
  return heavyTask(n - 1) + heavyTask(n - 2);
}

const result = heavyTask(workerData.number);
parentPort.postMessage(result);


