import { useEffect, useRef } from "react";

const GSI_SRC = "https://accounts.google.com/gsi/client";
let gsiPromise = null;

const loadGsi = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = GSI_SRC;
      s.async = true;
      s.defer = true;
      s.onload = resolve;
      s.onerror = () => {
        gsiPromise = null;
        reject(new Error("Google script failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return gsiPromise;
};

/**
 * Official "Sign in with Google" button (Google Identity Services).
 * Calls onCredential(idToken) - send that token to POST /api/google-login/.
 * Needs VITE_GOOGLE_CLIENT_ID; without it the button is hidden.
 */
function GoogleButton({ onCredential, text = "continue_with" }) {
  const box = useRef(null);
  const handler = useRef(onCredential);
  handler.current = onCredential;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return undefined;
    let cancelled = false;

    loadGsi()
      .then(() => {
        if (cancelled || !box.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (res) => handler.current?.(res.credential),
        });
        window.google.accounts.id.renderButton(box.current, {
          theme: "outline",
          size: "large",
          text,
          shape: "rectangular",
          logo_alignment: "center",
          width: Math.min(400, box.current.offsetWidth || 340),
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [clientId, text]);

  if (!clientId) {
    return import.meta.env.DEV ? (
      <p className="au-hint">Google login is off: add VITE_GOOGLE_CLIENT_ID to frontend/.env</p>
    ) : null;
  }

  return <div ref={box} className="au-google" />;
}

export default GoogleButton;
