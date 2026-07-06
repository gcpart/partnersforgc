import React, { useState } from 'react';
import { Blog, Notice } from '../types';
import { Search, Plus, Edit3, Trash2, Calendar, User, Eye, EyeOff, Pin, CheckSquare, Square, FileText, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface AdminCMSProps {
  blogs: Blog[];
  onUpdateBlogs: (updated: Blog[]) => void;
  notices: Notice[];
  onUpdateNotices: (updated: Notice[]) => void;
}

// Predefined beautiful stock images to make creating blog posts extremely easy
const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80', name: '정책 자금 / 금융' },
  { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', name: '기업 인증 / 비즈니스 미팅' },
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', name: '창업 / 청년 협업' },
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', name: 'R&D / 연구실 기술 개발' },
  { url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80', name: '세무 / 세무 상담' },
];

export default function AdminCMS({ blogs, onUpdateBlogs, notices, onUpdateNotices }: AdminCMSProps) {
  const [activeTab, setActiveTab] = useState<'blogs' | 'notices'>('blogs');
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [noticeSearch, setNoticeSearch] = useState('');

  // Editing states
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Form states - Blog
  const [blogFormTitle, setBlogFormTitle] = useState('');
  const [blogFormContent, setBlogFormContent] = useState('');
  const [blogFormWriter, setBlogFormWriter] = useState('');
  const [blogFormCategory, setBlogFormCategory] = useState('정책자금');
  const [blogFormTags, setBlogFormTags] = useState('');
  const [blogFormImageUrl, setBlogFormImageUrl] = useState('');
  const [blogFormStatus, setBlogFormStatus] = useState<Blog['status']>('published');

  // Form states - Notice
  const [noticeFormTitle, setNoticeFormTitle] = useState('');
  const [noticeFormContent, setNoticeFormContent] = useState('');
  const [noticeFormWriter, setNoticeFormWriter] = useState('');
  const [noticeFormIsPinned, setNoticeFormIsPinned] = useState(false);

  // Filter lists
  const filteredBlogs = blogs.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          item.content.toLowerCase().includes(blogSearch.toLowerCase()) ||
                          item.writer.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesCategory = blogCategoryFilter === 'all' || item.category === blogCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredNotices = notices.filter(item => {
    return item.title.toLowerCase().includes(noticeSearch.toLowerCase()) || 
           item.content.toLowerCase().includes(noticeSearch.toLowerCase());
  }).sort((a, b) => {
    // Pinned notices first, then newest
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Open Blog form
  const handleOpenBlogForm = (blog: Blog | null) => {
    if (blog) {
      setSelectedBlog(blog);
      setBlogFormTitle(blog.title);
      setBlogFormContent(blog.content);
      setBlogFormWriter(blog.writer);
      setBlogFormCategory(blog.category);
      setBlogFormTags(blog.tags.join(', '));
      setBlogFormImageUrl(blog.imageUrl);
      setBlogFormStatus(blog.status);
    } else {
      setSelectedBlog(null);
      setBlogFormTitle('');
      setBlogFormContent('');
      setBlogFormWriter('GC컨설팅연구소');
      setBlogFormCategory('정책자금');
      setBlogFormTags('정책자금, 정부지원사업');
      setBlogFormImageUrl(PRESET_IMAGES[0].url);
      setBlogFormStatus('published');
    }
    setIsEditingBlog(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormTitle || !blogFormContent) {
      alert('제목과 내용을 반드시 입력해주세요.');
      return;
    }

    const tagsArray = blogFormTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const today = new Date().toISOString().split('T')[0];

    if (selectedBlog) {
      // Edit existing
      const updated = blogs.map(item => {
        if (item.id === selectedBlog.id) {
          return {
            ...item,
            title: blogFormTitle,
            content: blogFormContent,
            writer: blogFormWriter,
            category: blogFormCategory,
            tags: tagsArray,
            imageUrl: blogFormImageUrl || PRESET_IMAGES[0].url,
            status: blogFormStatus,
          };
        }
        return item;
      });
      onUpdateBlogs(updated);
      alert('블로그 게시글이 성공적으로 수정되었습니다.');
    } else {
      // Create new
      const newBlog: Blog = {
        id: `blog-${Date.now()}`,
        title: blogFormTitle,
        content: blogFormContent,
        writer: blogFormWriter,
        date: today,
        category: blogFormCategory,
        tags: tagsArray,
        imageUrl: blogFormImageUrl || PRESET_IMAGES[0].url,
        status: blogFormStatus,
        views: 0,
      };
      onUpdateBlogs([newBlog, ...blogs]);
      alert('새로운 블로그 게시글이 생성되었습니다.');
    }
    setIsEditingBlog(false);
    setSelectedBlog(null);
  };

  const handleDeleteBlog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('정말로 이 블로그 게시글을 삭제하시겠습니까?')) return;
    onUpdateBlogs(blogs.filter(item => item.id !== id));
    alert('블로그 게시글이 삭제되었습니다.');
  };

  // Open Notice form
  const handleOpenNoticeForm = (notice: Notice | null) => {
    if (notice) {
      setSelectedNotice(notice);
      setNoticeFormTitle(notice.title);
      setNoticeFormContent(notice.content);
      setNoticeFormWriter(notice.writer);
      setNoticeFormIsPinned(notice.isPinned);
    } else {
      setSelectedNotice(null);
      setNoticeFormTitle('');
      setNoticeFormContent('');
      setNoticeFormWriter('경영지원실');
      setNoticeFormIsPinned(false);
    }
    setIsEditingNotice(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeFormTitle || !noticeFormContent) {
      alert('제목과 내용을 반드시 입력해주세요.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (selectedNotice) {
      // Edit
      const updated = notices.map(item => {
        if (item.id === selectedNotice.id) {
          return {
            ...item,
            title: noticeFormTitle,
            content: noticeFormContent,
            writer: noticeFormWriter,
            isPinned: noticeFormIsPinned,
          };
        }
        return item;
      });
      onUpdateNotices(updated);
      alert('공지사항이 수정되었습니다.');
    } else {
      // Create
      const newNotice: Notice = {
        id: `not-${Date.now()}`,
        title: noticeFormTitle,
        content: noticeFormContent,
        writer: noticeFormWriter,
        date: today,
        isPinned: noticeFormIsPinned,
        views: 0,
      };
      onUpdateNotices([newNotice, ...notices]);
      alert('새로운 공지사항이 작성되었습니다.');
    }
    setIsEditingNotice(false);
    setSelectedNotice(null);
  };

  const handleDeleteNotice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) return;
    onUpdateNotices(notices.filter(item => item.id !== id));
    alert('공지사항이 삭제되었습니다.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub Tabs */}
      {!isEditingBlog && !isEditingNotice && (
        <div className="flex justify-between items-center border-b border-slate-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'blogs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              정책자금 정보 블로그 ({blogs.length})
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'notices' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              공지사항 관리 ({notices.length})
            </button>
          </div>

          <button
            onClick={() => activeTab === 'blogs' ? handleOpenBlogForm(null) : handleOpenNoticeForm(null)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={14} />
            새 게시글 작성
          </button>
        </div>
      )}

      {/* -------------------- BLOGS CMS SECTION -------------------- */}
      {activeTab === 'blogs' && !isEditingBlog && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="블로그 제목, 작성자, 내용 검색..."
                value={blogSearch}
                onChange={(e) => setBlogSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Category Filter */}
            <select
              value={blogCategoryFilter}
              onChange={(e) => setBlogCategoryFilter(e.target.value)}
              className="py-2 px-3 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">전체 카테고리</option>
              <option value="정책자금">정책자금</option>
              <option value="정부지원사업">정부지원사업</option>
              <option value="창업">창업</option>
              <option value="기업인증">기업인증</option>
              <option value="세무">세무</option>
              <option value="금융">금융</option>
            </select>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBlogs.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                일치하는 블로그 포스트가 없습니다.
              </div>
            ) : (
              filteredBlogs.map(blog => (
                <div 
                  key={blog.id} 
                  onClick={() => handleOpenBlogForm(blog)}
                  className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex gap-4 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
                >
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-24 h-24 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                          {blog.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {blog.status === 'published' ? (
                            <span className="text-[10px] text-emerald-400 font-medium">게시중</span>
                          ) : (
                            <span className="text-[10px] text-yellow-500 font-medium">임시저장</span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1.5 truncate group-hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {blog.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User size={10} /> {blog.writer}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {blog.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={10} /> {blog.views}회
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteBlog(blog.id, e)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800"
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* -------------------- BLOG EDIT / FORM -------------------- */}
      {activeTab === 'blogs' && isEditingBlog && (
        <form onSubmit={handleSaveBlog} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingBlog(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <h3 className="font-bold text-white text-base">
                {selectedBlog ? '블로그 게시글 수정' : '새로운 블로그 게시글 작성'}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingBlog(false)}
                className="py-1.5 px-3 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              >
                게시글 저장
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Fields Left */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">게시글 제목</label>
                <input
                  type="text"
                  value={blogFormTitle}
                  onChange={(e) => setBlogFormTitle(e.target.value)}
                  placeholder="예: 2026 정부 정책자금 무상지원 사업 완전정복"
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">본문 내용</label>
                <textarea
                  rows={14}
                  value={blogFormContent}
                  onChange={(e) => setBlogFormContent(e.target.value)}
                  placeholder="고품질 컨설팅 정보글 본문을 상세하게 작성하세요. 줄바꿈과 여백을 지원합니다..."
                  className="w-full p-3.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 leading-relaxed font-mono resize-y"
                  required
                ></textarea>
              </div>
            </div>

            {/* Form Fields Right */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">카테고리</label>
                <select
                  value={blogFormCategory}
                  onChange={(e) => setBlogFormCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="정책자금">정책자금</option>
                  <option value="정부지원사업">정부지원사업</option>
                  <option value="창업">창업</option>
                  <option value="기업인증">기업인증</option>
                  <option value="세무">세무</option>
                  <option value="금융">금융</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">작성인 / 부서</label>
                <input
                  type="text"
                  value={blogFormWriter}
                  onChange={(e) => setBlogFormWriter(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  placeholder="예: 금융전략연구원"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={blogFormTags}
                  onChange={(e) => setBlogFormTags(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  placeholder="예: 정책자금, 이노비즈, 스타트업"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">공개 상태 설정</label>
                <div className="flex gap-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="blogStatus"
                      checked={blogFormStatus === 'published'}
                      onChange={() => setBlogFormStatus('published')}
                      className="text-blue-500 bg-slate-900 border-slate-800 focus:ring-0"
                    />
                    공개 게시
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="blogStatus"
                      checked={blogFormStatus === 'draft'}
                      onChange={() => setBlogFormStatus('draft')}
                      className="text-blue-500 bg-slate-900 border-slate-800 focus:ring-0"
                    />
                    임시저장
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <ImageIcon size={14} className="text-blue-400" />
                  대표 이미지 (썸네일 URL)
                </label>
                <input
                  type="text"
                  value={blogFormImageUrl}
                  onChange={(e) => setBlogFormImageUrl(e.target.value)}
                  placeholder="Unsplash 또는 기타 웹 이미지 주소를 입력하세요..."
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
                
                {/* Image presets */}
                <div className="mt-2">
                  <span className="text-[10px] text-slate-500 font-medium block mb-1">프리셋 이미지에서 빠른 선택:</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBlogFormImageUrl(img.url)}
                        className={`border rounded overflow-hidden aspect-square ${blogFormImageUrl === img.url ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                        title={img.name}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* -------------------- NOTICES CMS SECTION -------------------- */}
      {activeTab === 'notices' && !isEditingNotice && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="공지사항 제목 및 본문 검색..."
              value={noticeSearch}
              onChange={(e) => setNoticeSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">고정</th>
                    <th className="py-3 px-4">공지 제목</th>
                    <th className="py-3 px-4">작성자</th>
                    <th className="py-3 px-4">등록일</th>
                    <th className="py-3 px-4">조회수</th>
                    <th className="py-3 px-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredNotices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        작성된 공지사항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredNotices.map(notice => (
                      <tr 
                        key={notice.id} 
                        onClick={() => handleOpenNoticeForm(notice)}
                        className={`cursor-pointer hover:bg-slate-800/40 transition-colors ${notice.isPinned ? 'bg-blue-950/20' : ''}`}
                      >
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button 
                            type="button"
                            onClick={() => {
                              const updated = notices.map(n => n.id === notice.id ? { ...n, isPinned: !n.isPinned } : n);
                              onUpdateNotices(updated);
                            }}
                            className={`${notice.isPinned ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
                            title={notice.isPinned ? '상단 고정 해제' : '상단 고정 지정'}
                          >
                            <Pin size={15} fill={notice.isPinned ? 'currentColor' : 'none'} />
                          </button>
                        </td>
                        <td className="py-4 px-4 font-medium text-white max-w-xs md:max-w-md truncate">
                          {notice.isPinned && (
                            <span className="inline-block mr-2 text-[10px] bg-red-950 text-red-400 border border-red-900 px-1.5 py-0.5 rounded font-bold">
                              필독
                            </span>
                          )}
                          {notice.title}
                        </td>
                        <td className="py-4 px-4 text-slate-300 text-xs">
                          {notice.writer}
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs">
                          {notice.date}
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs">
                          {notice.views}회
                        </td>
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleOpenNoticeForm(notice)}
                              className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800 transition-colors"
                              title="수정"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteNotice(notice.id, e)}
                              className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                              title="삭제"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- NOTICE EDIT / FORM -------------------- */}
      {activeTab === 'notices' && isEditingNotice && (
        <form onSubmit={handleSaveNotice} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingNotice(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <h3 className="font-bold text-white text-base">
                {selectedNotice ? '공지사항 수정' : '새로운 공지사항 작성'}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingNotice(false)}
                className="py-1.5 px-3 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              >
                공지사항 저장
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">공지사항 제목</label>
                <input
                  type="text"
                  value={noticeFormTitle}
                  onChange={(e) => setNoticeFormTitle(e.target.value)}
                  placeholder="예: [안내] 2026 하반기 주요 일정 안내"
                  className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">작성인 부서/직책</label>
                  <input
                    type="text"
                    value={noticeFormWriter}
                    onChange={(e) => setNoticeFormWriter(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    placeholder="예: 경영지원팀"
                  />
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => setNoticeFormIsPinned(!noticeFormIsPinned)}
                      className="text-blue-500 focus:outline-none"
                    >
                      {noticeFormIsPinned ? (
                        <CheckSquare size={18} className="text-blue-500" />
                      ) : (
                        <Square size={18} className="text-slate-600" />
                      )}
                    </button>
                    공지사항 상단에 고정 (필독 공지)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">공지 내용 본문</label>
              <textarea
                rows={12}
                value={noticeFormContent}
                onChange={(e) => setNoticeFormContent(e.target.value)}
                placeholder="공지 본문을 성의 있게 상세히 작성하세요..."
                className="w-full p-3.5 bg-slate-950 text-white border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 leading-relaxed font-mono resize-y"
                required
              ></textarea>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
