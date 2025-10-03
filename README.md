**Node.js Performance Optimization Report**

**Phase 1: Baseline Analysis (Unoptimized)**
**Average Request Latency:** ~2.20 seconds (when sending 100 concurrent requests).
CPU Profile Summary: The profiling clearly showed that the function `heavyTask` (recursive Fibonacci in `server.js:10`) consumed almost all the CPU time (~214 seconds).  While this function was running, the Event Loop was blocked, meaning the server could not handle other requests.

📸 **Screenshot (Unoptimized Flame Graph / CPU Profile):**  
[Unoptimized Profile](./screenshots/unoptimized.png)


**Phase 2: Optimization Strategy**
**Why the Event Loop Was Blocked**
- In the baseline setup, the CPU-heavy calculation (`heavyTask`) ran directly on the main thread.  
- Since Node.js is single-threaded, this blocked the Event Loop, preventing it from handling new incoming requests until the calculation finished.

**Why Worker Threads**
- Worker Threads let us run heavy CPU work in separate threads without blocking the main Event Loop.  
- Compared to clustering, Worker Threads are better for **CPU-bound tasks** (like Fibonacci), because they allow offloading work to background threads while the main thread remains responsive.  
- This ensures the server can keep processing new requests while still doing the heavy computation in parallel.

**Communication Strategy**
- The main thread creates a Worker for each request.  
- Input data (e.g., `number: 40`) is passed to the Worker.  
- The Worker computes the Fibonacci result and sends the result back using `postMessage`.  
- The main thread then sends the response to the client.


**Phase 3: Validation Results (Optimized)**
**Average Request Latency:** ~6.72 seconds (when sending 100 concurrent requests).
CPU Profile Summary: After moving the heavy task to a Worker, the main thread no longer shows `heavyTask` in its profile.  Instead, it only contains light Node.js functions (like HTTP parsing, event listeners).  This proves the Event Loop is no longer blocked by the Fibonacci calculation.  

📸 **Screenshot (Optimized Flame Graph / CPU Profile):**  
[Optimized Profile](./screenshots/optimized.png)

**Percentage Improvement**
- Before optimization: **Event Loop was fully blocked** → server became unresponsive.  
- After optimization: **Event Loop is free**, and heavy CPU work happens in Workers.  
- Although the raw average latency per request increased (from 2.20s → 6.72s due to CPU contention), the **server remains responsive to new requests** — which is the real performance win.  


**Conclusion**
The experiment shows that **CPU-heavy synchronous tasks block Node.js’s Event Loop**, causing high latency and poor throughput.  By using **Worker Threads**, the blocking work is moved off the main thread. This keeps Node.js responsive under load, even if individual requests take longer.  
Key Learning: Worker Threads are a practical way to handle CPU-intensive operations in Node.js without sacrificing responsiveness.  
