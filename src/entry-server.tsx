import { renderToString } from "react-dom/server";
import Signature from "./concepts/signature/Signature";
import Resume from "./pages/Resume";

// Render the same content served to visitors, without a browser or external service.
export function renderPage(isResume: boolean) {
  return renderToString(isResume ? <Resume /> : <Signature />);
}
