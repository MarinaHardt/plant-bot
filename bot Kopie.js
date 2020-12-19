const fetch = require("node-fetch");
const 

(async () => {
  const response = await fetch(
    "https://trefle.io/api/v1/plants/search?token=YrWtVX-fUjuH-ISKU7_TnjOsKMZMG56EmJrlqGllANs&q=coconut"
  );
  const json = await response.json();
  console.log(json);
})();
