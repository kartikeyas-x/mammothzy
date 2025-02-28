
export default function handler(req, res) {
  res.status(200).json({
    message: "API is up and running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
}
