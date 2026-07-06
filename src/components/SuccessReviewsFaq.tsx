import React, { useState } from 'react';
import { SuccessCase, Review, Faq } from '../types';
import { ChevronDown, ChevronUp, Star, Quote, User } from 'lucide-react';

interface SuccessReviewsFaqProps {
  successCases: SuccessCase[];
  reviews: Review[];
  faqs: Faq[];
  accentColor: string;
}

export default function SuccessReviewsFaq({ successCases, reviews, faqs, accentColor }: SuccessReviewsFaqProps) {
  // FAQ Accordion State (stores ID of open FAQ, or null)
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  return (
    <div className="flex flex-col">
      {/* ---------------- CUSTOMER REVIEWS SECTION ---------------- */}
      <section id="reviews" className="py-24 bg-[#071A3D] relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,41,84,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-[0.2em] text-blue-400 uppercase">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              고객사 대표님들이 전하는 고마운 말씀
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 mx-auto rounded-full mt-2" />
          </div>

          {/* Grid Layout for Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((item) => (
              <div 
                key={item.id} 
                className="glass-card p-8 rounded-3xl relative flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300"
              >
                <Quote className="text-blue-500/5 absolute top-6 right-6" size={40} />
                
                <div className="flex flex-col gap-5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed font-normal">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">
                        인증 완료 고객사
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        인증 완료
                      </span>
                    </div>
                    <span className="text-xs text-white/40 mt-1 block">
                      실제 GC파트너스 진행 고객
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ACCORDION SECTION ---------------- */}
      <section id="faq" className="py-24 bg-[#051430] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-[0.2em] text-blue-400 uppercase">
              FAQ ACCORDION
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              정책자금에 관한 솔직하고 속 시원한 답변
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 mx-auto rounded-full mt-2" />
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-3.5">
            {faqs.length === 0 ? (
              <div className="py-8 text-center text-white/50">
                등록된 FAQ 자주묻는 질문이 없습니다.
              </div>
            ) : (
              faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="glass-card rounded-2xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left py-5 px-6 flex justify-between items-center gap-4 text-white hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-blue-400 select-none">Q</span>
                        <span className="font-bold text-xs sm:text-sm tracking-tight">{faq.question}</span>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-white/70" /> : <ChevronDown size={16} className="text-white/70" />}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-white/10 pt-5 bg-white/[0.02] text-white/70 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                        <div className="flex gap-3">
                          <span className="text-sm font-black text-[#60a5fa] select-none">A</span>
                          <div>{faq.answer}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
