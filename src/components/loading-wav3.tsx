import Image from 'next/image';
import logo from '../app/logo.svg';

const Wav3Loading = () => (
    <div className="flex flex-col items-center justify-center h-full animate-pulse">
        <Image
            src={logo}
            alt="WAV3 Logo"
            width={64}
            height={64}
            className="object-contain transition-all duration-500 ease-in-out"
        />
    </div>
);

export default Wav3Loading;