import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8"/>
        <link rel="icon" type="image" href="/logoWhiteBG.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="theme-color" content="#000000"/>
        <title>Condo Vision</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
