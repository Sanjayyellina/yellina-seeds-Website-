// Minimal Supabase REST client for the enquiry form — no SDK needed.
// The publishable key is safe to ship in client code; the database only
// allows anonymous INSERTs into website_enquiries (no reads).
const SUPABASE_URL = 'https://gnujlntvcdwtwdnsgobj.supabase.co'
const SUPABASE_KEY = 'sb_publishable_w2ZM4DlDpDc4G5kRtDLLdw_e17OdLgc'

export async function submitEnquiry(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/website_enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Enquiry submit failed: ${res.status}`)
  }
}
