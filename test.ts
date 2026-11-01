const router = async () => {
  const url = "http://192.168.0.111:3000/api/v1/generate";

  console.log("Starting test script for /api/v1/generate endpoint");
  const lastArg = Bun.argv[Bun.argv.length - 1];
  let repeat = lastArg && !isNaN(Number(lastArg)) ? parseInt(lastArg) : 1;
  console.log("Repeating request : ", repeat, " times");

  // Only handle the POST we care about
  const promises = [];
  while(repeat-->0) {
    const promise = fetch(url, {
      method: "POST"
    });
    promises.push(promise);
  }

  const responses = await Promise.all(promises);
  const results = await Promise.all(responses.map(r => r.json()));
  console.log("Ran : ", results.length, "\n results: ", results);
};

export default router;