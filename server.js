const { createServer } = require("http");
const next = require("next");

// cPanel/Passenger ustawia PORT samodzielnie — nie zakładamy 3000 na produkcji.
// Ten plik służy tylko do uruchamiania zbudowanej wersji produkcyjnej —
// `pnpm run dev` nadal używa zwykłego `next dev`, więc nie polegamy tu na
// NODE_ENV (różnie ustawianym w zależności od powłoki/systemu).
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV === "development";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> Ready on port ${port} (${dev ? "development" : "production"})`);
  });
});
