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
            className="object-contain"
            priority
        />
    );
};

export const RustLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeMap = {
        sm: 32,
        md: 48,
        lg: 64
    };

    return (
        <Image
            src="/rust-logo.png"
            alt="Rust Logo"
            width={sizeMap[size]}
            height={sizeMap[size]}
            className="object-contain"
            priority
        />
    );
};

export const ArbitrumLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeMap = {
        sm: 32,
        md: 48,
        lg: 64
    };

    return (
        <Image
            src="/arbitrum.png"
            alt="Arbitrum Logo"
            width={sizeMap[size]}
            height={sizeMap[size]}
            className="object-contain"
            priority
        />
    );
}
