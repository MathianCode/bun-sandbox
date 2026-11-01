const router = async () => {
  const url = "http://192.168.0.111:3000/api/v1/generate";

  const lastArg = Bun.argv[Bun.argv.length - 1];
  let repeat = lastArg && !isNaN(Number(lastArg)) ? parseInt(lastArg) : 1;
  console.log(`Starting test script. Launching ${repeat} concurrent requests...`);

  const promises = [];
  for (let i = 0; i < repeat; i++) {
    const promise = fetch(url, { method: "POST" })
      .then(async (res) => {
        // If the server responds with a 400/500 error, throw it so it hits the catch block
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return await res.json();
      });
    promises.push(promise);
  }

  // 🚀 Switch to allSettled so it never crashes the script
  const results = await Promise.allSettled(promises);

  let successCount = 0;

  results.forEach((result, index) => {
    const requestNumber = index + 1; // 1-based indexing for human readability

    if (result.status === "fulfilled") {
      successCount++;
      // Optional: Log successful responses if you need to inspect data
      console.log(`Request #${requestNumber} succeeded:`, result.value);
    } else {
      // Handle and log the specific failure with its index
      console.error(`❌ ${requestNumber}th request failed. Error: ${result.reason.message}`);
    }
  });

  console.log(`\nExecution finished. Total Ran: ${results.length} | Success: ${successCount} | Failed: ${results.length - successCount}`);
};

export default router;
