// hooks/useExtensionCheck.js

import { useEffect, useState, useRef } from 'react';

const useExtensionCheck = () => {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(null);
  const extensionTimeoutRef = useRef(null);

  useEffect(() => {
    const checkExtension = () => {
      const handleMessage = (event) => {
        if (event.data === 'extensionInstalled') {
          setIsExtensionInstalled(true);
          window.removeEventListener('message', handleMessage);
          clearTimeout(extensionTimeoutRef.current);
        }
      };

      window.addEventListener('message', handleMessage);

      extensionTimeoutRef.current = setTimeout(() => {
        window.postMessage('isExtensionInstalled', '*');
      }, 100);

      // Fallback to assume the extension is not installed if no message is received
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        setIsExtensionInstalled(false);
      }, 500); 
    };

    checkExtension();

    return () => {
      if (extensionTimeoutRef.current) {
        clearTimeout(extensionTimeoutRef.current);
      }
    };
  }, []);

  return isExtensionInstalled;
};

export default useExtensionCheck;
