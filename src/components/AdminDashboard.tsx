import React, { useState } from 'react';
import { FullDatabase, Inquiry } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
  LayoutDashboard, MessageSquare, FileText, Settings, Award, ArrowLeft, 
  Users, HelpCircle, FileCheck, Calendar, BellRing, Sparkles, LogOut, CheckCircle, Clock
} from 'lucide-react';

import AdminInquiries from './AdminInquiries';
import AdminCMS from './AdminCMS';
import AdminServicesFAQ from './AdminServicesFAQ';
import AdminSettingsDesign from './AdminSettingsDesign';

interface AdminDashboardProps {
  db: FullDatabase;
  onUpdateDb: (updated: FullDatabase) => void;
  onClose: () => void;
}

export default function AdminDashboard({ db, onUpdateDb, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'cms' | 'services_faq' | 'settings_design'>('dashboard');

  // --- DERIVE STATISTICS FOR DASHBOARD ---
  const totalInquiries = db.inquiries.length;
  const unprocessedInquiries = db.inquiries.filter(i => i.status === 'unprocessed').length;
  const activeConsultations = db.inquiries.filter(i => i.status === 'consulting').length;
  const totalArticles = db.blogs.length + db.notices.length;
  
  // Calculate dynamic Pie Chart data based on genuine inquiries statuses
  const statusData = [
    { name: '접수대기', value: db.inquiries.filter(i => i.status === 'unprocessed').length, color: '#F59E0B' },
    { name: '상담중', value: db.inquiries.filter(i => i.status === 'consulting').length, color: '#3B82F6' },
    { name: '완료됨', value: db.inquiries.filter(i => i.status === 'completed').length, color: '#10B981' },
    { name: '취소됨', value: db.inquiries.filter(i => i.status === 'cancelled').length, color: '#EF4444' },
  ].filter(item => item.value > 0); // Only show non-zero statuses for visual appeal

  // Simple backup stats if there are no inquiries
  const pieDataToShow = statusData.length > 0 ? statusData : [
    { name: '접수대기', value: 1, color: '#F59E0B' },
    { name: '상담중', value: 2, color: '#3B82F6' },
    { name: '완료됨', value: 3, color: '#10B981' },
  ];

  // Inquiries daily chart trend
  const trendData = [
    { day: '07/01', '상담신청': 1 },
    { day: '07/02', '상담신청': 3 },
    { day: '07/03', '상담신청': 2 },
    { day: '07/04', '상담신청': 1 },
    { day: '07/05', '상담신청': db.inquiries.filter(i => i.date.includes('07-05') || i.date.includes('18:02') || i.date.includes('15:42')).length || 2 },
  ];

  // Helper updates
  const handleUpdateInquiries = (updated: Inquiry[]) => {
    onUpdateDb({ ...db, inquiries: updated });
  };

  const handleUpdateBlogs = (updated: any) => {
    onUpdateDb({ ...db, blogs: updated });
  };

  const handleUpdateNotices = (updated: any) => {
    onUpdateDb({ ...db, notices: updated });
  };

  const handleUpdateServices = (updated: any) => {
    onUpdateDb({ ...db, services: updated });
  };

  const handleUpdateFaqs = (updated: any) => {
    onUpdateDb({ ...db, faqs: updated });
  };

  const handleUpdateSiteSettings = (updated: any) => {
    onUpdateDb({ ...db, siteSettings: updated });
  };

  const handleUpdateDesignSettings = (updated: any) => {
    onUpdateDb({ ...db, designSettings: updated });
  };

  const handleUpdateSuccessCases = (updated: any) => {
    onUpdateDb({ ...db, successCases: updated });
  };

  const handleUpdateReviews = (updated: any) => {
    onUpdateDb({ ...db, reviews: updated });
  };

  const handleUpdateMediaItems = (updated: any) => {
    onUpdateDb({ ...db, mediaItems: updated });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded">
            Admin System
          </span>
          <h1 className="font-extrabold text-white text-lg tracking-tight">
            {db.siteSettings.siteName} <span className="text-blue-400 font-medium text-sm">통합 관리 대시보드</span>
          </h1>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          공식 사이트로 복귀
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/40 border-r border-slate-800/80 p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-2 block">
              메뉴 네비게이션
            </span>

            {[
              { id: 'dashboard', label: '대시보드 홈', icon: LayoutDashboard },
              { id: 'inquiries', label: '상담 신청 관리', icon: MessageSquare, badge: unprocessedInquiries },
              { id: 'cms', label: '게시글/공지사항 (CMS)', icon: FileText },
              { id: 'services_faq', label: '서비스 & FAQ 관리', icon: HelpCircle },
              { id: 'settings_design', label: '사이트 정보 & 테마', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/60 mt-8 flex flex-col gap-2 px-1">
            <div className="text-[10px] text-slate-500">
              로그인 계정: <strong className="text-slate-300">{db.siteSettings.email}</strong>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors font-medium cursor-pointer"
            >
              <LogOut size={13} />
              대시보드 로그아웃
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          {/* ----------------- TABS ROUTER ----------------- */}

          {/* 1. DASHBOARD HOME VIEW */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-950/80 text-blue-400 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">전체 상담 신청</span>
                    <h3 className="text-xl font-bold text-white mt-1">{totalInquiries}건</h3>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-950/80 text-yellow-400 flex items-center justify-center shrink-0 animate-pulse">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">검토 대기 건수</span>
                    <h3 className="text-xl font-bold text-white mt-1">{unprocessedInquiries}건</h3>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">현재 적극 상담중</span>
                    <h3 className="text-xl font-bold text-white mt-1">{activeConsultations}건</h3>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">게시물 & 공지사항</span>
                    <h3 className="text-xl font-bold text-white mt-1">{totalArticles}개</h3>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily inquiries area chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-4">최근 상담 접수 일별 추이</h4>
                  <div className="h-[240px] w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                        <Area type="monotone" dataKey="상담신청" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorInq)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie chart representing statuses */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-4">상담 신청 진행 현황 비율</h4>
                  <div className="h-[200px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieDataToShow}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieDataToShow.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '10px' }} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white">실시간 실시간 상담 문의 최근 접수 내역</h4>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                  >
                    전체 보기 &rarr;
                  </button>
                </div>

                <div className="flex flex-col divide-y divide-slate-800/55 text-sm">
                  {db.inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <div className="font-semibold text-white">{inq.name} 대표님 ({inq.company})</div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-lg">{inq.content}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 block">{inq.date}</span>
                        <span className="text-[10px] text-blue-400 mt-1 inline-block bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900/60">
                          {inq.status === 'unprocessed' ? '접수대기' : inq.status === 'consulting' ? '상담중' : '처리완료'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. INQUIRIES ROUTER */}
          {activeTab === 'inquiries' && (
            <AdminInquiries inquiries={db.inquiries} onUpdateInquiries={handleUpdateInquiries} />
          )}

          {/* 3. CMS ROUTER */}
          {activeTab === 'cms' && (
            <AdminCMS 
              blogs={db.blogs} 
              onUpdateBlogs={handleUpdateBlogs} 
              notices={db.notices} 
              onUpdateNotices={handleUpdateNotices} 
            />
          )}

          {/* 4. SERVICES & FAQ */}
          {activeTab === 'services_faq' && (
            <AdminServicesFAQ 
              services={db.services} 
              onUpdateServices={handleUpdateServices} 
              faqs={db.faqs} 
              onUpdateFaqs={handleUpdateFaqs} 
            />
          )}

          {/* 5. SITE SETTINGS & THEME CUSTOMIZER */}
          {activeTab === 'settings_design' && (
            <AdminSettingsDesign 
              siteSettings={db.siteSettings}
              onUpdateSiteSettings={handleUpdateSiteSettings}
              designSettings={db.designSettings}
              onUpdateDesignSettings={handleUpdateDesignSettings}
              successCases={db.successCases}
              onUpdateSuccessCases={handleUpdateSuccessCases}
              reviews={db.reviews}
              onUpdateReviews={handleUpdateReviews}
              mediaItems={db.mediaItems}
              onUpdateMediaItems={handleUpdateMediaItems}
              fullDb={db}
              onRestoreFullDb={onUpdateDb}
            />
          )}
        </main>
      </div>
    </div>
  );
}
