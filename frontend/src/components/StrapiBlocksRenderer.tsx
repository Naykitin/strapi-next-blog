"use client";

type TextChild = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkChild = {
  type: "link";
  url: string;
  children?: InlineChild[];
};

type InlineChild = TextChild | LinkChild;

type Block = {
  type: string;
  level?: number;
  format?: "ordered" | "unordered";
  children?: Array<Block | InlineChild>;
};

function renderInline(children: InlineChild[] = []) {
  return children.map((child, index) => {
    if (child.type === "link") {
      return (
        <a
          key={index}
          href={child.url}
          className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
          rel="noreferrer"
          target={child.url.startsWith("http") ? "_blank" : undefined}
        >
          {renderInline(child.children)}
        </a>
      );
    }

    let content: React.ReactNode = child.text;

    if (child.code) {
      content = (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
          {content}
        </code>
      );
    }

    if (child.bold) content = <strong>{content}</strong>;
    if (child.italic) content = <em>{content}</em>;
    if (child.underline) content = <u>{content}</u>;
    if (child.strikethrough) content = <s>{content}</s>;

    return <span key={index}>{content}</span>;
  });
}

function getTextChildren(block: Block) {
  return (block.children || []).filter(
    (child): child is InlineChild =>
      child.type === "text" || child.type === "link"
  );
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "heading": {
      const children = renderInline(getTextChildren(block));

      if (block.level === 1) {
        return (
          <h1 key={index} className="mt-10 text-4xl font-bold text-gray-950 dark:text-gray-50">
            {children}
          </h1>
        );
      }

      if (block.level === 2) {
        return (
          <h2 key={index} className="mt-10 text-3xl font-bold text-gray-950 dark:text-gray-50">
            {children}
          </h2>
        );
      }

      return (
        <h3 key={index} className="mt-8 text-2xl font-semibold text-gray-950 dark:text-gray-50">
          {children}
        </h3>
      );
    }

    case "paragraph":
      return (
        <p key={index} className="text-lg leading-8 text-gray-700 dark:text-gray-300">
          {renderInline(getTextChildren(block))}
        </p>
      );

    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-blue-500 pl-5 text-xl font-medium italic leading-8 text-gray-800 dark:text-gray-200"
        >
          {renderInline(getTextChildren(block))}
        </blockquote>
      );

    case "list": {
      const ListTag = block.format === "ordered" ? "ol" : "ul";
      const listClass =
        block.format === "ordered"
          ? "list-decimal space-y-3 pl-6 text-lg leading-8 text-gray-700 dark:text-gray-300"
          : "list-disc space-y-3 pl-6 text-lg leading-8 text-gray-700 dark:text-gray-300";

      return (
        <ListTag key={index} className={listClass}>
          {(block.children || []).map((item, itemIndex) => (
            <li key={itemIndex}>
              {"children" in item ? renderInline(getTextChildren(item as Block)) : null}
            </li>
          ))}
        </ListTag>
      );
    }

    case "code":
      return (
        <pre
          key={index}
          className="overflow-x-auto rounded-lg bg-gray-950 p-5 text-sm leading-7 text-gray-100"
        >
          <code>{getTextChildren(block).map((child) => child.type === "text" ? child.text : "").join("")}</code>
        </pre>
      );

    default:
      return null;
  }
}

export function StrapiBlocksRenderer({ content }: { content?: Block[] | null }) {
  if (!content?.length) {
    return (
      <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
        This post does not have any content yet.
      </p>
    );
  }

  return <div className="space-y-6">{content.map(renderBlock)}</div>;
}
