import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONFIG ======
const API_KEY = "Y2ls4twew0dkdlbxqzqtd3rm7sb3svrdo";
const CAMPAIGN_ID = "C5tN5";

const HEADERS = {
  "X-Auth-Token": `api-key ${API_KEY}`,
  "Content-Type": "application/json"
};


// ====== API ======
app.post("/api/lead", async (req, res) => {
  const { email, name, phone } = req.body;

  if (!email || !name || !phone) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 1️⃣ CHECK CONTACT
    const checkRes = await fetch(
      `https://api.getresponse.com/v3/contacts?query[email]=${encodeURIComponent(email)}`,
      { headers: HEADERS }
    );

    if (!checkRes.ok) {
      const errText = await checkRes.text();
      console.error("❌ CHECK CONTACT ERROR:", errText);
      return res.status(400).json({ error: "Check contact failed" });
    }

    const contacts = await checkRes.json();

    // 2️⃣ CHỈ CREATE KHI contacts LÀ ARRAY & RỖNG
    if (Array.isArray(contacts) && contacts.length === 0) {
      const createRes = await fetch(
        "https://api.getresponse.com/v3/contacts",
        {
          method: "POST",
          headers: HEADERS,
          body: JSON.stringify({
            email,
            name,
            campaign: { campaignId: CAMPAIGN_ID },
            customFieldValues: [
              { customFieldId: "nIrYBv", values: [name] },
              { customFieldId: "nIrYQ4", values: [phone] }
            ]
          })
        }
      );

      if (!createRes.ok) {
        const err = await createRes.text();
        console.error("❌ CREATE CONTACT ERROR:", err);
        return res.status(400).json({ error: err });
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// ====== START SERVER ======
app.listen(4000, () => {
  console.log("✅ Backend running http://localhost:4000");
});
