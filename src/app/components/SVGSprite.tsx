import * as React from "react";
import type { SVGProps } from "react";
const SVGSprite = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={0} height={0} {...props}>
    <defs>
      <symbol
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="alert-triangle"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </symbol>
      <symbol
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="check"
      >
        <path d="M4 12 l5 5l11-11" />
      </symbol>
      <symbol
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="code"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </symbol>
      <symbol
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="copy"
      >
        <rect width={14} height={14} x={8} y={8} rx={2} ry={2} />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </symbol>
      <symbol
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="download"
      >
        <g id="arrow">
          <polyline points="7 10 12 15 17 10" />
          <line x1={12} x2={12} y1={15} y2={3} />
        </g>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      </symbol>
      <symbol viewBox="0 0 100 100" id="font-file">
        <path
          fill="#c1c4ba"
          d="M90.68 32.32 66.67 8.65c-2.47-2.85-4.8-3.68-8.37-3.68-.14 0-.27.02-.41.03H13c-4.42 0-8 3.58-8 8v74c0 4.42 3.58 8 8 8h74c4.42 0 8-3.58 8-8V41.73c0-3.8-1.07-6.61-4.32-9.41z"
        />
        <path
          fill="#1c2013e5"
          d="M52.01 77.33v-3.3c.75-.11 1.54-.21 2.38-.32.83-.11 1.58-.23 2.25-.36s1.22-.29 1.65-.48.64-.39.64-.6c0-.27-.07-.58-.2-.93s-.28-.74-.44-1.17l-3.54-9.82c-.21-.59-.75-1.01-1.61-1.25s-1.75-.36-2.66-.36H38.73c-1.72 0-2.77.54-3.14 1.61l-2.58 8.21c-.11.27-.19.56-.24.89-.05.32-.08.67-.08 1.05 0 2.09 2.28 3.14 6.84 3.14v3.7H20.78v-3.7c3.01-.21 5.23-2.04 6.68-5.47l19.08-45.5 7.49 1.05L72.79 70.9c.21.59.56 1.07 1.05 1.45.48.38 1.03.67 1.65.89a16.298 16.298 0 0 0 3.74.8v3.3H52.02zm-6.44-41.46-6.36 15.38c-.59 1.29-.89 2.09-.89 2.42 0 .43.83.64 2.5.64h9.9c1.29 0 1.93-.11 1.93-.32 0-.27-.51-1.72-1.53-4.35l-5.56-13.77z"
        />
        <path
          fill="#f3f5ef"
          d="M66.68 8.66c2.67 2.63 4.37 6.42 5.15 10.29s3.71 6.8 7.45 7.69c4.18.99 8.23 2.85 11.4 5.69L66.67 8.66z"
        />
      </symbol>
      <symbol viewBox="0 0 24 24" id="reset">
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5.96 5.24V9h3.76" />
          <path d="M5.96 9a6.73 6.73 0 0 1 12.78 3c0 3.72-3.02 6.74-6.74 6.74s-6.46-2.75-6.72-6.24" />
        </g>
      </symbol>
      <symbol
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="x-circle"
      >
        <circle cx={12} cy={12} r={10} />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </symbol>
    </defs>
  </svg>
);
export default SVGSprite;
