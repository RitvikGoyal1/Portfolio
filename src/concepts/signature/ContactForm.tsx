import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";

const endpoint = "https://formsubmit.co/ajax/connect@ritvikgoyal.com";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const pending = useRef<AbortController | null>(null);
  const feedback = useRef<HTMLParagraphElement>(null);

  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => {
    if (status === "success" || status === "error") feedback.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const email = String(fields.get("email") || "").trim();
    const message = String(fields.get("message") || "").trim();
    const messageInput = form.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;
    messageInput.setCustomValidity(
      message ? "" : "Please write a message before sending.",
    );
    if (!form.reportValidity()) return;
    // A filled honeypot is ignored without forwarding anything to the inbox.
    if (fields.get("_honey")) return;

    const controller = new AbortController();
    pending.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: String(fields.get("name") || "").trim() || "Not provided",
          email,
          message,
          _replyto: email,
          _subject: "New message from ritvikgoyal.com",
          _template: "table",
          _url: "https://ritvikgoyal.com/#sig-contact",
          _honey: "",
        }),
      });
      const result: { success?: boolean | string } = await response.json();
      if (
        !response.ok ||
        (result.success !== true && result.success !== "true")
      ) {
        throw new Error("Submission was not accepted");
      }
      form.reset();
      setStatus("success");
    } catch {
      // Keep the draft intact; never report success for a rejected or timed-out request.
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      pending.current = null;
    }
  }

  return (
    <div className="sig-message" id="sig-message">
      <div className="sig-message-intro">
        <span className="sig-mono">A NOTE, NOT A MEETING</span>
        <h3>
          Start with <em>hello.</em>
        </h3>
        <p>
          An opportunity, a collaboration, or something you think I’d love.
          Leave a little context and a way to reply.
        </p>
        <span className="sig-message-route">
          <i /> FROM YOUR SIDE OF THE INTERNET
        </span>
      </div>
      <form
        className="sig-message-form"
        onSubmit={submit}
        aria-label="Send Ritvik a message"
        aria-busy={status === "sending"}
      >
        <fieldset disabled={status === "sending"}>
          <div className="sig-message-fields">
            <label htmlFor="sig-sender-name">
              Your name <span>(optional)</span>
              <input
                id="sig-sender-name"
                name="name"
                autoComplete="name"
                maxLength={100}
                placeholder="What should I call you?"
              />
            </label>
            <label htmlFor="sig-sender-email">
              Your email
              <input
                id="sig-sender-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label htmlFor="sig-sender-message">
            What’s on your mind?
            <textarea
              id="sig-sender-message"
              name="message"
              required
              maxLength={5000}
              rows={4}
              placeholder="I’ve got an idea…"
              onChange={(event) => event.currentTarget.setCustomValidity("")}
            />
          </label>
          <div className="sig-message-honey" aria-hidden="true">
            <label>
              Leave this empty
              <input name="_honey" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="sig-message-actions">
            <p>
              Your details are sent via{" "}
              <a
                href="https://formsubmit.co/privacy.pdf"
                target="_blank"
                rel="noreferrer"
              >
                FormSubmit
              </a>{" "}
              so I can reply.
            </p>
            <button type="submit">
              {status === "sending" ? "Sending…" : "Send message"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </fieldset>
        <p
          ref={feedback}
          className={`sig-message-feedback is-${status}`}
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          {status === "success" && (
            <>
              <Check size={17} aria-hidden="true" /> Message submitted. Thanks
              for saying hello.
            </>
          )}
          {status === "error" && (
            <>
              I couldn’t confirm your message was sent. Your draft is still
              here—try again, or{" "}
              <a href="mailto:connect@ritvikgoyal.com">email me directly</a>.
            </>
          )}
        </p>
      </form>
    </div>
  );
}
