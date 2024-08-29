"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Tweet {
  text: string;
  author: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
}

const TwitterPreview: React.FC = () => {
  const [twitterUrl, setTwitterUrl] = useState('');
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractTweetId = (url: string): string | null => {
    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const fetchTweet = async () => {
    const tweetId = extractTweetId(twitterUrl);
    if (!tweetId) {
      setError('Invalid Twitter/X URL');
      setTweet(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`);

      if (!response.ok) {
        throw new Error('Failed to fetch tweet');
      }

      const data = await response.json();
      setTweet({
        text: data.text,
        author: data.user.name,
        created_at: new Date(data.created_at).toLocaleString(),
        public_metrics: {
          like_count: data.favorite_count,
          retweet_count: data.retweet_count,
          reply_count: data.reply_count || 0,
        },
      });
    } catch (err) {
      console.error('Error fetching tweet:', err);
      setError('Error fetching tweet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Input
        type="text"
        placeholder="Enter Twitter/X URL"
        value={twitterUrl}
        onChange={(e) => setTwitterUrl(e.target.value)}
        className="w-full max-w-md"
      />
      <Button onClick={fetchTweet} disabled={loading}>
        {loading ? 'Loading...' : 'Show Preview'}
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={!tweet}>Open Preview</Button>
        </DialogTrigger>
        <DialogContent className="w-[300px] h-[300px] overflow-y-auto">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : tweet ? (
            <Card>
              <CardContent className="pt-4">
                <p className="font-bold">{tweet.author}</p>
                <p className="text-sm text-gray-500">{tweet.created_at}</p>
                <p className="mt-2">{tweet.text}</p>
                <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                  <span>♥ {tweet.public_metrics.like_count}</span>
                  <span>🔁 {tweet.public_metrics.retweet_count}</span>
                  <span>💬 {tweet.public_metrics.reply_count}</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>Enter a valid Twitter/X URL and click "Show Preview"</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TwitterPreview;