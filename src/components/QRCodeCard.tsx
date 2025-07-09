import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Download, Maximize2, X, Building2, Utensils, GraduationCap, Heart, ShoppingBag, Plane, Home, Star, Wifi } from 'lucide-react';

interface QRCodeCardProps {
  card: {
    id: string;
    businessName: string;
    category: string;
    type: string;
    logoUrl: string;
    slug: string;
  };
}

const categoryThemes = {
  'Professional Businesses': {
    gradient: 'from-blue-600 via-purple-600 to-indigo-700',
    accent: 'blue-500',
    icon: Building2,
    emoji: '💼',
    pattern: 'circuit',
    bgColor: 'bg-slate-900',
    textColor: 'text-blue-100',
    cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    cardText: 'text-blue-900'
  },
  'Food & Beverage': {
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    accent: 'orange-500',
    icon: Utensils,
    emoji: '🍽️',
    pattern: 'food',
    bgColor: 'bg-orange-900',
    textColor: 'text-orange-100',
    cardBg: 'bg-gradient-to-br from-orange-50 to-red-100',
    cardText: 'text-orange-900'
  },
  'Education': {
    gradient: 'from-blue-800 via-indigo-700 to-purple-800',
    accent: 'blue-700',
    icon: GraduationCap,
    emoji: '🎓',
    pattern: 'academic',
    bgColor: 'bg-blue-900',
    textColor: 'text-blue-100',
    cardBg: 'bg-gradient-to-br from-blue-50 to-purple-100',
    cardText: 'text-blue-900'
  },
  'Health & Medical': {
    gradient: 'from-green-500 via-emerald-500 to-teal-600',
    accent: 'green-500',
    icon: Heart,
    emoji: '⚕️',
    pattern: 'medical',
    bgColor: 'bg-green-900',
    textColor: 'text-green-100',
    cardBg: 'bg-gradient-to-br from-green-50 to-teal-100',
    cardText: 'text-green-900'
  },
  'Retail & Shopping': {
    gradient: 'from-pink-500 via-purple-500 to-indigo-600',
    accent: 'pink-500',
    icon: ShoppingBag,
    emoji: '🛍️',
    pattern: 'shopping',
    bgColor: 'bg-pink-900',
    textColor: 'text-pink-100',
    cardBg: 'bg-gradient-to-br from-pink-50 to-purple-100',
    cardText: 'text-pink-900'
  },
  'Hotels & Travel': {
    gradient: 'from-sky-400 via-blue-500 to-cyan-600',
    accent: 'sky-500',
    icon: Plane,
    emoji: '✈️',
    pattern: 'travel',
    bgColor: 'bg-sky-900',
    textColor: 'text-sky-100',
    cardBg: 'bg-gradient-to-br from-sky-50 to-cyan-100',
    cardText: 'text-sky-900'
  },
  'Services': {
    gradient: 'from-gray-600 via-slate-600 to-zinc-700',
    accent: 'gray-500',
    icon: Home,
    emoji: '🔧',
    pattern: 'service',
    bgColor: 'bg-gray-900',
    textColor: 'text-gray-100',
    cardBg: 'bg-gradient-to-br from-gray-50 to-slate-100',
    cardText: 'text-gray-900'
  }
};

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ card }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadCardRef = useRef<HTMLDivElement>(null);
  const qrUrl = `${window.location.origin}/${card.slug}`;
  
  const theme = categoryThemes[card.category as keyof typeof categoryThemes] || categoryThemes['Services'];
  const IconComponent = theme.icon;

  const downloadFullCard = async () => {
    if (!downloadCardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(downloadCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 600
      });
      
      const link = document.createElement('a');
      link.download = `${card.businessName.replace(/[^a-zA-Z0-9]/g, '-')}-review-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const PatternBackground = () => {
    switch (theme.pattern) {
      case 'circuit':
        return (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id={`circuit-${card.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor"/>
                  <path d="M10,5 L10,15 M5,10 L15,10" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill={`url(#circuit-${card.id})`}/>
            </svg>
          </div>
        );
      case 'food':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 text-2xl">🍽️</div>
            <div className="absolute top-4 right-4 text-xl">🍕</div>
            <div className="absolute bottom-4 left-4 text-xl">☕</div>
            <div className="absolute bottom-2 right-2 text-2xl">🥘</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">🍰</div>
          </div>
        );
      case 'academic':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 text-2xl">📚</div>
            <div className="absolute top-4 right-4 text-xl">🎓</div>
            <div className="absolute bottom-4 left-4 text-xl">✏️</div>
            <div className="absolute bottom-2 right-2 text-2xl">🏫</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">📖</div>
          </div>
        );
      case 'medical':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 text-2xl">⚕️</div>
            <div className="absolute top-4 right-4 text-xl">🏥</div>
            <div className="absolute bottom-4 left-4 text-xl">💊</div>
            <div className="absolute bottom-2 right-2 text-2xl">🩺</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">❤️</div>
          </div>
        );
      case 'shopping':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 text-2xl">🛍️</div>
            <div className="absolute top-4 right-4 text-xl">🏪</div>
            <div className="absolute bottom-4 left-4 text-xl">💳</div>
            <div className="absolute bottom-2 right-2 text-2xl">🛒</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">🎁</div>
          </div>
        );
      case 'travel':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 text-2xl">✈️</div>
            <div className="absolute top-4 right-4 text-xl">🏨</div>
            <div className="absolute bottom-4 left-4 text-xl">🧳</div>
            <div className="absolute bottom-2 right-2 text-2xl">🗺️</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">🌍</div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 text-2xl">🔧</div>
            <div className="absolute top-4 right-4 text-xl">⚙️</div>
            <div className="absolute bottom-4 left-4 text-xl">🛠️</div>
            <div className="absolute bottom-2 right-2 text-2xl">🏢</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">💼</div>
          </div>
        );
    }
  };

  return (
    <>
      {/* QR Code Card */}
      <div className={`relative ${theme.bgColor} rounded-2xl p-6 shadow-2xl border border-white/10 overflow-hidden group hover:scale-105 transition-all duration-300`}>
        {/* Background Pattern */}
        <PatternBackground />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-20`}></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center mr-3 shadow-lg`}>
                <span className="text-2xl">{theme.emoji}</span>
              </div>
              <div>
                <h3 className={`font-bold ${theme.textColor} text-sm`}>QR Code</h3>
                <p className={`text-xs ${theme.textColor} opacity-70`}>{card.category}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFullscreen(true)}
                className={`p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 group-hover:scale-110`}
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={downloadFullCard}
                disabled={isDownloading}
                className={`p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 group-hover:scale-110 ${isDownloading ? 'opacity-50' : ''}`}
                title="Download Full Card"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative bg-white rounded-xl p-4 mb-4 group-hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <QRCode
                id={`qr-${card.id}`}
                value={qrUrl}
                size={120}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
                fgColor="#000000"
                bgColor="#ffffff"
              />
              
              {/* Larger Logo Overlay */}
              {card.logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full p-2 shadow-xl border-2 border-gray-100">
                    <img
                      src={card.logoUrl}
                      alt={`${card.businessName} logo`}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="text-center">
            <h4 className={`font-bold ${theme.textColor} text-sm mb-1 truncate`}>
              {card.businessName}
            </h4>
            <p className={`text-xs ${theme.textColor} opacity-70 mb-3`}>
              {card.type}
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400 mx-0.5" />
              ))}
            </div>
            
            <div className={`inline-flex items-center px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm`}>
              <Wifi className="w-3 h-3 mr-1.5 text-white" />
              <span className={`text-xs ${theme.textColor} font-medium`}>
                Scan to Review
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full opacity-30 blur-xl animate-pulse`}></div>
        <div className={`absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-r ${theme.gradient} rounded-full opacity-30 blur-xl animate-pulse delay-1000`}></div>
      </div>

      {/* Hidden Download Card */}
      <div className="fixed -top-[9999px] left-0 pointer-events-none">
        <div
          ref={downloadCardRef}
          className={`w-[400px] h-[600px] ${theme.cardBg} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {/* Background Pattern for Download Card */}
          <div className="absolute inset-0 opacity-5">
            <PatternBackground />
          </div>
          
          {/* Header Section */}
          <div className="relative z-10 text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${theme.gradient} rounded-2xl mb-4 shadow-lg`}>
              <span className="text-3xl">{theme.emoji}</span>
            </div>
            <h1 className={`text-2xl font-bold ${theme.cardText} mb-2`}>
              {card.businessName}
            </h1>
            <p className={`text-lg ${theme.cardText} opacity-70 mb-4`}>
              {card.type}
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500 mx-1" />
              ))}
            </div>
            
            <h2 className={`text-xl font-bold ${theme.cardText} mb-2`}>
              Review Us on Google
            </h2>
          </div>

          {/* QR Code Section */}
          <div className="relative z-10 flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="relative">
                <QRCode
                  value={qrUrl}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox="0 0 256 256"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
                
                {/* Larger Logo for Download */}
                {card.logoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full p-3 shadow-xl border-4 border-gray-100">
                      <img
                        src={card.logoUrl}
                        alt={`${card.businessName} logo`}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="relative z-10 text-center">
            <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${theme.gradient} rounded-full text-white font-bold text-lg mb-4 shadow-lg`}>
              <Wifi className="w-5 h-5 mr-2" />
              TAP or SCAN
            </div>
            <p className={`text-sm ${theme.cardText} opacity-70 leading-relaxed`}>
              Scan this QR code with your phone camera<br />
              or tap if you have NFC enabled
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-8 right-8 text-center">
            <p className={`text-xs ${theme.cardText} opacity-50`}>
              Powered by Review Automation System
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                  <span className="text-2xl">{theme.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{card.businessName}</h3>
                  <p className="text-gray-600">{card.type}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullscreen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="relative bg-white rounded-xl p-6">
                <QRCode
                  value={qrUrl}
                  size={300}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox="0 0 256 256"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
                
                {/* Larger Logo Overlay for Fullscreen */}
                {card.logoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full p-4 shadow-xl border-4 border-gray-100">
                      <img
                        src={card.logoUrl}
                        alt={`${card.businessName} logo`}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-1" />
                ))}
              </div>
              <p className="text-gray-600 mb-2 font-medium">Scan this QR code to leave a review</p>
              <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-2 rounded-lg break-all">
                {qrUrl}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFullscreen(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={downloadFullCard}
                disabled={isDownloading}
                className={`flex-1 px-4 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 ${isDownloading ? 'opacity-50' : ''}`}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};