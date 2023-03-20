import React from 'react';
import { useRouter } from 'next/router';

import '../styles/styles.css';

export default function App({ Component, pageProps}) {
  const router = useRouter();
  return (
    <Component {...pageProps} key={router.asPath}/>
  );
}