import React, { useState } from 'react';
import { ServiceCard, Faq } from '../types';
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, HelpCircle, Briefcase, Sparkles, CheckSquare, Square, Save, Eye, EyeOff } from 'lucide-react';
import LucideIcon from './LucideIcon';

interface AdminServicesFAQProps {
  services: ServiceCard[];
  onUpdateServices: (updated: ServiceCard[]) => void;
  faqs: Faq[];
  onUpdateFaqs: (updated: Faq[]) => void;
}

const AVAILABLE_ICONS = ['Coins', 'Rocket', 'FileText', 'Award', 'Cpu', 'Briefcase', 'TrendingUp', 'Compass', 'HelpCircle', 'ShieldCheck', 'Globe', 'Users'];

export default function AdminServicesFAQ({ services, onUpdateServices, faqs, onUpdateFaqs }: AdminServicesFAQProps) {
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'faq'>('services');

  // Service States
  const [editingService, setEditingService] = useState<ServiceCard | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceIcon, setServiceIcon] = useState('Briefcase');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceDetailedDesc, setServiceDetailedDesc] = useState('');
  const [serviceActive, setServiceActive] = useState(true);

  // FAQ States
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // -------------------- SERVICES FUNCTIONS --------------------
  const handleOpenServiceForm = (service: ServiceCard | null) => {
    if (service) {
      setEditingService(service);
      setServiceTitle(service.title);
      setServiceIcon(service.icon);
      setServiceDesc(service.description);
      setServiceDetailedDesc(service.detailedDescription);
      setServiceActive(service.active);
    } else {
      setEditingService(null);
      setServiceTitle('');
      setServiceIcon('Briefcase');
      setServiceDesc('');
      setServiceDetailedDesc('');
      setServiceActive(true);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !serviceDesc) {
      alert('서비스 제목과 요약 설명을 작성해주세요.');
      return;
    }

    if (editingService) {
      // Edit
      const updated = services.map(s => {
        if (s.id === editingService.id) {
          return {
            ...s,
            title: serviceTitle,
            icon: serviceIcon,
            description: serviceDesc,
            detailedDescription: serviceDetailedDesc,
            active: serviceActive,
          };
        }
        return s;
      });
      onUpdateServices(updated);
      alert('서비스 카드가 수정되었습니다.');
    } else {
      // Create
      const newService: ServiceCard = {
        id: `srv-${Date.now()}`,
        title: serviceTitle,
        icon: serviceIcon,
        description: serviceDesc,
        detailedDescription: serviceDetailedDesc,
        active: serviceActive,
      };
      onUpdateServices([...services, newService]);
      alert('새로운 서비스 카드가 추가되었습니다.');
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (!confirm('정말로 이 서비스 카드를 삭제하시겠습니까? 메인 홈페이지에서 제거됩니다.')) return;
    onUpdateServices(services.filter(s => s.id !== id));
    alert('서비스 카드가 삭제되었습니다.');
  };

  // -------------------- FAQ FUNCTIONS --------------------
  const handleOpenFaqForm = (faq: Faq | null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqQuestion(faq.question);
      setFaqAnswer(faq.answer);
    } else {
      setEditingFaq(null);
      setFaqQuestion('');
      setFaqAnswer('');
    }
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) {
      alert('질문과 답변 내용을 작성해주세요.');
      return;
    }

    if (editingFaq) {
      // Edit
      const updated = faqs.map(f => {
        if (f.id === editingFaq.id) {
          return {
            ...f,
            question: faqQuestion,
            answer: faqAnswer,
          };
        }
        return f;
      });
      onUpdateFaqs(updated);
      alert('FAQ 항목이 수정되었습니다.');
    } else {
      // Create
      const maxOrder = faqs.reduce((max, item) => item.order > max ? item.order : max, 0);
      const newFaq: Faq = {
        id: `faq-${Date.now()}`,
        question: faqQuestion,
        answer: faqAnswer,
        order: maxOrder + 1,
      };
      onUpdateFaqs([...faqs, newFaq]);
      alert('새로운 FAQ 항목이 추가되었습니다.');
    }
    setEditingFaq(null);
  };

  const handleDeleteFaq = (id: string) => {
    if (!confirm('정말로 이 FAQ를 삭제하시겠습니까?')) return;
    onUpdateFaqs(faqs.filter(f => f.id !== id));
    alert('FAQ 항목이 삭제되었습니다.');
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sortedFaqs.length) return;

    // Swap order values
    const temp = sortedFaqs[index].order;
    sortedFaqs[index].order = sortedFaqs[targetIndex].order;
    sortedFaqs[targetIndex].order = temp;

    onUpdateFaqs(sortedFaqs);
  };

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-6">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => { setActiveSubTab('services'); setEditingService(null); }}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeSubTab === 'services' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          서비스 소개 카드 관리 ({services.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('faq'); setEditingFaq(null); }}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeSubTab === 'faq' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          자주 묻는 질문 FAQ ({faqs.length})
        </button>
      </div>

      {/* ----------------- SERVICES EDITOR ----------------- */}
      {activeSubTab === 'services' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Services List */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-white">현 대표 서비스 목록</h4>
              {editingService === null && (
                <button
                  onClick={() => handleOpenServiceForm(null)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  새 서비스 추가
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => handleOpenServiceForm(srv)}
                  className={`border p-4 rounded-xl flex gap-4 transition-all cursor-pointer hover:bg-slate-900/80 group ${srv.active ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${srv.active ? 'bg-blue-950/80 text-blue-400' : 'bg-slate-900 text-slate-500'}`}>
                    <LucideIcon name={srv.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                          {srv.title}
                        </h5>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              const updated = services.map(s => s.id === srv.id ? { ...s, active: !s.active } : s);
                              onUpdateServices(updated);
                            }}
                            className={`p-1 rounded text-xs ${srv.active ? 'text-emerald-400' : 'text-slate-500'}`}
                            title={srv.active ? '노출 중' : '비노출'}
                          >
                            {srv.active ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800"
                            title="삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Add/Edit Form */}
          <div className="xl:col-span-1">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl sticky top-24">
              <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-3 mb-4">
                {editingService ? `서비스 수정 [${editingService.title}]` : '새로운 서비스 카드 등록'}
              </h4>

              <form onSubmit={handleSaveService} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">서비스명 (타이틀)</label>
                  <input
                    type="text"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="예: 특허 자본화 경영 전략"
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">아이콘 선택</label>
                    <select
                      value={serviceIcon}
                      onChange={(e) => setServiceIcon(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 p-2 text-blue-400">
                    <LucideIcon name={serviceIcon} size={28} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">메인 요약 설명 (카드 노출)</label>
                  <textarea
                    rows={3}
                    value={serviceDesc}
                    onChange={(e) => setServiceDesc(e.target.value)}
                    placeholder="카드 겉면에 표시될 2-3줄의 간결한 설명을 기재하세요..."
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">상세 안내 설명 (자세히보기 팝업)</label>
                  <textarea
                    rows={6}
                    value={serviceDetailedDesc}
                    onChange={(e) => setServiceDetailedDesc(e.target.value)}
                    placeholder="고객이 '자세히보기' 버튼을 눌렀을 때 팝업창에서 조명할 세부 지원요건, 핵심 타겟, 가점 정보 등을 적어주세요..."
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between py-2 bg-slate-950 px-3 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">메인 화면에 카드 노출하기</span>
                  <button
                    type="button"
                    onClick={() => setServiceActive(!serviceActive)}
                    className="text-blue-500 focus:outline-none"
                  >
                    {serviceActive ? (
                      <CheckSquare size={18} className="text-blue-500" />
                    ) : (
                      <Square size={18} className="text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {editingService && (
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      취소
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer ${editingService ? '' : 'col-span-2'}`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Save size={13} />
                      {editingService ? '수정 완료' : '신규 카드 등록'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- FAQ EDITOR ----------------- */}
      {activeSubTab === 'faq' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* FAQ List */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-white">FAQ 리스트 (총 {sortedFaqs.length}개)</h4>
              {editingFaq === null && (
                <button
                  onClick={() => handleOpenFaqForm(null)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  자주 묻는 질문 추가
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {sortedFaqs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                  작성된 자주 묻는 질문이 없습니다.
                </div>
              ) : (
                sortedFaqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    onClick={() => handleOpenFaqForm(faq)}
                    className={`border p-4 rounded-xl bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer flex justify-between items-center group ${editingFaq?.id === faq.id ? 'bg-slate-800 border-slate-700' : ''}`}
                  >
                    <div className="flex gap-3 items-start min-w-0 mr-4">
                      <span className="w-6 h-6 rounded bg-blue-950 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                          {faq.question}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {faq.answer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Move Order Buttons */}
                      <button
                        onClick={() => handleMoveFaq(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                        title="위로 이동"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveFaq(index, 'down')}
                        disabled={index === sortedFaqs.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                        title="아래로 이동"
                      >
                        <ArrowDown size={14} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 ml-2"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FAQ Add/Edit Form */}
          <div className="xl:col-span-1">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl sticky top-24">
              <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-3 mb-4">
                {editingFaq ? 'FAQ 질문/답변 수정' : '신규 FAQ 항목 등록'}
              </h4>

              <form onSubmit={handleSaveFaq} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">자주 묻는 질문 (Question)</label>
                  <input
                    type="text"
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="예: 보증금 지원 심사 기간은 보통 얼마나 걸리나요?"
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">답변 내용 (Answer)</label>
                  <textarea
                    rows={10}
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="질문에 대한 명확하고 친절한 상담식 답변 내용을 입력하세요. 문단 개행을 지원합니다..."
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {editingFaq && (
                    <button
                      type="button"
                      onClick={() => setEditingFaq(null)}
                      className="py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      취소
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer ${editingFaq ? '' : 'col-span-2'}`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Save size={13} />
                      {editingFaq ? '수정 완료' : '신규 FAQ 저장'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
