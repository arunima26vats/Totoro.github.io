import { useCallback, useEffect, useState } from 'react';
import { generateTopicSummary } from '../services/aiService';

export default function SummaryGenerator({ defaultTopic = '' }) {
  const [topic, setTopic] = useState(defaultTopic);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  useEffect(() => {
    setTopic(defaultTopic);
  }, [defaultTopic]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await generateTopicSummary(topic, customApiKey);
      setSummary(response);
    } catch (generationError) {
      setError(generationError.message);
      setSummary('');
    } finally {
      setLoading(false);
    }
  }, [topic, customApiKey]);

  return (
    <section className="section-card">
      <div className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-coral-500">
            AI Summary
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Generate a quick study recap</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter a topic and get an AI-generated summary to help with revision, note cleanup, and
            last-minute preparation.
          </p>
        </div>

        <div className="w-full space-y-5">
          <div className="space-y-4">
            <label htmlFor="topic" className="mb-2 block text-sm font-semibold text-slate-700">
              Topic
            </label>
            <input
              id="topic"
              className="input-field"
              placeholder="Example: Binary Search Trees"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm font-semibold text-slate-600 hover:text-slate-900"
              onClick={() => setShowApiKeyInput((prev) => !prev)}
            >
              <span>Use your own Groq API key (optional)</span>
              <span className="ml-2 text-xs text-slate-400">{showApiKeyInput ? '▲ Hide' : '▼ Show'}</span>
            </button>

            {showApiKeyInput && (
              <div className="mt-3 space-y-2">
                <input
                  id="customApiKey"
                  type="password"
                  className="input-field"
                  placeholder="Paste your Groq API key here"
                  value={customApiKey}
                  onChange={(event) => setCustomApiKey(event.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Leave blank to use the default key. Your key is never stored or sent anywhere
                  except the Groq API.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Generating summary...' : 'Generate summary'}
          </button>

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="w-full overflow-x-auto rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Output
            </p>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-slate-700 sm:text-base">
              {summary || 'Your generated summary will appear here.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
