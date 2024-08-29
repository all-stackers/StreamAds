"use client";
// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import axios from 'axios';


// interface Tweet {
//   text: string;
//   author: string;
//   created_at: string;
//   public_metrics: {
//     like_count: number;
//     retweet_count: number;
//     reply_count: number;
//   };
// }

const TwitterPreview: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchPreview = async () => {
      try {
        setError(null); // Clear previous errors
        const response = await axios.get('http://127.0.0.1:5000/fetch-oembed', {
          params: { url },
        });
        setPreview(response.data.html); // Set the HTML for preview
      } catch (err: any) {
        setError(`Error: ${err.response?.statusText || 'Unknown error'}`);
      }
    };
  
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
        {preview && (
          <div
            dangerouslySetInnerHTML={{ __html: preview }}
            style={{ marginTop: '20px' }}
          />
        )}
      </div>
    );
};

export default TwitterPreview;