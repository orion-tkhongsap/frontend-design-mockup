---
allowed-tools: Bash
argument-hint: [port]
description: Stop the Orion frontend service
---

## Context

- Current running Next.js/Node processes: !`ps aux | grep -E "next|npm run|node.*dev" | grep -v grep | head -10 || echo "No frontend processes found"`
- Ports in use: !`ss -tlnp 2>/dev/null | grep -E ":(3000|5000|5001|5002|5003|5004|5005)" | head -5 || lsof -i :3000,:5000,:5001,:5002,:5003,:5004,:5005 2>/dev/null | grep LISTEN | head -5 || echo "No frontend services detected on common ports"`

## Your task

Stop the Orion frontend service(s) with the following requirements:

1. Parse arguments:
   - First argument ($1): Optional port number to target specific service
   - If no port specified, stop all Next.js/npm dev processes

2. Find and terminate processes:
   - If port is specified:
     * Find the process using that specific port
     * Use lsof or ss to identify the PID
     * Terminate only that specific process
   - If no port specified:
     * Find all Next.js development server processes
     * Find all npm run dev/start processes
     * Terminate all frontend-related processes

3. Use proper termination:
   - First attempt: Send SIGTERM for graceful shutdown
   - If needed: Follow up with SIGKILL after a brief wait
   - Verify processes are terminated

4. Provide clear feedback:
   - List the processes that were stopped (with PIDs)
   - Confirm successful termination
   - If no processes were running, inform the user clearly
   - Show which ports are now free

5. Handle edge cases:
   - Permission issues (suggest using sudo if needed)
   - No processes found (clear message that nothing was running)
   - Multiple processes on same port (handle all)

Arguments provided: $ARGUMENTS

Execute this task and provide clear, concise output to the user.