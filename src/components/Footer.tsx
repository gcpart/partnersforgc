import React from 'react';
import { SiteSettings } from '../types';
import { ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  siteSettings: SiteSettings;
  accentColor: string;
}

export default function Footer({ siteSettings, accentColor }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071A3D]/90 backdrop-blur-md border-t border-white/10 py-12 text-white/60 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Top bar with back to top */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-sm flex items-center justify-center text-white font-extrabold text-sm"
                style={{ backgroundColor: accentColor }}
              >
                G
              </div>
              <span className="font-bold text-white text-base tracking-tight uppercase italic">
                GC <span className="font-light text-white/70">Partners</span>
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1.5 font-medium">
              국가 정책 자금 보증승인 극대화 가이드라인 특허 보유 전문 기업
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 hover:bg-white/10"
          >
            맨 위로
            <ArrowUp size={13} />
          </button>
        </div>

        {/* Corporate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-white/50 text-xs">
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-white/40 mr-2">상호명:</span> <span className="text-white/80 font-semibold">{siteSettings.siteName}</span>
              <span className="text-white/40 mx-2">|</span>
              <span className="text-white/40 mr-2">대표자:</span> <span className="text-white/80 font-semibold">{siteSettings.ceoName}</span>
              <span className="text-white/40 mx-2">|</span>
              <span className="text-white/40 mr-2">사업자등록번호:</span> <span className="text-white/80 font-semibold">{siteSettings.businessNumber}</span>
            </div>
            <div>
              <span className="text-white/40 mr-2">본사 주소:</span> <span className="text-white/80">{siteSettings.address}</span>
            </div>
            <div>
              <span className="text-white/40 mr-2">대표번호:</span> <span className="text-white font-bold">{siteSettings.phone}</span>
              <span className="text-white/40 mx-2">|</span>
              <span className="text-white/40 mr-2">문의 이메일:</span> <span className="text-white/80 font-semibold">{siteSettings.email}</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl flex items-start gap-3 hover:bg-white/5 transition-all">
            <ShieldCheck size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-normal flex flex-col gap-1 text-[10px] text-white/40">
              <span className="font-bold text-white/80 text-xs mb-0.5">불법 브로커 신고 안내 및 면책 공고</span>
              <p>
                {siteSettings.siteName}는 중소벤처기업진흥공단, 신용보증기금, 기술보증기금의 공인된 규율을 철저히 엄수합니다. 불합리한 성공 보수를 알선하는 허위 서류 대필 브로커 수수료 수급은 법적 처벌 사유가 될 수 있으며, 당사는 어떠한 불법 편법 행위도 취급하지 않습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Copyrights */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-white/30 border-t border-white/5 pt-6">
          <span>
            &copy; 2026 {siteSettings.siteName}. All Rights Reserved. Powered by GC Partners Financial Consulting Group.
          </span>
          <div className="flex gap-4">
            <span className="hover:text-white/60 cursor-pointer">개인정보처리방침</span>
            <span className="hover:text-white/60 cursor-pointer">이용약관</span>
            <span className="hover:text-white/60 cursor-pointer">이메일무단수집거부</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
