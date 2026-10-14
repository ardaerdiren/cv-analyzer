# CV Analyzer

## Project Overview

CV Analyzer is a web application that helps people review and improve their CVs. Select a PDF to extract its text and receive a structured review with practical feedback.

## Features

- Select a PDF and start analysis automatically.
- Extract selectable text from PDF files.
- Get a Turkish, Gemini-supported CV assessment.
- Review strengths, areas for improvement, technical and personal skills, and concrete recommendations.
- See uncertain or unverified details when the analysis identifies them.
- Receive clear feedback about invalid PDFs, file size limits, and analysis errors.

## Tech Stack

- [Next.js](https://nextjs.org/) 16.4.0 with the App Router and Route Handlers
- [React](https://react.dev/) 19.3.0
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse) for server-side PDF text extraction
- [`@google/genai`](https://www.npmjs.com/package/@google/genai) for Gemini API requests
- ESLint for linting

## Prerequisites

- Node.js 20.9 or later
- npm
- A Google Gemini API key with access to the model configured by this project

The Node.js minimum follows the installed Next.js documentation. This project does not specify a separate npm version requirement.

## Getting Started

Clone the repository and install its dependencies:

```bash
git clone <repository-url>
cd cv-analyzer
npm install
```

Create a `.env.local` file in the project root and add the server-side API key as described in [Environment Variables](#environment-variables). Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The analysis route reads `GEMINI_API_KEY` on the server. Add your own key to the root `.env.local` file:

```dotenv
GEMINI_API_KEY=your_api_key_here
```

Keep the key private. Do not commit `.env.local`, publish the key on GitHub, or share it in other public places. Do not prefix it with `NEXT_PUBLIC_`; that prefix is for values intended to be exposed to browser code. The repository's `.gitignore` excludes `.env*` files.

## How It Works

1. The user selects a PDF in the browser. The interface checks its file type and enforces the 10 MB limit.
2. The PDF is sent as multipart form data to `POST /api/extract`. The server checks the file type, size, and `%PDF-` signature, then extracts text with `pdf-parse`.
3. The extracted text is sent as JSON to `POST /api/analyze`. The server rejects empty text and text longer than 50,000 characters.
4. The server sends the CV text to Google's Gemini API using the `gemini-3.5-flash-lite` model configured in the analysis route. It requests and validates a structured response before returning the analysis to the browser.
5. The interface displays the assessment, strengths, improvement areas, skills, recommendations, and any identified uncertainties.

The CV text is sent to Google's Gemini API for analysis. The application does not save uploaded PDF files permanently.

## Limitations

- PDF files must be 10 MB or smaller.
- Extracted CV text must not exceed 50,000 characters.
- OCR is not implemented. Scanned PDFs without selectable text cannot be analyzed by the current extraction flow.
- Uploaded files are processed in memory and are not stored permanently by the application.
- CV text is sent to Google's Gemini API. Analysis requires a configured API key and model access; availability and quotas depend on the Google API project.

## Available Scripts

These commands are defined in `package.json`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after building. |
| `npm run lint` | Run ESLint. |
