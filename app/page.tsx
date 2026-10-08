"use client";

import { useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const benefits = [
  {
    number: "01",
    title: "ATS compatibility",
    description:
      "See how clearly your CV communicates with applicant tracking systems.",
  },
  {
    number: "02",
    title: "Skills overview",
    description:
      "Bring your strengths into focus and spot skills worth developing.",
  },
  {
    number: "03",
    title: "Experience review",
    description:
      "Make your experience easier to scan, understand, and remember.",
  },
];

function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      className="h-10 w-10 text-stone-500"
    >
      <path
        d="M11.75 5.75h10.5l7 7v21.5h-17.5V5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22.25 5.75v7h7M16.25 21.25h8.5M16.25 26.25h8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
    const hasValidMimeType = !file.type || file.type === "application/pdf";

    if (!hasPdfExtension || !hasValidMimeType) {
      setSelectedFileName(null);
      setExtractedText(null);
      setFileError("Please choose a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFileName(null);
      setExtractedText(null);
      setFileError("This file is larger than 10 MB. Please choose a smaller PDF.");
      return;
    }

    setSelectedFileName(file.name);
    setFileError(null);
    setExtractedText(null);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        text?: unknown;
        error?: unknown;
      };

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "The PDF could not be processed. Please try again.",
        );
      }

      if (typeof result.text !== "string") {
        throw new Error("The server returned an invalid response.");
      }

      setExtractedText(result.text);
    } catch (error) {
      setFileError(
        error instanceof Error
          ? error.message
          : "The PDF could not be processed. Please try again.",
      );
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <header className="border-b border-stone-200/80">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 sm:px-10"
        >
          <a href="#top" className="flex items-center gap-3" aria-label="CV Analyzer home">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center border border-stone-300 bg-white text-xs font-semibold tracking-tight"
            >
              CV
            </span>
            <span className="text-sm font-semibold tracking-[-0.02em]">
              CV Analyzer
            </span>
          </a>
          <div className="flex items-center gap-7 text-sm text-stone-600">
            <a className="transition-colors hover:text-stone-950" href="#about">
              About
            </a>
            <a
              className="transition-colors hover:text-stone-950"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-16 sm:px-10 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:pb-28 lg:pt-28">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              A clearer next step
            </p>
            <h1 className="max-w-[620px] text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[58px]">
              Analyze your CV. Improve your next opportunity.
            </h1>
            <p className="mt-6 max-w-[500px] text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              Get a thoughtful, practical read on your CV and find the details
              that can help you move forward with confidence.
            </p>
            <div className="mt-9 flex items-center gap-3 text-sm text-stone-500">
              <span aria-hidden="true" className="h-px w-8 bg-stone-400" />
              Clear feedback for your next application
            </div>
          </div>

          <div className="w-full">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Start with your CV</h2>
              <span className="text-xs text-stone-500">Step 1 of 1</span>
            </div>
            <input
              id="cv-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isExtracting}
              aria-describedby="cv-file-guidance cv-file-status"
              className="peer sr-only"
            />
            <label
              htmlFor="cv-file"
              className="flex min-h-[290px] cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-white px-6 py-10 text-center transition-colors hover:border-stone-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-stone-700 sm:min-h-[320px]"
            >
              <DocumentIcon />
              <p className="mt-5 text-base font-medium">
                {isExtracting
                  ? "Reading your CV…"
                  : selectedFileName
                    ? "Your CV is ready"
                    : "Your next opportunity starts here"}
              </p>
              <p className="mt-2 max-w-xs break-all text-sm leading-6 text-stone-500">
                {selectedFileName ??
                  "Add your CV to see a clear overview of its strengths and areas to improve."}
              </p>
              <span className="mt-6 inline-flex min-h-11 items-center justify-center border border-stone-300 px-5 text-sm font-medium text-stone-700">
                {isExtracting
                  ? "Extracting text…"
                  : selectedFileName
                    ? "Choose another PDF"
                    : "Choose a PDF"}
              </span>
              <p id="cv-file-guidance" className="mt-3 text-xs text-stone-500">
                PDF format <span aria-hidden="true">·</span> Maximum file size 10 MB
              </p>
            </label>
            <p
              id="cv-file-status"
              role={fileError ? "alert" : "status"}
              aria-live="polite"
              className={`mt-3 text-xs leading-5 ${fileError ? "text-red-700" : "text-stone-500"}`}
            >
              {fileError ??
                (isExtracting
                  ? "Extracting text from your PDF. Please wait."
                  : selectedFileName
                    ? "Text extraction is complete. No AI analysis has been run."
                    : "Select a PDF to extract its text. Files are processed in memory and not saved.")}
            </p>
            {extractedText !== null && (
              <section
                aria-labelledby="extracted-text-heading"
                aria-live="polite"
                className="mt-6 border border-stone-200 bg-white p-5 sm:p-6"
              >
                <h3 id="extracted-text-heading" className="text-sm font-semibold">
                  Extracted text
                </h3>
                {extractedText.trim() ? (
                  <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-stone-700">
                    {extractedText}
                  </pre>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-stone-500">
                    No selectable text was found in this PDF. Scanned documents
                    may require OCR.
                  </p>
                )}
              </section>
            )}
          </div>
        </section>

        <section id="about" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
            <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  What you will get
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  A more considered CV.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-stone-500">
                Practical insights to help you present your experience with
                clarity.
              </p>
            </div>
            <div className="grid border-t border-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-stone-200">
              {benefits.map((benefit) => (
                <article
                  key={benefit.number}
                  className="border-b border-stone-200 py-6 sm:border-b-0 sm:px-6 sm:py-7 sm:first:pl-0 sm:last:pr-0"
                >
                  <span className="text-xs font-medium tabular-nums text-stone-400">
                    {benefit.number}
                  </span>
                  <h3 className="mt-5 text-base font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-[#faf9f6]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span>CV Analyzer</span>
          <span>Make your next application count.</span>
        </div>
      </footer>
    </div>
  );
}
