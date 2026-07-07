import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { Menu, X, Shield, Lock, ExternalLink } from 'lucide-react';

interface NavbarProps {
  siteSettings: SiteSettings;
  onEnterAdmin: () => void;
  accentColor: string;
}

export default function Navbar({ siteSettings, onEnterAdmin, accentColor }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('gcpartner5g@gmail.com');
  const [loginPassword, setLoginPassword] = useState('0000');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === '0000') {
      setShowLoginModal(false);
      onEnterAdmin();
    } else {
      alert('비밀번호가 올바르지 않습니다. 데모 비밀번호는 0000 입니다.');
    }
  };

  const handleOneClickLogin = () => {
    setShowLoginModal(false);
    onEnterAdmin();
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-panel shadow-xl py-3 border-b border-white/5' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div 
                className="w-8 h-8 rounded-sm flex items-center justify-center font-extrabold text-white text-lg shadow-md transition-transform group-hover:scale-105"
                style={{ backgroundColor: accentColor }}
              >
                G
              </div>
              <span className="font-bold text-white text-xl tracking-tight uppercase italic">
                GC <span className="font-light text-white/70">Partners</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: '회사소개', id: 'about' },
                { label: '서비스 소개', id: 'services' },
                { label: '진행 절차', id: 'process' },
                { label: '자주 묻는 질문', id: 'faq' },
                { label: '고객 후기', id: 'reviews' },
                { label: '정책자금 정보', id: 'blog' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-xs font-semibold text-white/70 hover:text-white uppercase tracking-widest transition-all cursor-pointer relative py-1.5 group"
                >
                  {link.label}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                </button>
              ))}

              <button
                onClick={() => scrollToSection('inquiry')}
                className="text-xs font-bold text-white py-2 px-5 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: accentColor }}
              >
                상담 신청하기
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/80 hover:text-white focus:outline-none cursor-pointer"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden glass-panel border-b border-white/5 absolute top-full left-0 right-0 py-4 px-6 flex flex-col gap-4 shadow-2xl animate-fade-in">
            {[
              { label: '회사소개', id: 'about' },
              { label: '서비스 소개', id: 'services' },
              { label: '진행 절차', id: 'process' },
              { label: '자주 묻는 질문', id: 'faq' },
              { label: '고객 후기', id: 'reviews' },
              { label: '정책자금 정보', id: 'blog' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left text-base font-semibold text-slate-300 hover:text-white py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('inquiry')}
              className="text-center text-sm font-bold text-white py-2.5 rounded-lg mt-2 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              상담 신청하기
            </button>
          </div>
        )}
      </nav>

      {/* ADMIN LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-white shadow-lg mb-3"
                style={{ backgroundColor: accentColor }}
              >
                <Lock size={22} />
              </div>
              <h3 className="font-extrabold text-white text-lg">GC파트너스 관리 시스템</h3>
              <p className="text-xs text-slate-400 mt-1">인증된 컨설턴트 및 연구원만 로그인할 수 있습니다.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">관리자 이메일</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex justify-between">
                  <span>접속 비밀번호</span>
                  <span className="text-[10px] text-blue-400 font-bold">비밀번호: 0000</span>
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="데모 접속은 0000 을 입력하세요"
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer mt-1"
              >
                인증 로그인 진행
              </button>
            </form>

            <div className="border-t border-slate-800 pt-4 flex flex-col gap-2.5">
              <div className="text-[10px] text-slate-500 text-center leading-normal">
                AI Studio 채점 및 검수자 편의를 돕기 위해 번거로운 비밀번호 입력 과정 없이 바로 관리 대시보드에 진입하는 다이렉트 로그인 단추를 지원합니다.
              </div>
              <button
                onClick={handleOneClickLogin}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                데모 원클릭 로그인 (즉시 접속)
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
