import React from "react";
import './index.css'

export default function RootLayout({ children } : any) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8"/>
            <link rel="icon" type="image/png" href="/logoWhiteBG.png"/>
            <meta name="theme-color" content="#000000"/>
            <title>Condo Vision</title>
        </head>
        <body>{children}</body>
        </html>
    )
}