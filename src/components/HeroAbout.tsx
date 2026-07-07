import React from 'react';
import { ShieldCheck, Users, Briefcase, TrendingUp, BarChart2 } from 'lucide-react';

interface HeroAboutProps {
  accentColor: string;
  siteName: string;
}

export default function HeroAbout({ accentColor, siteName }: HeroAboutProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* ----------------- HERO SECTION ----------------- */}
      <section 
        id="hero" 
        className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-radial"
        style={{ 
          background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.18) 0%, rgba(7, 26, 61, 1) 70%)' 
        }}
      >
        {/* Floating background grids for modern look */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl flex flex-col gap-7 animate-fade-in text-center md:text-left mx-auto md:mx-0">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest self-center md:self-start shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              정책자금 무상지원사업 승인 매칭 전문
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              소상공인의 성장을 위한<br />
              최고의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">정책자금 파트너</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/60 font-medium leading-relaxed max-w-xl">
              정부지원사업 · 정책자금 · 기업인증 · R&D지원 · 경영컨설팅 전문.<br />
              귀사의 성공 가점을 정밀하게 보완하여 최단기간 보증 승인을 선도합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center md:justify-start">
              <button
                onClick={() => scrollToSection('inquiry')}
                className="py-4 px-8 font-bold text-sm bg-white text-[#071A3D] rounded-lg shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
              >
                무료 자금 진단 신청
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="py-4 px-8 font-bold text-sm bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer text-center"
              >
                당사 핵심 서비스 확인
              </button>
            </div>
          </div>
        </div>

        {/* Diagonal visual slice decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#071A3D] to-transparent pointer-events-none" />
      </section>

      {/* ----------------- ABOUT SECTION (회사소개) ----------------- */}
      <section id="about" className="py-24 bg-[#071A3D] relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-[0.2em] text-blue-400 uppercase">
              ABOUT GC PARTNERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              신뢰와 전문성으로 기업의 비전을 매칭합니다
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 mx-auto rounded-full mt-2" />
            <p className="text-white/50 text-sm leading-relaxed mt-2 max-w-2xl mx-auto">
              GC파트너스는 시시각각 변화하는 정부 300여 개 부처 지원 요건을 정확히 포착하여 중소벤처기업이 적기에 최적의 성장을 마주할 수 있도록 법률, 세무, 금융, 공학적 역량을 복합 투입합니다.
            </p>
          </div>

          {/* Core Values Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { 
                icon: ShieldCheck, 
                title: '안전성 (Durable Security)', 
                desc: '불법 브로커나 허위 사업계획서 대필 등 법적 소지가 있는 리스크를 100% 배제하고, 합법적인 정관 설계와 공식 가이드 기반의 클린 컨설팅을 집행합니다.' 
              },
              { 
                icon: Users, 
                title: '정밀 진단 전문가 (Expert Board)', 
                desc: '현장 경험이 풍부한 전문가들이 직접 기업의 장단점을 발췌하여 성과를 이끌어 냅니다.' 
              },
              { 
                icon: BarChart2, 
                title: '가점 사전 보완 (Pre-scoring)', 
                desc: '기업 인증(벤처, 연구소 등)과 특허 포트폴리오를 자금 신청 전 최우선 세팅하여, 경쟁 기업 대비 심사 배점을 극대화하는 선제적 전략 매칭 시스템을 영위합니다.' 
              }
            ].map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-white text-base">{v.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>



        </div>
      </section>
    </div>
  );
}

// Simple fallback Icon for Sparkle decoration
function SparkleIcon({ size = 16, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M3 12h3M18 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
    </svg>
  );
}
