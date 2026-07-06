import React, { useState } from 'react';
import { Inquiry } from '../types';
import { Search, Filter, MessageSquare, Save, Trash2, Calendar, Phone, Mail, Building, FileText, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface AdminInquiriesProps {
  inquiries: Inquiry[];
  onUpdateInquiries: (updated: Inquiry[]) => void;
}

export default function AdminInquiries({ inquiries, onUpdateInquiries }: AdminInquiriesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [memoText, setMemoText] = useState('');
  const [tempStatus, setTempStatus] = useState<Inquiry['status']>('unprocessed');

  // Filter inquiries
  const filtered = inquiries.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setMemoText(inquiry.memo);
    setTempStatus(inquiry.status);
  };

  const handleSaveInquiryChanges = () => {
    if (!selectedInquiry) return;
    
    const updated = inquiries.map(item => {
      if (item.id === selectedInquiry.id) {
        return {
          ...item,
          memo: memoText,
          status: tempStatus
        };
      }
      return item;
    });

    onUpdateInquiries(updated);
    
    // Update active selected inquiry view
    setSelectedInquiry({
      ...selectedInquiry,
      memo: memoText,
      status: tempStatus
    });

    alert('상담 내역이 성공적으로 저장되었습니다.');
  };

  const handleDeleteInquiry = (id: string) => {
    if (!confirm('정말로 이 상담 문의를 삭제하시겠습니까? 복구할 수 없습니다.')) return;
    
    const updated = inquiries.filter(item => item.id !== id);
    onUpdateInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
    alert('상담 문의가 삭제되었습니다.');
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'unprocessed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-950 text-yellow-300 border border-yellow-800">접수대기</span>;
      case 'consulting':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-950 text-blue-300 border border-blue-800">상담중</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">완료됨</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-950 text-rose-300 border border-rose-800">취소됨</span>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inquiry List */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="고객명, 회사명, 문의내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="unprocessed">접수대기</option>
              <option value="consulting">상담중</option>
              <option value="completed">완료됨</option>
              <option value="cancelled">취소됨</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table Container */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">고객 / 기업</th>
                  <th className="py-3 px-4">연락처 / 이메일</th>
                  <th className="py-3 px-4">접수 일시</th>
                  <th className="py-3 px-4">진행 상태</th>
                  <th className="py-3 px-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      신청된 상담 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => handleSelectInquiry(item)}
                      className={`cursor-pointer hover:bg-slate-800/40 transition-colors ${selectedInquiry?.id === item.id ? 'bg-slate-800/60' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.company}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white text-xs">{item.contact}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{item.email}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-300">
                        {item.date}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDeleteInquiry(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inquiry Detail & Memo Panel */}
      <div className="lg:col-span-1">
        {selectedInquiry ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-5 sticky top-24">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">상담 상세 내역</h3>
                <p className="text-xs text-slate-400 mt-1">접수번호: {selectedInquiry.id}</p>
              </div>
              <div>
                {getStatusBadge(selectedInquiry.status)}
              </div>
            </div>

            {/* Profile info */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 flex items-center justify-center text-blue-400">
                  <Building size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">회사명</div>
                  <div className="font-medium text-white">{selectedInquiry.company}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 flex items-center justify-center text-blue-400">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">의뢰자 성함</div>
                  <div className="font-medium text-white">{selectedInquiry.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 flex items-center justify-center text-blue-400">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">연락처</div>
                  <div className="font-medium text-white">{selectedInquiry.contact}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 flex items-center justify-center text-blue-400">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">이메일 주소</div>
                  <div className="font-medium text-white">{selectedInquiry.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 flex items-center justify-center text-blue-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">접수일시</div>
                  <div className="font-medium text-white">{selectedInquiry.date}</div>
                </div>
              </div>
            </div>

            {/* Request content */}
            <div className="border-t border-slate-800 pt-4">
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <MessageSquare size={14} className="text-blue-400" />
                고객 문의 내용
              </div>
              <div className="bg-slate-950 p-3.5 rounded-lg text-slate-300 text-xs leading-relaxed max-h-[180px] overflow-y-auto whitespace-pre-wrap border border-slate-800">
                {selectedInquiry.content}
              </div>
            </div>

            {/* Admin Controls */}
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">진행 상태 변경</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempStatus('unprocessed')}
                    className={`py-1.5 px-3 rounded text-xs border font-medium transition-colors ${tempStatus === 'unprocessed' ? 'bg-yellow-950 text-yellow-300 border-yellow-700' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                  >
                    대기
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStatus('consulting')}
                    className={`py-1.5 px-3 rounded text-xs border font-medium transition-colors ${tempStatus === 'consulting' ? 'bg-blue-950 text-blue-300 border-blue-700' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                  >
                    상담중
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStatus('completed')}
                    className={`py-1.5 px-3 rounded text-xs border font-medium transition-colors ${tempStatus === 'completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                  >
                    완료
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStatus('cancelled')}
                    className={`py-1.5 px-3 rounded text-xs border font-medium transition-colors ${tempStatus === 'cancelled' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                  >
                    취소
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">관리자 메모</label>
                <textarea
                  rows={4}
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  placeholder="상담 결과, 특이사항, 연락 가능 시간 등을 메모해두세요..."
                  className="w-full p-2.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 placeholder-slate-600 resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSaveInquiryChanges}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                <Save size={14} />
                메모 및 상태 저장하기
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 flex flex-col items-center gap-3 justify-center h-full min-h-[300px]">
            <MessageSquare size={36} className="text-slate-600 animate-pulse" />
            <div>
              <h4 className="font-semibold text-white mb-1 text-sm">상담 내용 상세 보기</h4>
              <p className="text-xs text-slate-400 leading-normal max-w-[200px] mx-auto">
                좌측 표에서 상담 내역을 클릭하시면 이곳에서 상세 내용을 확인하고 상태 변경과 메모를 작성할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
