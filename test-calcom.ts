import { fetch } from "undici"

async function testBooking() {
  const payload = {
    startTime: new Date(Date.now() + 86400000).toISOString(),
    eventSlug: "video-session",
    attendeeName: "Test Name",
    attendeeEmail: "test@example.com",
    attendeeTimeZone: "Asia/Kolkata"
  };
  console.log("Payload:", payload);
  const response = await fetch("http://localhost:8001/api/calcom-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
  })

  const resultText = await response.text()
  console.log("Status:", response.status);
  console.log("Result:", resultText);
}
testBooking();
