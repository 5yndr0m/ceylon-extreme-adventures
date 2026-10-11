import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const maxDuration = 60;

const resend = new Resend(process.env.RESEND_API_KEY);

// Must be an address on a domain verified for SENDING in your Resend account
// (use the same "from" your booking/contact emails already use)
const FROM = "Ceylon Extreme Adventures <no-reply@extremeadventure.lk>";

// ---- Spam/noise filters (tuned from your CSV export) ----
const SKIP_SENDERS = [
  "taps-kindersport.de", "tdsgroup.in", "plumbingworld.in",
  "ug.edu.gh", "fillx.de", "pelzgarten.de", "getoxygn.store",
  "vermeidbare-todesursachen.info", "lehringfeld.immobilien",
  "handerksservice-peters.de", "tp.at-web.biz", "vdv-baltay.ru",
  "cloudhq.net", "techsolutionsguide.com", "safetyculture.com",
  "launchzoneinstantlyhub.com", "nmbrs.nl", "gajotres.net",
  "secondmeasure.com", "traverseticker.com", "colonialtours.com.do",
  "myuvci.com", "projectspurs.com", "forumtfc.net", "bof.nl",
  "lottemart.co.id", "helvecia-etterem.hu", "beckiowens.com",
  "century21.de", "treckerteile24.de", "roma-auto-usate.it",
  "republica.ro", "motackle.com.au", "diocesan.com", "tbuy.in",
  "ppcmastery.com", "cec.org.cn", "fotogeschenke.de", "jpckemang.com",
  "nex.md", "cyclingtime.com", "congobusinessandenglish.com",
  "188.com", "rafagalih89@gmail.com", "guineveregrette819@gmail.com",
  "sampathvishwacorporate@sampath.lk", // expired OTP codes - useless now
];
const SKIP_SUBJECTS = [
  "subscription", "payment method", "package is on hold",
  "parcel will be returned", "storage", "final warning",
  "account is scheduled for closure", "domain is nearing expiration",
  "instagram followers", "tiktok", "smart band", "herz p1",
  "dermatologist", "brain secret", "morning ritual", "lisinopril",
  "blood pressure", "pipeline", "test", "check", "to check received emails",
];

function isSpam(from: string, subject: string): boolean {
  const f = from.toLowerCase();
  const s = (subject || "").toLowerCase();
  return (
    SKIP_SENDERS.some((d) => f.includes(d)) ||
    SKIP_SUBJECTS.some((k) => s.includes(k))
  );
}

export async function GET(req: NextRequest) {
  // simple protection - set FORWARD_SECRET in Vercel env vars
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.FORWARD_SECRET || key !== process.env.FORWARD_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
  const take = parseInt(req.nextUrl.searchParams.get("take") || "10");
  const dry = req.nextUrl.searchParams.get("dry") === "1";

  // 1. List ALL received emails (paginated)
  const all: any[] = [];
  let after: string | undefined;
  for (;;) {
    const { data, error } = await resend.emails.receiving.list({
      limit: 100,
      ...(after ? { after } : {}),
    } as any);
    if (error) return NextResponse.json({ error }, { status: 500 });
    const batch = (data as any)?.data ?? [];
    all.push(...batch);
    if (batch.length < 100) break;
    after = batch[batch.length - 1].id;
  }

  // 2. Filter spam, keep order
  const legit = all.filter(
    (e) => !isSpam(e.from ?? "", e.subject ?? "")
  );

  // 3. Take one batch
  const slice = legit.slice(offset, offset + take);
  const results: any[] = [];

  for (const meta of slice) {
    const to: string[] = Array.isArray(meta.to) ? meta.to : [meta.to];
    try {
      if (dry) {
        results.push({ id: meta.id, to, subject: meta.subject, dry: true });
        continue;
      }

      // fetch full content
      const { data: full, error: getErr } =
        await resend.emails.receiving.get(meta.id);
      if (getErr || !full) throw new Error(getErr?.message ?? "not found");

      // attachments (best-effort)
      const attachments: any[] = [];
      for (const att of (full as any).attachments ?? []) {
        try {
          const url = att.download_url ?? att.downloadUrl;
          if (!url) continue;
          const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
          attachments.push({
            filename: att.filename,
            content: buf.toString("base64"),
          });
        } catch {}
      }

      const note = `<div style="padding:10px;margin-bottom:12px;border:1px solid #e5a50a;background:#fffbe6;font-family:sans-serif;font-size:13px">
        ⚠️ This email was originally received on <b>${meta.created_at}</b> but was delayed due to a mail server configuration issue. It is being delivered now. Sorry for the inconvenience.
      </div>`;

      const { error: sendErr } = await resend.emails.send({
        from: FROM,
        to,
        cc: Array.isArray(meta.cc) ? meta.cc.filter(Boolean) : undefined,
        subject: meta.subject ?? "(no subject)",
        html: note + ((full as any).html ?? ""),
        text: (full as any).text ?? undefined,
        replyTo: (full as any).reply_to?.[0] ?? meta.from,
        attachments: attachments.length ? attachments : undefined,
        headers: { "X-Original-Date": meta.created_at ?? "" },
      });

      results.push(
        sendErr
          ? { id: meta.id, to, subject: meta.subject, error: sendErr.message }
          : { id: meta.id, to, subject: meta.subject, ok: true }
      );

      await new Promise((r) => setTimeout(r, 600)); // respect rate limits
    } catch (e: any) {
      results.push({ id: meta.id, to, subject: meta.subject, error: e.message });
    }
  }

  return NextResponse.json({
    totalReceived: all.length,
    totalLegit: legit.length,
    totalSkippedAsSpam: all.length - legit.length,
    offset,
    processed: slice.length,
    nextOffset: offset + take < legit.length ? offset + take : null,
    results,
  });
}
