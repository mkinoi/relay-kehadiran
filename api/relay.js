export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      nama,
      emel,
      tarikh,
      waktu,
      status,
      lokasi,
      luarKawasan,
      aksi
    } = JSON.parse(req.body);

    // Semak data wajib
    if (!nama || !emel || !tarikh || !waktu || !aksi) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // URL Web App Google Apps Script (boleh tukar ke process.env.SCRIPT_DEPLOYMENT_URL jika guna environment variable)
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzapf2MLplP0Q0rij9esopyjRzchFl7NY-4uMxUZZt1q2E6h5-W-yzePITy3tQ_cbbT/exec";

    // Hantar ke Google Sheets melalui Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama,
        emel,
        tarikh,
        waktu,
        status,
        lokasi,
        luarKawasan,
        aksi
      })
    });

    const result = await response.text();
    console.log("✅ Respon dari Google Apps Script:", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("❌ Ralat dalam relay.js:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
