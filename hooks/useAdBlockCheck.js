// hooks/useAdBlockCheck.js


import { useEffect, useState } from 'react';

const useAdBlockCheck = () => {
  const [hasAdBlocker, setHasAdBlocker] = useState(null);

  useEffect(() => {
    const checkIfUserIsBlockingAdsAsync = (() => {
      let adBlockDetected;

      return () => {
        if (typeof adBlockDetected !== 'undefined') {
          return Promise.resolve(adBlockDetected);
        }

        const url = 'https://tpc.googlesyndication.com/pagead/images/adchoices/en.png';

        return fetch(url, { mode: 'no-cors' })
          .then(() => {
            adBlockDetected = false;
          })
          .catch(() => {
            adBlockDetected = true;
          })
          .then(() => {
            setHasAdBlocker(adBlockDetected);
            return adBlockDetected;
          });
      };
    })();

    checkIfUserIsBlockingAdsAsync();
  }, []);

  return hasAdBlocker;
};

export default useAdBlockCheck;

