"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { Search24Regular } from "@fluentui/react-icons";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function UrlInput({ onSubmit, isLoading = false }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let processedUrl = url.trim();

    if (!processedUrl) {
      setError("Ange en webbadress");
      return;
    }

    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    try {
      new URL(processedUrl);
      onSubmit(processedUrl);
    } catch {
      setError("Ogiltig webbadress");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            size="large"
            disabled={isLoading}
            style={{ flex: 1 }}
            contentBefore={<Search24Regular />}
          />
          <Button
            appearance="primary"
            size="large"
            type="submit"
            disabled={isLoading}
            icon={isLoading ? <Spinner size="tiny" /> : undefined}
          >
            {isLoading ? "Analyserar..." : "Analysera"}
          </Button>
        </div>
        {error && <Text style={{ color: "var(--colorPaletteRedForeground1)" }}>{error}</Text>}
      </div>
    </form>
  );
}
