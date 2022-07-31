import React from 'react';

const Highlight = ({
  text,
  keywords,
}: {
  text: string;
  keywords: string[];
}) => {
  return (
    <div
      dangerouslySetInnerHTML={(() => {
        keywords.forEach((keyword) => {
          text = highlightSearchResult(keyword, text);
        });
        return { __html: text };
      })()}
    />
  );
};

export default Highlight;

const highlightSearchResult = (query: string, text: string) => {
  const regexp = new RegExp(`(${query})`, 'gi');
  text = text.replace(regexp, '<span style="background: yellow;">$1</span>');
  return text;
};
