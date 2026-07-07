import React, { useState } from 'react';
import { Blog, Notice, Inquiry } from '../types';
import { Search, Send, Calendar, User, Eye, Bookmark, Tag, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

interface InquiryBlogProps {
  blogs: Blog[];
  notices: Notice[];
  inquiries: Inquiry[];
  onUpdateDb: (updatedInquiries: Inquiry[]) => void;
  accentColor: string;
  mode?: 'all' | 'inquiry' | 'blog';
}

export default function InquiryBlog({ blogs, notices, inquiries, onUpdateDb, accentColor, mode = 'all' }: InquiryBlogProps) {
  // Inquiry Form States
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [industry, setIndustry] = useState('');
  const [consultingContent, setConsultingContent] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Blog states
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [blogCategory, setBlogCategory] = useState('all');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');

  // Handle Inquiry Submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !companyName || !contactNumber || !industry || !consultingContent) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/mlgyzvgo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          '이름 (Name)': clientName,
          '회사명 (Company)': companyName,
          '연락처 (Contact)': contactNumber,
          '업종 (Industry)': industry,
          '문의내용 (Content)': consultingContent
        })
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      // Add to local list so admin can still track it locally
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        name: clientName,
        company: companyName,
        contact: contactNumber,
        email: industry, // Storing industry value in the email field for database compatibility
        content: consultingContent,
        memo: '',
        status: 'unprocessed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      const updated = [newInquiry, ...inquiries];
      onUpdateDb(updated);

      // Trigger Success State
      setSubmitSuccess(true);
      
      // Clear Form inputs
      setClientName('');
      setCompanyName('');
      setContactNumber('');
      setIndustry('');
      setConsultingContent('');
    } catch (error) {
      console.error('Error submitting form to Formspree:', error);
      alert('상담 신청 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주시거나 고객센터로 연락 부탁드립니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter blog list
  const filteredBlogs = blogs.filter(item => {
    if (item.status !== 'published') return false;
    
    const matchesCategory = blogCategory === 'all' || item.category === blogCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(blogSearchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col">
      {/* ---------------- CONSULTATION INQUIRY FORM ---------------- */}
      {(mode === 'all' || mode === 'inquiry') && (
        <section id="inquiry" className="py-24 bg-[#071A3D] relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12 flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">
              1:1 CONFIDENTIAL CONSULTING
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              맞춤형 정책자금 무료 진단 신청
            </h2>
            <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2" />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1">
              신청하신 모든 세부 기업 정보와 상담 의뢰 사항은 신용정보법 및 개인정보보호 조례에 의거 100% 암호화 비밀 유지 처리됩니다.
            </p>
          </div>

          {/* Form / Success card */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl">
            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in gap-4">
                <div className="w-14 h-14 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">상담 신청이 완료되었습니다!</h3>
                  <p className="text-xs text-slate-300 leading-normal max-w-sm mx-auto mt-2">
                    대표님께서 기재해주신 연락처로 24시간 이내(영업일 기준) GC파트너스 금융팀장이 사전 재무제표 정밀 진단 후 개별 연락을 드리겠습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="py-2 px-6 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer mt-2"
                >
                  새로운 상담 신청하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">대표자 / 고객명 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="예: 홍길동 대표님"
                      className="w-full p-2.5 bg-white/5 text-white border border-white/10 rounded-lg text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">회사명 (기업명) <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="예: ㈜GC테크"
                      className="w-full p-2.5 bg-white/5 text-white border border-white/10 rounded-lg text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">직통 연락처 <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full p-2.5 bg-white/5 text-white border border-white/10 rounded-lg text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">업종 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="예: 제조업, 정보통신업, 도소매업 등"
                      className="w-full p-2.5 bg-white/5 text-white border border-white/10 rounded-lg text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">의뢰 및 문의 내용 (상세 기술) <span className="text-red-400">*</span></label>
                  <textarea
                    rows={5}
                    value={consultingContent}
                    onChange={(e) => setConsultingContent(e.target.value)}
                    placeholder="설립 년도, 최근 매출 추이, 필요한 자금 규모(예: 운전자금 3억 필요), 혹은 당사가 제공하는 기업인증 및 특허자본화 요건에 관해 대략적으로 적어주시면 보다 깊이 있는 조기 심사가 가능합니다..."
                    className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-lg text-xs focus:outline-none focus:border-blue-500 leading-relaxed resize-y disabled:opacity-50"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-white font-bold text-xs rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accentColor }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      무료 맞춤 정책자금 솔루션 신청
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ---------------- BLOG SECTION (정책자금 정보) ---------------- */}
      {(mode === 'all' || mode === 'blog') && (
        <section id="blog" className="py-24 bg-[#051430] relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">
              GC BUSINESS KNOWLEDGE CENTER
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              성공 비결을 전수하는 정책자금 뉴스룸
            </h2>
            <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2" />
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Blog controls */}
            <div className="flex flex-col md:flex-row gap-3.5 justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  placeholder="지식센터 정보글 검색..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {['all', '정책자금', '정부지원사업', '창업', '기업인증', '세무', '금융'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setBlogCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all ${blogCategory === cat ? 'bg-blue-600 text-white shadow' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`}
                  >
                    {cat === 'all' ? '전체 카테고리' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBlogs.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                  해당 조건과 일치하는 정책 정보글이 없습니다.
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <div 
                    key={blog.id}
                    onClick={() => setSelectedBlog(blog)}
                    className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-850 overflow-hidden border-b border-white/5">
                        <img 
                          src={blog.imageUrl} 
                          alt={blog.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-bold bg-blue-950/85 text-blue-300 px-2 py-0.5 rounded border border-blue-900">
                          {blog.category}
                        </span>
                      </div>

                      <div className="p-5">
                        <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug group-hover:text-blue-400 transition-colors line-clamp-1">
                          {blog.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {blog.content}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5">
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1"><User size={10} /> {blog.writer}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {blog.date}</span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                        더 읽기 &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ---------------- BLOG READING DETAIL MODAL ---------------- */}
      {(mode === 'all' || mode === 'blog') && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 md:p-8 flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              닫기
            </button>

            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider bg-blue-950/80 border border-blue-900/60 px-2 py-0.5 rounded">
                {selectedBlog.category}
              </span>
              <h3 className="font-extrabold text-white text-lg sm:text-xl mt-3 leading-snug">
                {selectedBlog.title}
              </h3>
              
              <div className="flex gap-4 items-center text-slate-500 text-xs mt-3.5 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1"><User size={12} /> {selectedBlog.writer}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {selectedBlog.date}</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {selectedBlog.views}회 조회</span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-normal max-h-[40vh] overflow-y-auto pr-1">
              {selectedBlog.content}
            </div>

            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 border-t border-slate-800 pt-3">
                {selectedBlog.tags.map(t => (
                  <span key={t} className="text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1">
                    <Tag size={8} className="text-blue-400" />
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedBlog(null)}
                className="py-2 px-5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setSelectedBlog(null);
                  const element = document.getElementById('inquiry');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="py-2 px-5 text-xs font-bold text-white rounded-lg transition-all cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                상담 무료 신청
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- NOTICE READING DETAIL MODAL ---------------- */}
      {(mode === 'all' || mode === 'blog') && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 flex flex-col gap-4 relative max-h-[85vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              닫기
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-red-950 text-red-400 font-extrabold px-1.5 py-0.5 rounded border border-red-900">
                  공지사항
                </span>
                <span className="text-slate-500 text-[11px]">{selectedNotice.date}</span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg mt-2 leading-snug">
                {selectedNotice.title}
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-normal border-t border-slate-800 pt-4 max-h-[35vh] overflow-y-auto pr-1">
              {selectedNotice.content}
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-800 pt-4">
              <span>발행처: {selectedNotice.writer}</span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="py-1.5 px-4 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
