import { google } from "googleapis"
import { createClient as createSupabaseServer } from "@/lib/supabase/server"

type OAuthTokens = {
  access_token: string
  refresh_token?: string | null
  scope?: string | null
  token_type?: string | null
  expiry_date?: string | null
}

// Check if Google credentials are properly configured
const hasGoogleCredentials = !!(
  process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET && 
  process.env.GOOGLE_REDIRECT_URI
)

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID || 'dummy-client-id'
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret'
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export function getConsentUrl(state: string) {
  if (!hasGoogleCredentials) {
    throw new Error("Google Calendar integration not configured")
  }
  
  const oauth2Client = getOAuthClient()
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly",
      "openid",
      "email",
      "profile",
    ],
    prompt: "consent",
    state,
  })
  return url
}

export async function exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
  if (!hasGoogleCredentials) {
    throw new Error("Google Calendar integration not configured")
  }
  
  const oauth2Client = getOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  const result: OAuthTokens = {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token ?? null,
    scope: tokens.scope ?? null,
    token_type: tokens.token_type ?? null,
    expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
  }
  return result
}

export async function upsertUserTokens(userId: string, tokens: OAuthTokens) {
  const supabase = await createSupabaseServer()
  await supabase.from("google_tokens").upsert({
    user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expiry_date: tokens.expiry_date,
  })
}

export async function getUserTokens(userId: string): Promise<OAuthTokens | null> {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from("google_tokens").select("*").eq("user_id", userId).single()
  if (!data) return null
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    scope: data.scope,
    token_type: data.token_type,
    expiry_date: data.expiry_date,
  }
}

export async function getAuthedCalendarClient(userId: string) {
  if (!hasGoogleCredentials) {
    return null
  }
  
  const oauth2Client = getOAuthClient()
  const tokens = await getUserTokens(userId)
  if (!tokens) return null
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? undefined,
  })
  return google.calendar({ version: "v3", auth: oauth2Client })
}

export async function addEventToPrimaryCalendar(params: {
  userId: string
  summary: string
  description?: string
  location?: string
  start: Date
  end: Date
  timezone?: string
}) {
  if (!hasGoogleCredentials) {
    throw new Error("Google Calendar integration not configured")
  }
  
  const calendar = await getAuthedCalendarClient(params.userId)
  if (!calendar) throw new Error("Google account not connected")

  const timeZone = params.timezone || "UTC"
  await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: params.summary,
      description: params.description,
      location: params.location,
      start: { dateTime: params.start.toISOString(), timeZone },
      end: { dateTime: params.end.toISOString(), timeZone },
    },
  })
}
