export function toSentenceCase(input: string): string {
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    return "";
  }

  const sentences = trimmedInput.split(/(?<=[.!?])\s+/);

  const sentenceCased = sentences.map((sentence) => {
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  });

  return sentenceCased.join(" ");
}

export function extractBracketContent(subject: string): string | null {
  const regex = /\[(.*?)\]/;
  const match = regex.exec(subject);
  return match?.[1] ?? "BMAT102L"; // Make sure it works when URL is done from the backend
}

export function extractWithoutBracketContent(subject: string): string {
  return subject.replace(/\s*\[.*?\]\s*/g, "").trim();
}

export function capsule(data: string) {
  return (
    <div className="rounded-sm bg-[#B2B8FF] p-1 px-3 text-sm dark:bg-[#7480FFCC]">
      {data}
    </div>
  );
}
export function capsuleGreen(data: string) {
  return <div className="rounded-md bg-[#3cc923] p-1 px-3 text-sm">{data}</div>;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
