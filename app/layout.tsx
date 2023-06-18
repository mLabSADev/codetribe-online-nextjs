'use client'

import { useEffect } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import firebase from 'firebase';

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fonts = [
    "K2D-Bold",
    "K2D-BoldItalic",
    "K2D-ExtraBold",
    "K2D-ExtraBoldItalic",
    "K2D-ExtraLight",
    "K2D-ExtraLightItalic",
    "K2D-Italic",
    "K2D-Light",
    "K2D-LightItalic",
    "K2D-Medium",
    "K2D-MediumItalic",
    "K2D-SemiBold",
    "K2D-SemiBoldItalic",
    "K2D-Thin",
    "K2D-ThinItalic",
  ]

  const config = {
    apiKey: "AIzaSyCSvPQ3-fpuAYGljNEBCrWTVO-yO9tepaU",
    authDomain: "mlab-22bb9.firebaseapp.com",
    databaseURL: "https://mlab-22bb9.firebaseio.com",
    projectId: "mlab-22bb9",
    storageBucket: "mlab-22bb9.appspot.com",
    messagingSenderId: "479164571450",
    appId: "1:479164571450:web:5d286c2c7e8eba82927a03",
  }

  if (firebase.apps.length == 0) {
    firebase.initializeApp(config)
  }
  

  return (
    <html lang="en">
      <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {fonts.map(font => {
          return (
            <link
              key={font}
              rel="preload"
              href={`/fonts/k2d/${font}.ttf`}
              as="font"
              crossOrigin="anonymous"
            />
          )
        })}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
