import React from 'react';
import Image from 'next/image';

export const RaccoonLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeMap = {
        sm: 32,
        md: 48,
        lg: 64
    };

    return (
        <Image
            src="/raystylus-logo.png"
            alt="RayStylus Logo"
            width={sizeMap[size]}
            height={sizeMap[size]}
            className="rounded-full"
            priority
        />
    );
};
