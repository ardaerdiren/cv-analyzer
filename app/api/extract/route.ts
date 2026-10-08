import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return errorResponse("The request must contain a valid PDF file.", 400);
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return errorResponse("No PDF file was provided.", 400);
  }

  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const hasValidMimeType = !file.type || file.type === "application/pdf";

  if (!hasPdfExtension || !hasValidMimeType) {
    return errorResponse("Only PDF files are supported.", 415);
  }

  if (file.size > MAX_FILE_SIZE) {
    return errorResponse("The PDF must be 10 MB or smaller.", 413);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfHeader = buffer.subarray(0, 5).toString("ascii");

  if (pdfHeader !== "%PDF-") {
    return errorResponse("The selected file is not a valid PDF.", 400);
  }

  let parser: PDFParse | undefined;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return Response.json({ text: result.text });
  } catch {
    return errorResponse("The PDF could not be read. It may be damaged or password-protected.", 422);
  } finally {
    if (parser) await parser.destroy();
  }
}
