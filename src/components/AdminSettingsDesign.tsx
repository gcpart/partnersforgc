import React, { useState, useRef } from 'react';
import { SiteSettings, DesignSettings, SuccessCase, Review, MediaItem, FullDatabase } from '../types';
import { Save, Share2, Palette, Database, Award, Star, Upload, Download, Globe, FileText, Check, Trash2, Plus, RefreshCw } from 'lucide-react';

interface AdminSettingsDesignProps {
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (updated: SiteSettings) => void;
  designSettings: DesignSettings;
  onUpdateDesignSettings: (updated: DesignSettings) => void;
  successCases: SuccessCase[];
  onUpdateSuccessCases: (updated: SuccessCase[]) => void;
  reviews: Review[];
  onUpdateReviews: (updated: Review[]) => void;
  mediaItems: MediaItem[];
  onUpdateMediaItems: (updated: MediaItem[]) => void;
  fullDb: FullDatabase;
  onRestoreFullDb: (restored: FullDatabase) => void;
}

export default function AdminSettingsDesign({
  siteSettings,
  onUpdateSiteSettings,
  designSettings,
  onUpdateDesignSettings,
  successCases,
  onUpdateSuccessCases,
  reviews,
  onUpdateReviews,
  mediaItems,
  onUpdateMediaItems,
  fullDb,
  onRestoreFullDb,
}: AdminSettingsDesignProps) {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'design' | 'success_reviews' | 'backup'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- INFO STATE ---
  const [infoForm, setInfoForm] = useState<SiteSettings>({ ...siteSettings });

  // --- DESIGN STATE ---
  const [designForm, setDesignForm] = useState<DesignSettings>({ ...designSettings });

  // --- SUCCESS CASES STATE ---
  const [editingCase, setEditingCase] = useState<SuccessCase | null>(null);
  const [caseCompany, setCaseCompany] = useState('');
  const [caseAmount, setCaseAmount] = useState('');
  const [caseIndustry, setCaseIndustry] = useState('');
  const [caseDesc, setCaseDesc] = useState('');
  const [caseTestimonial, setCaseTestimonial] = useState('');
  const [caseFeatured, setCaseFeatured] = useState(false);

  // --- REVIEWS STATE ---
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [revName, setRevName] = useState('');
  const [revCompany, setRevCompany] = useState('');
  const [revPosition, setRevPosition] = useState('');
  const [revContent, setRevContent] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revFeatured, setRevFeatured] = useState(false);

  // --- MEDIA SIMULATOR STATE ---
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');

  // ------------------- HANDLERS -------------------
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(infoForm);
    alert('회사 및 SEO 설정 정보가 안전하게 저장되었습니다.');
  };

  const handleSaveDesign = (e: React.FormEvent) => {
    e.preventDefault();
    // Update theme specific backgrounds for seamless visualization
    let updated = { ...designForm };
    if (designForm.themeMode === 'navy') {
      updated.bgColor = '#071A3D';
      updated.cardBgColor = '#0E2954';
      updated.textColor = '#FFFFFF';
      updated.textMutedColor = '#94A3B8';
    } else if (designForm.themeMode === 'dark') {
      updated.bgColor = '#0F172A';
      updated.cardBgColor = '#1E293B';
      updated.textColor = '#F8FAFC';
      updated.textMutedColor = '#94A3B8';
    } else if (designForm.themeMode === 'light') {
      updated.bgColor = '#F8FAFC';
      updated.cardBgColor = '#FFFFFF';
      updated.textColor = '#0F172A';
      updated.textMutedColor = '#475569';
    }
    onUpdateDesignSettings(updated);
    alert('디자인 테마 설정이 성공적으로 반영되었습니다. 즉시 확인하실 수 있습니다.');
  };

  // --- SUCCESS CASES CRUD ---
  const handleOpenCaseForm = (c: SuccessCase | null) => {
    if (c) {
      setEditingCase(c);
      setCaseCompany(c.companyName);
      setCaseAmount(c.fundAmount);
      setCaseIndustry(c.industry);
      setCaseDesc(c.description);
      setCaseTestimonial(c.testimonial);
      setCaseFeatured(c.isFeatured);
    } else {
      setEditingCase(null);
      setCaseCompany('');
      setCaseAmount('');
      setCaseIndustry('');
      setCaseDesc('');
      setCaseTestimonial('');
      setCaseFeatured(false);
    }
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseCompany || !caseAmount || !caseDesc) {
      alert('필수 성공사례 정보를 입력해주세요.');
      return;
    }

    if (editingCase) {
      const updated = successCases.map(item => {
        if (item.id === editingCase.id) {
          return {
            ...item,
            companyName: caseCompany,
            fundAmount: caseAmount,
            industry: caseIndustry,
            description: caseDesc,
            testimonial: caseTestimonial,
            isFeatured: caseFeatured,
          };
        }
        return item;
      });
      onUpdateSuccessCases(updated);
      alert('성공사례가 수정되었습니다.');
    } else {
      const newCase: SuccessCase = {
        id: `sc-${Date.now()}`,
        companyName: caseCompany,
        fundAmount: caseAmount,
        industry: caseIndustry,
        description: caseDesc,
        testimonial: caseTestimonial,
        isFeatured: caseFeatured,
      };
      onUpdateSuccessCases([...successCases, newCase]);
      alert('새로운 성공사례가 등록되었습니다.');
    }
    setEditingCase(null);
  };

  const handleDeleteCase = (id: string) => {
    if (!confirm('정말로 이 성공사례를 삭제하시겠습니까?')) return;
    onUpdateSuccessCases(successCases.filter(c => c.id !== id));
  };

  // --- REVIEWS CRUD ---
  const handleOpenReviewForm = (r: Review | null) => {
    if (r) {
      setEditingReview(r);
      setRevName(r.reviewerName);
      setRevCompany(r.company);
      setRevPosition(r.position);
      setRevContent(r.content);
      setRevRating(r.rating);
      setRevFeatured(r.isFeatured);
    } else {
      setEditingReview(null);
      setRevName('');
      setRevCompany('');
      setRevPosition('');
      setRevContent('');
      setRevRating(5);
      setRevFeatured(false);
    }
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revContent) {
      alert('추천인 이름과 후기 내용을 입력해주세요.');
      return;
    }

    if (editingReview) {
      const updated = reviews.map(item => {
        if (item.id === editingReview.id) {
          return {
            ...item,
            reviewerName: revName,
            company: revCompany,
            position: revPosition,
            content: revContent,
            rating: revRating,
            isFeatured: revFeatured,
          };
        }
        return item;
      });
      onUpdateReviews(updated);
      alert('고객 후기가 수정되었습니다.');
    } else {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        reviewerName: revName,
        company: revCompany,
        position: revPosition,
        content: revContent,
        rating: revRating,
        isFeatured: revFeatured,
      };
      onUpdateReviews([...reviews, newReview]);
      alert('새로운 고객 후기가 등록되었습니다.');
    }
    setEditingReview(null);
  };

  const handleDeleteReview = (id: string) => {
    if (!confirm('정말로 이 고객 후기를 삭제하시겠습니까?')) return;
    onUpdateReviews(reviews.filter(r => r.id !== id));
  };

  // --- MEDIA SIMULATION ---
  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl || !mediaName) {
      alert('이미지 URL과 파일명을 작성해주세요.');
      return;
    }

    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      url: mediaUrl,
      name: mediaName.endsWith('.jpg') || mediaName.endsWith('.png') ? mediaName : `${mediaName}.jpg`,
      size: `${Math.floor(Math.random() * 300) + 50} KB`,
      type: 'image/jpeg',
      date: new Date().toISOString().split('T')[0],
    };

    onUpdateMediaItems([newItem, ...mediaItems]);
    setMediaUrl('');
    setMediaName('');
    alert('새로운 미디어 이미지가 라이브러리에 등록되었습니다.');
  };

  const handleDeleteMedia = (id: string) => {
    if (!confirm('정말로 이 이미지를 라이브러리에서 삭제하시겠습니까?')) return;
    onUpdateMediaItems(mediaItems.filter(m => m.id !== id));
  };

  // --- BACKUP & RESTORE ---
  const handleBackupDb = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(fullDb, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `gcpartners_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestoreDb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Simple sanity check
        if (parsed.siteSettings && parsed.designSettings && parsed.services && parsed.blogs) {
          onRestoreFullDb(parsed);
          // Sync internal state inputs
          setInfoForm({ ...parsed.siteSettings });
          setDesignForm({ ...parsed.designSettings });
          alert('데이터 복원이 완벽하게 완료되었습니다! 모든 게시물, 문의, 테마 설정이 원복되었습니다.');
        } else {
          alert('올바른 백업 파일 형식이 아닙니다. 필수 데이터가 누락되었습니다.');
        }
      } catch (err) {
        alert('백업 파일을 분석하는 과정에서 오류가 발생했습니다. 파일 형식을 확인해주세요.');
      }
    };
    fileReader.readAsText(uploadedFile);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('info')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeSubTab === 'info' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          기본 사이트 정보 & SEO
        </button>
        <button
          onClick={() => setActiveSubTab('design')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeSubTab === 'design' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          실시간 테마 & 디자인
        </button>
        <button
          onClick={() => setActiveSubTab('success_reviews')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeSubTab === 'success_reviews' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          성공사례 / 고객후기
        </button>
        <button
          onClick={() => setActiveSubTab('backup')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeSubTab === 'backup' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          미디어 & 백업/복원
        </button>
      </div>

      {/* ---------------- INFO & SEO FORM ---------------- */}
      {activeSubTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-sm">회사 기본 정보 및 검색엔진(SEO) 관리</h4>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Save size={13} />
              설정 저장하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col: Corporate Details */}
            <div className="flex flex-col gap-4">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider">회사 정보 설정</h5>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">사이트명</label>
                  <input
                    type="text"
                    value={infoForm.siteName}
                    onChange={(e) => setInfoForm({ ...infoForm, siteName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">로고 텍스트</label>
                  <input
                    type="text"
                    value={infoForm.logoText}
                    onChange={(e) => setInfoForm({ ...infoForm, logoText: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">대표자명 (CEO)</label>
                  <input
                    type="text"
                    value={infoForm.ceoName}
                    onChange={(e) => setInfoForm({ ...infoForm, ceoName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">사업자등록번호</label>
                  <input
                    type="text"
                    value={infoForm.businessNumber}
                    onChange={(e) => setInfoForm({ ...infoForm, businessNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">대표 연락처 (Tel)</label>
                  <input
                    type="text"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">이메일 주소</label>
                  <input
                    type="email"
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">회사 소재지 주소</label>
                <input
                  type="text"
                  value={infoForm.address}
                  onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">카카오 채널 링크</label>
                  <input
                    type="text"
                    value={infoForm.socialKakao}
                    onChange={(e) => setInfoForm({ ...infoForm, socialKakao: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">네이버 블로그 링크</label>
                  <input
                    type="text"
                    value={infoForm.socialNaver}
                    onChange={(e) => setInfoForm({ ...infoForm, socialNaver: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: SEO Settings */}
            <div className="flex flex-col gap-4">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Globe size={14} />
                검색엔진 최적화 (SEO) 및 메타태그
              </h5>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">SEO 포털 노출 제목 (Meta Title)</label>
                <input
                  type="text"
                  value={infoForm.seoTitle}
                  onChange={(e) => setInfoForm({ ...infoForm, seoTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">사이트 상세 묘사 (Meta Description)</label>
                <textarea
                  rows={3}
                  value={infoForm.seoDescription}
                  onChange={(e) => setInfoForm({ ...infoForm, seoDescription: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs leading-normal resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">핵심 검색 키워드 (쉼표 구분)</label>
                <input
                  type="text"
                  value={infoForm.seoKeywords}
                  onChange={(e) => setInfoForm({ ...infoForm, seoKeywords: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">대표 도메인 URL (Canonical)</label>
                  <input
                    type="text"
                    value={infoForm.canonicalUrl}
                    onChange={(e) => setInfoForm({ ...infoForm, canonicalUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">로봇 검색 수집 규칙 (robots.txt)</label>
                  <input
                    type="text"
                    value={infoForm.robotsTxt}
                    onChange={(e) => setInfoForm({ ...infoForm, robotsTxt: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ---------------- DESIGN THEME Pickers ---------------- */}
      {activeSubTab === 'design' && (
        <form onSubmit={handleSaveDesign} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-sm">비주얼 디자인 스타일 테마 커스터마이저</h4>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Palette size={13} />
              새 디자인 적용하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Presets Column */}
            <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl flex flex-col gap-4">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                디자인 모드 프리셋 선택
              </h5>
              <div className="flex flex-col gap-2">
                {[
                  { mode: 'navy', label: '딥네이비 (GC 기본 테마)', desc: '중후하고 고급스러운 남색 (#071A3D)' },
                  { mode: 'dark', label: '다크 슬레이트 (모던 코포레이트)', desc: '차분하고 선명한 다크 그레이 (#0F172A)' },
                  { mode: 'light', label: '크리스탈 화이트 (클래식 라이트)', desc: '금융사 수준의 화사하고 정갈한 화이트' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setDesignForm({ ...designForm, themeMode: item.mode as any })}
                    className={`text-left p-3 rounded-lg border transition-all ${designForm.themeMode === item.mode ? 'bg-blue-950/40 border-blue-600 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <div className="font-semibold text-xs flex justify-between items-center">
                      {item.label}
                      {designForm.themeMode === item.mode && <Check size={14} className="text-blue-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Elements */}
            <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl flex flex-col gap-4">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider">세부 테마 및 폰트 변경</h5>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">포인트 액센트 색상</label>
                <div className="flex gap-2">
                  {[
                    { color: '#3B82F6', label: '클래식블루' },
                    { color: '#D4AF37', label: '골드라벨' },
                    { color: '#10B981', label: '에머럴드' },
                    { color: '#F59E0B', label: '엠버오렌지' },
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setDesignForm({ ...designForm, accentColor: c.color })}
                      className={`w-8 h-8 rounded-full border relative ${designForm.accentColor === c.color ? 'ring-2 ring-blue-400' : 'border-slate-800'}`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    >
                      {designForm.accentColor === c.color && <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">서체 설정 (Font Family)</label>
                <select
                  value={designForm.fontFamily}
                  onChange={(e) => setDesignForm({ ...designForm, fontFamily: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-900 text-white border border-slate-800 rounded-lg text-xs"
                >
                  <option value="Pretendard">Pretendard (가장 깔끔하고 세련된 느낌)</option>
                  <option value="Noto Serif KR">Noto Serif KR (전문적이고 신뢰감 높은 명조체)</option>
                  <option value="Gowun Batang">Gowun Batang (부드럽고 고급스러운 인상)</option>
                  <option value="Inter">Inter (영문 비즈니스 컨설팅 중심)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">글자 기본 크기</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  {['sm', 'base', 'lg'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setDesignForm({ ...designForm, fontSize: size as any })}
                      className={`py-1 rounded text-[11px] font-medium transition-all ${designForm.fontSize === size ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {size === 'sm' ? '작게' : size === 'base' ? '보통 (추천)' : '크게'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Layout width & buttons styling */}
            <div className="bg-slate-950/80 p-4 border border-slate-800/80 rounded-xl flex flex-col gap-4">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider">버튼 스타일 & 프레임</h5>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">모서리 둥글기 (Border Radius)</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  {['square', 'rounded', 'pill'].map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setDesignForm({ ...designForm, buttonStyle: style as any })}
                      className={`py-1 rounded text-[11px] font-medium transition-all ${designForm.buttonStyle === style ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {style === 'square' ? '직각 스타일' : style === 'rounded' ? '라운드' : '둥근 알약형'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">카드 그림자 강조</label>
                <select
                  value={designForm.cardShadow}
                  onChange={(e) => setDesignForm({ ...designForm, cardShadow: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-900 text-white border border-slate-800 rounded-lg text-xs"
                >
                  <option value="none">없음 (플랫 스타일)</option>
                  <option value="sm">약한 그림자</option>
                  <option value="md">보통 그림자</option>
                  <option value="lg">강한 입체 그림자</option>
                  <option value="xl">프리엄 특화 발광그림자</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">레이아웃 최대 너비 설정</label>
                <select
                  value={designForm.layoutWidth}
                  onChange={(e) => setDesignForm({ ...designForm, layoutWidth: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-900 text-white border border-slate-800 rounded-lg text-xs"
                >
                  <option value="container">컨테이너 중심 박스형 (추천)</option>
                  <option value="full">와이드 풀스크린 브라우저 너비</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ---------------- SUCCESS CASES & REVIEWS CMS ---------------- */}
      {activeSubTab === 'success_reviews' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Success Cases Editor */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Award size={14} className="text-blue-400" />
                성공 사례 관리 ({successCases.length})
              </h5>
              {editingCase === null && (
                <button
                  type="button"
                  onClick={() => handleOpenCaseForm(null)}
                  className="flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-bold py-1 px-2.5 rounded transition-all cursor-pointer"
                >
                  <Plus size={12} />
                  추가
                </button>
              )}
            </div>

            {/* List */}
            {editingCase === null ? (
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto">
                {successCases.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenCaseForm(item)}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 hover:bg-slate-900 transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.companyName}</span>
                        <span className="text-[10px] text-blue-400 font-semibold bg-blue-950 px-1.5 py-0.5 rounded">{item.fundAmount}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteCase(item.id); }}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSaveCase} className="flex flex-col gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">기업명</label>
                    <input
                      type="text"
                      value={caseCompany}
                      onChange={(e) => setCaseCompany(e.target.value)}
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">자금 조달 규모</label>
                    <input
                      type="text"
                      value={caseAmount}
                      onChange={(e) => setCaseAmount(e.target.value)}
                      placeholder="예: 8억 원 조달"
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">업종 대분류</label>
                    <input
                      type="text"
                      value={caseIndustry}
                      onChange={(e) => setCaseIndustry(e.target.value)}
                      placeholder="예: IT 제조업 / 부품"
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                    />
                  </div>
                  <div className="flex items-end pb-1.5">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={caseFeatured}
                        onChange={(e) => setCaseFeatured(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-blue-500"
                      />
                      메인 화면에 특급 매칭으로 노출
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">사례 요약 설명</label>
                  <textarea
                    rows={2}
                    value={caseDesc}
                    onChange={(e) => setCaseDesc(e.target.value)}
                    className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">고객 리얼 한줄 후기 (Testimonial)</label>
                  <textarea
                    rows={2}
                    value={caseTestimonial}
                    onChange={(e) => setCaseTestimonial(e.target.value)}
                    className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditingCase(null)}
                    className="py-1 px-2.5 text-xs bg-slate-800 rounded text-white"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="py-1 px-3 text-xs bg-blue-600 rounded text-white cursor-pointer"
                  >
                    사례 저장
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Testimonial reviews Editor */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                고객 추천 후기 관리 ({reviews.length})
              </h5>
              {editingReview === null && (
                <button
                  type="button"
                  onClick={() => handleOpenReviewForm(null)}
                  className="flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-bold py-1 px-2.5 rounded transition-all cursor-pointer"
                >
                  <Plus size={12} />
                  추가
                </button>
              )}
            </div>

            {/* List */}
            {editingReview === null ? (
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto">
                {reviews.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenReviewForm(item)}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 hover:bg-slate-900 transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.reviewerName}</span>
                        <span className="text-[10px] text-slate-400">{item.company} ({item.position})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.content}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteReview(item.id); }}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSaveReview} className="flex flex-col gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">작성자 성함</label>
                    <input
                      type="text"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">소속 회사명</label>
                    <input
                      type="text"
                      value={revCompany}
                      onChange={(e) => setRevCompany(e.target.value)}
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">직책</label>
                    <input
                      type="text"
                      value={revPosition}
                      onChange={(e) => setRevPosition(e.target.value)}
                      placeholder="예: 대표이사"
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">만족도 별점</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                    >
                      <option value="5">★★★★★ (5점 만점)</option>
                      <option value="4">★★★★☆ (4점)</option>
                      <option value="3">★★★☆☆ (3점)</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1.5">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={revFeatured}
                        onChange={(e) => setRevFeatured(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-blue-500"
                      />
                      슬라이더 추천후기에 상시 노출
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">상담 만족 평가 내용</label>
                  <textarea
                    rows={3}
                    value={revContent}
                    onChange={(e) => setRevContent(e.target.value)}
                    className="w-full p-2 bg-slate-900 text-white border border-slate-800 rounded text-xs"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditingReview(null)}
                    className="py-1 px-2.5 text-xs bg-slate-800 rounded text-white"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="py-1 px-3 text-xs bg-blue-600 rounded text-white cursor-pointer"
                  >
                    후기 저장
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------- BACKUP & RESTORE TAB ---------------- */}
      {activeSubTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JSON BACKUP & RESTORE BOX */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col gap-5">
            <h5 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Database size={16} className="text-blue-400" />
              데이터 안전 백업 및 복원 (Durable Backup & Restore)
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              본 웹사이트의 모든 CMS 데이터(블로그 글, 공지사항, 상담 접수건, FAQ, 서비스 카드 및 오너가 사용자지정한 실시간 폰트/컬러 테마)를 하나의 단일 JSON 백업 파일로 추출하거나 복원할 수 있습니다. 
              <br/><strong className="text-blue-400">브라우저 쿠키를 삭제하기 전에 반드시 하단 다운로드 버튼을 활용해 소중한 사업 기록을 보전하세요.</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {/* Export backup button */}
              <button
                type="button"
                onClick={handleBackupDb}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-xs transition-all cursor-pointer"
              >
                <Download size={15} />
                로컬 PC에 데이터 백업 (JSON)
              </button>

              {/* Import backup simulation button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-lg text-xs transition-all cursor-pointer"
              >
                <Upload size={15} />
                JSON 파일에서 데이터 복원
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleRestoreDb}
                className="hidden"
              />
            </div>
            
            {/* Quick reset database */}
            <div className="border-t border-slate-800/80 pt-4 mt-1 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">최초 데이터 상태로 모든 것을 되돌려 리셋하고 싶을 때:</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('정말로 모든 설정과 게시물을 초기 상태로 되돌리시겠습니까? 현재 작성된 데이터는 유실됩니다.')) {
                    localStorage.removeItem('gcpartners_db');
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-[10px] font-bold"
              >
                <RefreshCw size={10} />
                초기 데이터 리셋
              </button>
            </div>
          </div>

          {/* MEDIA LIBRARY BOX */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
            <h5 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              미디어 가상 이미지 보관함 ({mediaItems.length})
            </h5>

            {/* Simulated uploader */}
            <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <div className="sm:col-span-1">
                <label className="block text-[9px] text-slate-400 mb-1">가상 파일명</label>
                <input
                  type="text"
                  value={mediaName}
                  onChange={(e) => setMediaName(e.target.value)}
                  placeholder="예: 공장_자동화"
                  className="w-full p-2 bg-slate-950 text-white border border-slate-800 rounded text-xs"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-[9px] text-slate-400 mb-1">인터넷 이미지 URL</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-950 text-white border border-slate-800 rounded text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs cursor-pointer flex justify-center items-center gap-1"
              >
                <Plus size={12} />
                라이브러리 등록
              </button>
            </form>

            {/* List images */}
            <div className="grid grid-cols-4 gap-2 mt-2 max-h-[220px] overflow-y-auto pr-1">
              {mediaItems.map(m => (
                <div key={m.id} className="relative group rounded border border-slate-800 overflow-hidden aspect-square bg-slate-950">
                  <img src={m.url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-center">
                    <span className="text-[8px] text-white truncate font-medium">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(m.id)}
                      className="text-red-400 hover:text-red-300 self-center"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="text-[8px] text-slate-500">{m.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
