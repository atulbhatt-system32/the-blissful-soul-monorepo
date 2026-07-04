const INTERAKT_API_URL = "https://api.interakt.ai/v1/public/message/"

// Interakt rejects template requests outright (400) if any body variable is an empty string,
// so a missing Cal.com meet URL needs a non-empty fallback rather than "".
const MEET_URL_PLACEHOLDER = "Link will be shared before the session"

function getAuthHeader(): string {
  // INTERAKT_API_KEY is stored as the ready-to-use base64(key:) token
  const token = process.env.INTERAKT_API_KEY
  if (!token) throw new Error("INTERAKT_API_KEY is not set")
  return "Basic " + token
}

type InteraktTemplatePayload = {
  countryCode: string
  phoneNumber: string
  callbackData?: string
  type: "Template"
  template: {
    name: string
    languageCode: string
    headerValues?: string[]
    bodyValues?: string[]
    buttonValues?: Record<string, string[]>
  }
}

async function sendWhatsAppTemplate(payload: InteraktTemplatePayload): Promise<void> {
  // Dry-run mode: log the payload instead of calling the Interakt API
  if (process.env.WHATSAPP_DRY_RUN === "true") {
    console.log("[WhatsApp DRY-RUN] Would send template message:")
    console.log(JSON.stringify(payload, null, 2))
    console.log("[WhatsApp DRY-RUN] Skipping actual API call (WHATSAPP_DRY_RUN=true)")
    return
  }

  const response = await fetch(INTERAKT_API_URL, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Interakt API ${response.status}: ${body}`)
  }
}

// Dial codes sorted longest-first so "+971" is matched before "+97" or "+9" (prefix ambiguity).
const KNOWN_DIAL_CODES = [
  "1", "7", "20", "27", "30", "31", "32", "33", "34", "36", "39", "40", "41",
  "43", "44", "45", "46", "47", "48", "49", "51", "52", "54", "55", "57", "60",
  "61", "62", "63", "64", "65", "66", "81", "82", "84", "86", "90", "91", "92",
  "94", "98", "212", "234", "254", "880", "960", "965", "966", "968", "971",
  "973", "974", "977",
].sort((a, b) => b.length - a.length)

function normalisePhone(phone: string, countryCode: string): { dialCode: string; number: string } {
  const digits = phone.replace(/^\+/, "").replace(/\D/g, "")

  // When the stored phone has an explicit "+" prefix, parse the dial code from the
  // number itself — do not trust the region country code, which is always "in" for
  // this store regardless of the customer's actual country.
  if (phone.trim().startsWith("+") && digits.length > 0) {
    for (const code of KNOWN_DIAL_CODES) {
      if (digits.startsWith(code)) {
        return { dialCode: code, number: digits.slice(code.length) }
      }
    }
    // Unrecognised dial code — return as-is so Interakt can surface the error.
    return { dialCode: "", number: digits }
  }

  // Legacy path: phone stored without "+" prefix — derive dial code from region.
  const isoToDialCode: Record<string, string> = { in: "91", us: "1", gb: "44" }
  const dialCode = (isoToDialCode[countryCode.toLowerCase()] ?? countryCode.replace(/\D/g, "")) || "91"
  // Only strip dial code prefix if the remainder is still a full local number (≥10 digits).
  const stripped = digits.startsWith(dialCode) ? digits.slice(dialCode.length) : digits
  const number = stripped.length >= 10 ? stripped : digits
  return { dialCode, number }
}

/**
 * Regular product order confirmation.
 *
 * Template "order_confirmation" body params:
 *   {{1}} – customer first name
 *   {{2}} – order ID
 *   {{3}} – product title(s)
 *   {{4}} – order date (e.g. "20 May 2026")
 *   {{5}} – amount paid (e.g. "₹348")
 */
export async function sendOrderConfirmationWhatsApp({
  phone,
  countryCode,
  firstName,
  orderId,
  productTitle,
  orderDate,
  amount,
}: {
  phone: string
  countryCode: string
  firstName: string
  orderId: string | number
  productTitle?: string
  orderDate: string
  amount: number
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `order_confirmation_${orderId}`,
    type: "Template",
    template: {
      name: "order_confirmation",
      languageCode: "en",
      bodyValues: [
        firstName,
        String(orderId),
        productTitle || "Your order",
        orderDate,
        `₹${amount.toLocaleString("en-IN")}`,
      ],
    },
  })
}

/**
 * Session / service booking confirmation.
 *
 * Template "booking_confirmation" body params:
 *   {{1}} – customer first name
 *   {{2}} – order ID
 *   {{3}} – service title
 *   {{4}} – session date (e.g. "2026-05-25")
 *   {{5}} – session time (e.g. "10:30 AM")
 *   {{6}} – amount paid (e.g. "₹2,999")
 */
export async function sendBookingConfirmationWhatsApp({
  phone,
  countryCode,
  firstName,
  orderId,
  serviceTitle,
  bookingDate,
  bookingTime,
  amount,
  calMeetUrl,
}: {
  phone: string
  countryCode: string
  firstName: string
  orderId: string | number
  serviceTitle?: string
  bookingDate: string
  bookingTime: string
  amount: number
  calMeetUrl?: string
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  const bodyValues = [
    firstName,
    String(orderId),
    serviceTitle || "Your session",
    bookingDate,
    bookingTime,
    `₹${amount.toLocaleString("en-IN")}`,
    calMeetUrl || MEET_URL_PLACEHOLDER,
  ]

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `booking_confirmation_${orderId}`,
    type: "Template",
    template: { name: "booking_confirmation", languageCode: "en", bodyValues },
  })
}

/**
 * Regular product order cancellation.
 *
 * Template "order_cancellation" body params:
 *   {{1}} – customer first name
 *   {{2}} – order ID
 *   {{3}} – product title(s)
 *   {{4}} – order date (e.g. "20 May 2026")
 */
export async function sendOrderCancellationWhatsApp({
  phone,
  countryCode,
  firstName,
  orderId,
  productTitle,
  orderDate,
}: {
  phone: string
  countryCode: string
  firstName: string
  orderId: string | number
  productTitle?: string
  orderDate: string
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `order_cancellation_${orderId}`,
    type: "Template",
    template: {
      name: "order_cancellation",
      languageCode: "en",
      bodyValues: [
        firstName,
        String(orderId),
        productTitle || "Your order",
        orderDate,
      ],
    },
  })
}

/**
 * Session / service booking cancellation.
 *
 * Template "session_cancellation" body params:
 *   {{1}} – customer first name
 *   {{2}} – order ID
 *   {{3}} – service title
 *   {{4}} – session date
 *   {{5}} – session time
 */
export async function sendSessionCancellationWhatsApp({
  phone,
  countryCode,
  firstName,
  orderId,
  serviceTitle,
  bookingDate,
  bookingTime,
}: {
  phone: string
  countryCode: string
  firstName: string
  orderId: string | number
  serviceTitle?: string
  bookingDate: string
  bookingTime: string
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `session_cancellation_${orderId}`,
    type: "Template",
    template: {
      name: "session_cancellation",
      languageCode: "en",
      bodyValues: [
        firstName,
        String(orderId),
        serviceTitle || "Your session",
        bookingDate,
        bookingTime,
      ],
    },
  })
}

/**
 * Session reminder 1 hour before.
 *
 * Template "session_reminder" body params:
 *   {{1}} – customer first name
 *   {{2}} – session time  (e.g. "10:30 AM")
 *   {{3}} – session date  (e.g. "2026-05-25")
 *   {{4}} – meeting link  (omitted when not available)
 */
export async function sendSessionReminderWhatsApp({
  phone,
  countryCode,
  firstName,
  bookingDate,
  bookingTime,
  orderId,
  calMeetUrl,
}: {
  phone: string
  countryCode: string
  firstName: string
  bookingDate: string
  bookingTime: string
  orderId: string | number
  calMeetUrl?: string
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `session_reminder_${orderId}`,
    type: "Template",
    template: {
      name: "session_reminder",
      languageCode: "en",
      bodyValues: [firstName, bookingTime, bookingDate, calMeetUrl || MEET_URL_PLACEHOLDER],
    },
  })
}

/**
 * Session reminder 15 minutes before.
 *
 * Template "session_reminder_15min" body params:
 *   {{1}} – customer first name
 *   {{2}} – session time  (e.g. "10:30 AM")
 *   {{3}} – session date  (e.g. "2026-05-25")
 *   {{4}} – meeting link
 */
export async function sendSessionReminder15MinWhatsApp({
  phone,
  countryCode,
  firstName,
  bookingDate,
  bookingTime,
  orderId,
  calMeetUrl,
  minutesLeft,
}: {
  phone: string
  countryCode: string
  firstName: string
  bookingDate: string
  bookingTime: string
  orderId: string | number
  calMeetUrl?: string
  minutesLeft?: number
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `session_reminder_15min_${orderId}`,
    type: "Template",
    template: {
      name: "session_reminder_15min",
      languageCode: "en",
      bodyValues: [firstName, bookingTime, bookingDate, calMeetUrl || MEET_URL_PLACEHOLDER, String(minutesLeft ?? 15)],
    },
  })
}

/**
 * Session rescheduled notification (admin via Cal.com).
 *
 * Template "session_rescheduled" body params:
 *   {{1}} – customer first name
 *   {{2}} – order ID
 *   {{3}} – service title
 *   {{4}} – new session date
 *   {{5}} – new session time
 */
export async function sendSessionRescheduledWhatsApp({
  phone,
  countryCode,
  firstName,
  orderId,
  serviceTitle,
  newDate,
  newTime,
}: {
  phone: string
  countryCode: string
  firstName: string
  orderId: string | number
  serviceTitle?: string
  newDate: string
  newTime: string
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `session_rescheduled_${orderId}`,
    type: "Template",
    template: {
      name: "session_rescheduled",
      languageCode: "en",
      bodyValues: [
        firstName,
        String(orderId),
        serviceTitle || "Your session",
        newDate,
        newTime,
      ],
    },
  })
}

/**
 * Course confirmation notification.
 *
 * Template "course_confirmation" body params:
 *   {{1}} – customer first name
 *   {{2}} – google drive link
 */
export async function sendCourseConfirmationWhatsApp({
  phone,
  countryCode,
  firstName,
  orderId,
  driveLink,
}: {
  phone: string
  countryCode: string
  firstName: string
  orderId: string | number
  driveLink: string
}): Promise<void> {
  const { dialCode, number } = normalisePhone(phone, countryCode)

  await sendWhatsAppTemplate({
    countryCode: dialCode,
    phoneNumber: number,
    callbackData: `course_confirmation_${orderId}`,
    type: "Template",
    template: {
      name: "course_confirmation",
      languageCode: "en",
      bodyValues: [firstName, driveLink],
    },
  })
}
