import React from "react";

type AnimatedTextProps = {
  title: string;
  texts: string[];
  duration?: number;
};

export const AnimatedText = ({
  title,
  texts,
  duration = 2,
}: AnimatedTextProps) => {
  const totalDuration = texts.length * duration;

  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <h1
      data-aos="fade-up-sm"
      className="mb-4 text-h3 lg:text-h1 items-center justify-center gap-x-2"
    >
      <span className="inline">{title}: </span>
      <span className="relative inline-flex">
        <span className="relative inline-flex flex-col overflow-clip">
          <span className="invisible inline" aria-hidden="true">
            {longestText}
          </span>

          {texts.map((text, index) => (
            <span
              key={`${text}-${index}`}
              className="animated-text-item text-center absolute top-0 left-0 whitespace-nowrap bg-gradient-to-br from-primary to-cyan-500 text-transparent bg-clip-text"
              style={{
                animationDuration: `${totalDuration}s`,
                animationDelay: `${index * duration}s`,
                minWidth: `${longestText.length * 10}px`,
              }}
            >
              {text}
              {index !== texts.length - 1 && (
                <span className="inline opacity-0">,&nbsp;</span>
              )}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
};
