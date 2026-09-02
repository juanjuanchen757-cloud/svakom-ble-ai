import express from "express";

const app = express();
app.use(express.json());

const secret = process.env.BRIDGE_SECRET || "";
const port = process.env.PORT || 8080;
const queue = [];

function check(req, res, next) {
  const h = req.header("x-bridge-secret") || "";
  const q = req.query.secret || "";
  if (secret && h !== secret && q !== secret) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
}

app.get("/toy-next", check, (req, res) => {
  if (queue.length === 0) {
    res.json({});
    return;
  }
  res.json(queue.shift());
});

app.post("/toy", check, (req, res) => {
  queue.push(req.body || {});
  res.json({ ok: true, queued: queue.length });
});

app.get("/", (req, res) => {
  res.send("svakom bridge ok");
});

app.listen(port, "0.0.0.0", () => {
  console.log("listening", port);
});
