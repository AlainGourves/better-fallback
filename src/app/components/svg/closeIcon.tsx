import { SVGProps } from "react"
const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%"  height="100%" {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2}>
      <path d="m6 6 12 12M18 6 6 18" />
    </g>
  </svg>
)
export default CloseIcon;
