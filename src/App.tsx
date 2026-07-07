import React, { useState, useEffect } from 'react';
import { FullDatabase } from './types';
import { initialData } from './data/initialData';

// Public Layout Sections
import Navbar from './components/Navbar';
import HeroAbout from './components/HeroAbout';
import ServicesProcess from './components/ServicesProcess';
import SuccessReviewsFaq from './components/SuccessReviewsFaq';
import InquiryBlog from './components/InquiryBlog';
import Footer from './components/Footer';

// Admin System
import AdminDashboard from './components/AdminDashboard';

// Helper function to sanitize any occurrences of old marketing words ("수석", "2주만에", "4억원")
function sanitizeDb(data: FullDatabase): FullDatabase {
  try {
    let str = JSON.stringify(data);
    // Replace "수석" terms with "팀장"
    str = str.replace(/수석님/g, '팀장님');
    str = str.replace(/수석금융위원/g, '금융팀장');
    str = str.replace(/수석금융/g, '금융팀장');
    str = str.replace(/수석 위원/g, '팀장');
    str = str.replace(/수석위원/g, '팀장');
    str = str.replace(/수석/g, '팀장');
    
    // Exclude "2주만에" terms
    str = str.replace(/단 2주 만에\s?/g, '');
    str = str.replace(/단 2주만에\s?/g, '');
    str = str.replace(/2주 만에\s?/g, '');
    str = str.replace(/2주만에\s?/g, '');
    
    // Exclude "4억원" terms
    str = str.replace(/기보 자금 4억 원을/g, '기보 자금을');
    str = str.replace(/기보 자금 4억원을/g, '기보 자금을');
    str = str.replace(/기보 자금 4억 원/g, '기보 자금');
    str = str.replace(/기보 자금 4억원/g, '기보 자금');
    str = str.replace(/4억 원\s?/g, '');
    str = str.replace(/4억원\s?/g, '');

    // Exclude "마케팅자금" & "청년 고용 보조금"
    str = str.replace(/마케팅자금/g, '지원자금');
    str = str.replace(/마케팅 자금/g, '지원자금');
    str = str.replace(/청년 고용 보조금/g, '지원금');
    str = str.replace(/청년고용보조금/g, '지원금');
    str = str.replace(/청년고용 보조금/g, '지원금');
    str = str.replace(/고용 보조금/g, '보조금');
    str = str.replace(/고용보조금/g, '보조금');

    // Specific srv-3 replacement rules for dynamic/local-storage persistence
    str = str.replace(/기술 개발, 마케팅, 고용 지원 등 무상환 보조금/g, '기술 개발 등 다양한 무상환 보조금');
    str = str.replace(/마케팅 비용, 장비 도입 비용, 고용 지원비 등을/g, '장비 도입 비용 등을');
    str = str.replace(/제품 개발 및 마케팅을 해결하고/g, '제품 개발 및 기술 고도화를 해결하고');

    // Exclude "12억대환" terms
    str = str.replace(/12억원\s?대환\s?대출/g, '대환 대출');
    str = str.replace(/12억\s?원\s?대환\s?대출/g, '대환 대출');
    str = str.replace(/12억\s?대환\s?대출/g, '대환 대출');
    str = str.replace(/12억대환대출/g, '대환대출');
    str = str.replace(/12억원\s?대환/g, '대환');
    str = str.replace(/12억\s?원\s?대환/g, '대환');
    str = str.replace(/12억\s?대환/g, '대환');
    str = str.replace(/12억대환/g, '대환');
    
    return JSON.parse(str);
  } catch (e) {
    return data;
  }
}

export default function App() {
  const [db, setDb] = useState<FullDatabase>(sanitizeDb(initialData));
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load from local storage on startup
  useEffect(() => {
    const saved = localStorage.getItem('gcpartners_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sanitized = sanitizeDb(parsed);
        
        // Force update newly requested corporate registration details to avoid stale values in existing localStorage
        if (sanitized.siteSettings) {
          sanitized.siteSettings.ceoName = '오경택';
          sanitized.siteSettings.businessNumber = '243-50-01159';
          sanitized.siteSettings.address = '서울특별시 중랑구 묵동';
          sanitized.siteSettings.phone = '010-2970-2613';
          sanitized.siteSettings.email = 'gcpartners5g@gmail.com';
        }
        
        setDb(sanitized);
        localStorage.setItem('gcpartners_db', JSON.stringify(sanitized));
      } catch (err) {
        console.error('Failed to parse saved database, seeding with initial data instead', err);
        const sanitizedInit = sanitizeDb(initialData);
        setDb(sanitizedInit);
        localStorage.setItem('gcpartners_db', JSON.stringify(sanitizedInit));
      }
    } else {
      const sanitizedInit = sanitizeDb(initialData);
      setDb(sanitizedInit);
      localStorage.setItem('gcpartners_db', JSON.stringify(sanitizedInit));
    }
    setDataLoaded(true);
  }, []);

  // Update central state and localStorage
  const handleUpdateDb = (updated: FullDatabase) => {
    const sanitized = sanitizeDb(updated);
    setDb(sanitized);
    localStorage.setItem('gcpartners_db', JSON.stringify(sanitized));
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans text-xs">
        GC파트너스 보안 보안 데이터베이스 연결 중...
      </div>
    );
  }

  // --- Dynamic Theme Styles Parser ---
  // Font Selector
  const fontClass = 
    db.designSettings.fontFamily === 'Noto Serif KR' ? 'font-serif' :
    db.designSettings.fontFamily === 'Gowun Batang' ? 'font-mono' : 'font-sans';

  // Button Rounding Styles
  const roundingStyle = 
    db.designSettings.buttonRoundness === 'Square' ? 'rounded-none' :
    db.designSettings.buttonRoundness === 'Pill' ? 'rounded-full' : 'rounded-xl';

  const accentColor = db.designSettings.accentColor || '#3B82F6';

  // Render Admin View
  if (isAdminActive) {
    return (
      <AdminDashboard 
        db={db} 
        onUpdateDb={handleUpdateDb} 
        onClose={() => setIsAdminActive(false)} 
      />
    );
  }

  // Render Consumer Corporate Site
  return (
    <div className={`min-h-screen bg-[#071A3D] text-slate-100 ${fontClass} selection:bg-blue-600/30 selection:text-white`}>
      {/* 1. Header / Navigation */}
      <Navbar 
        siteSettings={db.siteSettings} 
        onEnterAdmin={() => setIsAdminActive(true)}
        accentColor={accentColor}
      />

      {/* 2. Hero & About Sections */}
      <HeroAbout 
        accentColor={accentColor} 
        siteName={db.siteSettings.siteName} 
      />

      {/* 2.5 Inquiries Intake (Positioned right after the main page as requested) */}
      <InquiryBlog 
        blogs={db.blogs}
        notices={db.notices}
        inquiries={db.inquiries}
        onUpdateDb={(updatedInqs) => handleUpdateDb({ ...db, inquiries: updatedInqs })}
        accentColor={accentColor}
        mode="inquiry"
      />

      {/* 3. Service Offerings & Process Timeline */}
      <ServicesProcess 
        services={db.services} 
        accentColor={accentColor} 
      />

      {/* 4. Real Performance (Success Cases, Reviews, FAQs) */}
      <SuccessReviewsFaq 
        successCases={db.successCases}
        reviews={db.reviews}
        faqs={db.faqs}
        accentColor={accentColor}
      />

      {/* 5. Knowledge Center Newsroom */}
      <InquiryBlog 
        blogs={db.blogs}
        notices={db.notices}
        inquiries={db.inquiries}
        onUpdateDb={(updatedInqs) => handleUpdateDb({ ...db, inquiries: updatedInqs })}
        accentColor={accentColor}
        mode="blog"
      />

      {/* 6. Footer Disclaimer & Corporate Identifiers */}
      <Footer 
        siteSettings={db.siteSettings} 
        accentColor={accentColor} 
      />

      {/* Dynamic rounding injector helper class via inline style if needed, or through prop passing */}
      <style>{`
        .glass-card, .glass-panel, .btn-themed {
          border-radius: ${db.designSettings.buttonRoundness === 'Square' ? '0px' : db.designSettings.buttonRoundness === 'Pill' ? '9999px' : '16px'} !important;
        }
        button, input, textarea, select {
          border-radius: ${db.designSettings.buttonRoundness === 'Square' ? '0px' : db.designSettings.buttonRoundness === 'Pill' ? '9999px' : '10px'} !important;
        }
      `}</style>
    </div>
  );
}
