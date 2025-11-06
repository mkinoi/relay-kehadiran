export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    console.log("📦 Data diterima:", body);

    const { nama, emel, tarikh, waktu, status, lokasi, luarKawasan, aksi } = body;

    if (!nama || !emel || !tarikh || !waktu || !aksi) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzapf2MLplP0Q0rij9esopyjRzchFl7NY-4uMxUZZt1q2E6h5-W-yzePITy3tQ_cbbT/exec";

    const payload = {
      nama: nama || "-",
      emel: emel || "-",
      tarikh: tarikh || "-",
      waktu: waktu || "-",
      status: status || "-",
      lokasi: lokasi || "-",
      luarKawasan: luarKawasan || "-",
      aksi: aksi || "-"
    };

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.text();
    console.log("✅ Respon dari Google Apps Script:", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("❌ Ralat dalam relay.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
