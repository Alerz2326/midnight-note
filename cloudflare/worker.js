export default {
  async fetch(request, env) {
    const allowedOrigin = "https://alerz2326.github.io";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();
      const answer = data.answer;
      const person = data.person === "saina" ? "saina" : "modathe";

      if (answer !== "yes" && answer !== "no") {
        return new Response("Invalid answer", { status: 400, headers: corsHeaders });
      }

      let message;
      if (person === "saina") {
        message = answer === "yes"
          ? "💌 پاسخ جدید از سایت ساینا:\n\nساینا گزینه «بله ❤️» را انتخاب کرد."
          : "💌 پاسخ جدید از سایت ساینا:\n\nساینا گزینه «خیر» را انتخاب کرد.";
      } else {
        message = answer === "yes"
          ? "💌 پاسخ جدید از سایت:\n\nمحدثه گزینه «بله ❤️» را انتخاب کرد."
          : "💌 پاسخ جدید از سایت:\n\nمحدثه گزینه «خیر» را انتخاب کرد.";
      }

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: "5392212541", text: message })
        }
      );

      if (!telegramResponse.ok) {
        console.error("Telegram API error:", await telegramResponse.text());
        return new Response("Telegram error", { status: 502, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Server error", { status: 500, headers: corsHeaders });
    }
  }
};
