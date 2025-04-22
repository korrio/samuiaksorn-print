"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// You'll need to install these packages:
// npm install qrcode.react

import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ baseUrl = "" }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [fullUrl, setFullUrl] = useState("");

    useEffect(() => {
        // Get the base URL (we can't access window during SSR)
        const host = baseUrl || window.location.origin;

        // Construct the full URL
        const queryString = searchParams ? .toString() ?
            `?${searchParams.toString()}` :
            '';

        const currentUrl = `https://print.erpsamuiaksorn.com/N1234`;
        setFullUrl(currentUrl);
    }, [pathname, searchParams, baseUrl]);

    return (
        <div className="flex flex-col items-center  border rounded-lg shadow-sm">
      { /*<h2 className="mb-4 text-lg font-medium">Scan this QR Code</h2>*/}
      {fullUrl ? (
        <div className="bg-white rounded-md">
          <QRCodeSVG
            value={fullUrl}
            size={120}
            level="H" // High error correction capability
            includeMargin
          />
        </div>
      ) : (
        <div className="w-48 h-48 bg-gray-200 animate-pulse"></div>
      )}
      { /*<p className="mt-3 text-sm text-gray-600 break-all">{fullUrl}</p>*/}
    </div>
    );
};

export default QRCodeGenerator;