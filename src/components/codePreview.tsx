"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

export default function CodePreview({ code = "" }: { code: string }) {



    const tailwindCSS = `
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  `;

    return (

        <Sandpack
            template="react"
            theme="dark"
            files={{
                "/App.js": { code },
                "/index.css": { code: tailwindCSS },
            }}
            options={{
                showConsole: true,
                showLineNumbers: true,
                editorHeight: 800,
                wrapContent: true,
                editorWidthPercentage: 50,
                resizablePanels: true,
            }}
        />

    );
}
