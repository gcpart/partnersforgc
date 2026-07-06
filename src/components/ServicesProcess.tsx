import React, { useState } from 'react';
import { ServiceCard } from '../types';
import LucideIcon from './LucideIcon';
import { Sparkles, CheckCircle2, ChevronRight, X, ArrowRight } from 'lucide-react';

interface ServicesProcessProps {
  services: ServiceCard[];
  accentColor: string;
}

export default function ServicesProcess({ services, accentColor }: ServicesProcessProps) {
  const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);

  const activeServices = services.filter(s => s.active && s.id !== 'srv-2' && s.id !== 'srv-4');

  const processSteps = [
    {
      num: '01',
      title: '상담 신청 접수',
      desc: '공식 홈페이지 또는 대표번호 010-2970-2613을 통해 기업 기본 정보 및 조달 요구 사안에 대해 24시간 간편 상담을 접수합니다.'
    },
    {
      num: '02',
      title: '기업 정밀 분석 및 자가진단',
      desc: '담당 팀장이 배정되어 최근 3개년 재무제표 정밀 판독, 부채 비율 검증, 특허 현황 및 고용 증가 추이를 1차 종합 진단합니다.'
    },
    {
      num: '03',
      title: '최적 정책자금 매칭 및 설계',
      desc: '중진공, 신용보증기금, 기술보증기금 등 300여 개 정책 사업 중 승인 확률이 90%를 초과하는 최적의 보조금 및 융자를 매칭 설계합니다.'
    },
    {
      num: '04',
      title: '사업계획서 작성 및 가점 보완',
      desc: '심사역들이 이목을 집중할 정량적 기술 평가지표 설계, 대표자 신용 점수 세부 교정, 기업부설연구소 신설 등의 사전 가점을 보강합니다.'
    },
    {
      num: '05',
      title: '신청서 제출 및 실사 배정',
      desc: '기관 신청서 접수 이후, 현장 실사단 방문 시 예상 질문 리허설 및 프레젠테이션 발표 피칭 트레이닝을 1:1로 초밀착 전수합니다.'
    },
    {
      num: '06',
      title: '자금 조달 승인 및 철저한 사후관리',
      desc: '성공적인 자금 입금 확인 이후, 복잡한 보조금 정산 보고 가이드를 제공하며 차년도 대환 대출 및 후속 R&D 연계 로드맵을 가동합니다.'
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ---------------- SERVICES SECTION ---------------- */}
      <section id="services" className="py-24 bg-[#051430] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
                {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeServices.length === 0 ? (
              <div className="col-span-full py-12 text-center text-white/50">
                노출 가능한 서비스 소개 카드가 없습니다. 관리자 대시보드에서 등록해주세요.
              </div>
            ) : (
              activeServices.map((srv) => (
                <div 
                  key={srv.id}
                  className="glass-card p-6 rounded-2xl flex flex-col justify-between group"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <LucideIcon name={srv.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed mt-2 line-clamp-4">
                        {srv.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedService(srv)}
                    className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors self-start cursor-pointer group/btn"
                  >
                    자세히 보기
                    <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS SECTION ---------------- */}
      <section id="process" className="py-24 bg-[#071A3D] relative overflow-hidden">
        {/* Abstract curve background vector graphics */}
        <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute left-0 bottom-1/4 w-96 h-96 rounded-full bg-blue-950/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-[0.2em] text-blue-400 uppercase">
              CONSULTING TIMELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              자금 조달 승인까지 안전하게 안내하는 6단계 절차
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 mx-auto rounded-full mt-2" />
            <p className="text-white/50 text-sm leading-relaxed mt-2">
              신속하고 명확합니다. 불필요한 서류 낭비를 줄이고 승인 확률을 선제적으로 타겟팅하여 원스톱 패스트트랙으로 인도해 드립니다.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            
            {processSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="glass-card p-6 rounded-2xl relative flex flex-col gap-4 group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded">
                    STEP {step.num}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-all">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ---------------- SERVICE DETAILED MODAL ---------------- */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 text-blue-400 flex items-center justify-center shrink-0">
                <LucideIcon name={selectedService.icon} size={24} />
              </div>
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Service Details</span>
                <h3 className="font-extrabold text-white text-xl">{selectedService.title}</h3>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-300">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">기본 프로그램 요약</h4>
                <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedService.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">상세 실행 방안 및 핵심 솔루션</h4>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 text-xs whitespace-pre-wrap leading-relaxed text-slate-300 font-normal">
                  {selectedService.detailedDescription || '상세 세부 커리큘럼 분석서 및 승인 가점 지도가 배정 예정입니다. 개별 유선 상담을 남겨 주시면 맞춤 제안서를 즉각 교부해 드리겠습니다.'}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5 flex justify-end gap-3.5">
              <button
                onClick={() => setSelectedService(null)}
                className="py-2.5 px-5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                창 닫기
              </button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  const element = document.getElementById('inquiry');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="py-2.5 px-5 text-xs font-bold text-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
                style={{ backgroundColor: accentColor }}
              >
                이 서비스 1:1 진단 요청
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
