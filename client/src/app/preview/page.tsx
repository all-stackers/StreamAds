"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TwitterPreview: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPreview = async () => {
        try {
            setError(null); // Clear previous errors
            const response = await axios.get('http://127.0.0.1:5000/fetch-oembed', {
                params: { url },
            });
            console.log('Backend Response:', response.data);
            setPreviewHtml(response.data.html); // Set the HTML for preview
        } catch (err: any) {
            setError(`Error: ${err.response?.statusText || 'Unknown error'}`);
        }
    };

    // Function to load the Twitter widgets script
    const loadTwitterWidgets = () => {
        const script = document.createElement('script');
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);
    };

    // Use effect to load the script when previewHtml is updated
    useEffect(() => {
        if (previewHtml) {
            loadTwitterWidgets();
        }
    }, [previewHtml]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Twitter Tweet Preview</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter tweet URL"
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <button onClick={fetchPreview} style={{ padding: '10px' }}>
                Preview
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {previewHtml && (
                <div
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                    style={{ marginTop: '20px' }}
                />
            )}
        </div>
    );
};

export default TwitterPreview;
