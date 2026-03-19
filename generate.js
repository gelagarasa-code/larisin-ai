export default async function handler(req, res) {
    const { product, passcode } = req.body;

    // 1. Cek Password (Ganti 'PASWORDRAHASIA' dengan keinginan Anda)
    // Atau nanti kita ambil dari Vercel Env
    if (passcode !== process.env.ACCESS_PASSWORD) {
        return res.status(401).json({ error: "Kode akses salah atau sudah kadaluarsa!" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const prompt = `Anda ahli copywriting Indonesia. Buat 3 hook TikTok viral dan 1 caption IG untuk produk: ${product}. Balas dalam format JSON murni: {"tiktok": "...", "ig": "..."}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const cleanJson = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ""));
        
        res.status(200).json(cleanJson);
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan pada mesin AI." });
    }
}
