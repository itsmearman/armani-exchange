"use client";

import React , {JSX} from "react";
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

