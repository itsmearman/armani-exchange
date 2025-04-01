"use client";

import React, { JSX } from "react";
interface Gate {
  className?: string;
  onClick?: React.MouseEventHandler;
  color?: string;
  id?: string;
  fill?: string;
}

export const HamburgerMenu = ({
  className,
  color = "#000000",
}: Gate): JSX.Element => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40.1 22H7.9C6.85066 22 6 22.8507 6 23.9V24.1C6 25.1493 6.85066 26 7.9 26H40.1C41.1493 26 42 25.1493 42 24.1V23.9C42 22.8507 41.1493 22 40.1 22Z"
        fill={color}
      />
      <path
        d="M40.1 32H7.9C6.85066 32 6 32.8507 6 33.9V34.1C6 35.1493 6.85066 36 7.9 36H40.1C41.1493 36 42 35.1493 42 34.1V33.9C42 32.8507 41.1493 32 40.1 32Z"
        fill={color}
      />
      <path
        d="M40.1 12H7.9C6.85066 12 6 12.8507 6 13.9V14.1C6 15.1493 6.85066 16 7.9 16H40.1C41.1493 16 42 15.1493 42 14.1V13.9C42 12.8507 41.1493 12 40.1 12Z"
        fill={color}
      />
    </svg>
  );
};

export const HamburgerMenuclose = ({
  className,
  color = "#0001",
}: Gate): JSX.Element => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37.3412 32.8174L13.412 11.2713C12.6322 10.5692 11.4308 10.6322 10.7287 11.412L10.5948 11.5606C9.89268 12.3404 9.95564 13.5418 10.7355 14.2439L34.6647 35.7899C35.4445 36.4921 36.6459 36.4291 37.348 35.6493L37.4819 35.5007C38.184 34.7209 38.121 33.5195 37.3412 32.8174Z"
        fill={color}
      />
      <path
        d="M34.3412 11.2705L10.412 32.8165C9.63216 33.5187 9.5692 34.7201 10.2713 35.4999L10.4052 35.6485C11.1073 36.4283 12.3087 36.4913 13.0885 35.7891L37.0178 14.2431C37.7976 13.541 37.8605 12.3396 37.1584 11.5598L37.0246 11.4112C36.3224 10.6314 35.121 10.5684 34.3412 11.2705Z"
        fill={color}
      />
    </svg>
  );
};

export const LightMode = ({
  className,
  color = "#1C274C",
}: Gate): JSX.Element => {
  return (
    <svg
      width="28px"
      height="28px"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM3.66865 3.71609C3.94815 3.41039 4.42255 3.38915 4.72825 3.66865L6.95026 5.70024C7.25596 5.97974 7.2772 6.45413 6.9977 6.75983C6.7182 7.06553 6.2438 7.08677 5.9381 6.80727L3.71609 4.77569C3.41039 4.49619 3.38915 4.02179 3.66865 3.71609ZM20.3314 3.71609C20.6109 4.02179 20.5896 4.49619 20.2839 4.77569L18.0619 6.80727C17.7562 7.08677 17.2818 7.06553 17.0023 6.75983C16.7228 6.45413 16.744 5.97974 17.0497 5.70024L19.2718 3.66865C19.5775 3.38915 20.0518 3.41039 20.3314 3.71609ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM17.0255 17.0252C17.3184 16.7323 17.7933 16.7323 18.0862 17.0252L20.3082 19.2475C20.6011 19.5404 20.601 20.0153 20.3081 20.3082C20.0152 20.6011 19.5403 20.601 19.2475 20.3081L17.0255 18.0858C16.7326 17.7929 16.7326 17.3181 17.0255 17.0252ZM6.97467 17.0253C7.26756 17.3182 7.26756 17.7931 6.97467 18.086L4.75244 20.3082C4.45955 20.6011 3.98468 20.6011 3.69178 20.3082C3.39889 20.0153 3.39889 19.5404 3.69178 19.2476L5.91401 17.0253C6.2069 16.7324 6.68177 16.7324 6.97467 17.0253ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z"
        fill={color}
      />
    </svg>
  );
};

export const DarkMode = ({ className }: Gate): JSX.Element => {
  return (
    <svg
      width="28px"
      height="28px"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        // fill={color}
      />
    </svg>
  );
};

export const Trade = ({ className = "w-8 h-8" }: Gate): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};


export const Price = ({ className = "w-8 h-8" }: Gate): JSX.Element => {
  return (
<svg
xmlns="http://www.w3.org/2000/svg"
className="h-8 w-8"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
>
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
/>
</svg>  );
};


export const Security = ({ className = "w-8 h-8" }: Gate): JSX.Element => {
  return (
<svg
xmlns="http://www.w3.org/2000/svg"
className="h-8 w-8"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
>
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
/>
</svg>
  );
};
