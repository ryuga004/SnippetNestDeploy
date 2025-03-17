"use client";

import React from "react";
import { LiveError, LivePreview, LiveProvider } from "react-live";

const scope = { React }; // Any dependencies the JSX might use

const LiveComponentRenderer = ({ code }: { code: string }) => {
    return (
        <LiveProvider code={code} scope={scope}>
            {/* Live Preview (Renders JSX) */}
            <div className="p-4 border rounded-lg bg-gray-100">
                <LivePreview />
            </div>

            {/* Code Editor (Optional) */}
            {/* <div className="mt-4">
                <LiveEditor className="p-2 border rounded-lg bg-gray-900 text-white" />
            </div> */}

            {/* Error Messages */}
            <LiveError className="text-red-500 mt-2" />
        </LiveProvider>
    );
};

export default LiveComponentRenderer;
