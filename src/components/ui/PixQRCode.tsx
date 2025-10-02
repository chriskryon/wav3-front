import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/card';

interface PixQRCodeProps {
  value: string;
  size?: number;
}

export const PixQRCode: React.FC<PixQRCodeProps> = ({ value, size = 160 }) => {
  if (!value) return null;
  return (
    <Card
      className="flex flex-col items-center justify-center p-4 rounded-2xl border-0 bg-white/80 backdrop-blur-md mx-auto w-fit min-w-[180px] max-w-full"
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1.2px solid rgba(30,163,171,0.10)',
        boxShadow: '0 2px 8px 0 rgba(30,163,171,0.04)',
        backdropFilter: 'blur(12px)',
        transition: 'box-shadow 0.2s, border 0.2s',
      }}
    >
      <QRCodeSVG value={value} size={size} bgColor="#fff" fgColor="#222" />
      <span className="mt-2 text-xs text-[#00109b] font-mono">PIX QR Code</span>
    </Card>
  );
};
