import React, { useEffect, useRef, useState } from 'react';
// Thêm dòng này vào phần import
import Chatbot from './Chatbot';
import { 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Calendar, 
  Star, 
  Share2, 
  ArrowRight, 
  AlertCircle, 
  BarChart3, 
  Cpu, 
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  XCircle,
  Menu,
  Quote,
  Send,
  Loader2
} from 'lucide-react';

// --- Helper Components ---

const useReveal = () => {
  const elementsRef = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    elementsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };
};

const Section = ({ children, className = "", id = "", reveal = true }: { children?: React.ReactNode, className?: string, id?: string, reveal?: boolean }) => {
  const setRevealRef = useReveal();
  return (
    <section id={id} className={`py-16 md:py-24 px-6 md:px-12 lg:px-24 ${className} ${reveal ? 'reveal' : ''}`} ref={reveal ? setRevealRef : null}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
};

const CTAButton = ({ text, onClick, variant = 'primary', className = "", type = "button", disabled = false, icon: Icon = ArrowRight }: { text: string, onClick?: () => void, variant?: 'primary' | 'secondary', className?: string, type?: "button" | "submit", disabled?: boolean, icon?: any }) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`group px-6 py-4 md:px-8 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
      variant === 'primary' 
      ? 'gold-bg text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
      : 'border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black bg-transparent'
    } ${className}`}
  >
    {text}
    <Icon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
  </button>
);

const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:rotate-0">
      <img
        src="logo.png"
        alt="PiduDigital Logo"
        className="w-full h-full object-contain"
      />
    </div>
    <span className="text-xl font-black tracking-tighter text-white uppercase">
      Pidu<span className="text-[#d4af37]">Digital</span>
    </span>
  </div>
);


const ConsultationForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
  
    try {
      const res = await fetch("http://localhost:4000/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        }),
      });
      
      const text = await res.text(); 
      console.log("RESPONSE STATUS:", res.status);
      console.log("RESPONSE TEXT:", text);
  
      if (!res.ok) throw new Error(text);
  
      setStatus('success');
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      setStatus('idle');
    }
  };
  

  if (status === 'success') {
    return (
      <div className="glass-card p-8 md:p-12 rounded-3xl border border-[#d4af37]/30 text-center animate-float">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white">Gửi thông tin thành công!</h3>
        <p className="text-gray-400 mb-8">Cảm ơn bạn đã quan tâm. Đội ngũ chuyên gia của PiduDigital sẽ liên hệ với bạn qua số điện thoại <b>{formData.phone}</b> trong vòng 24h tới.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-[#d4af37] font-bold underline hover:text-white transition-colors"
        >
          Gửi lại form khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-3xl border border-gray-800 text-left shadow-2xl">
      <h3 className="text-2xl font-bold mb-8 text-center md:text-left">Đăng ký nhận <span className="gold-text">Tư vấn 1-kèm-1</span></h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Họ và tên *</label>
          <input 
            required
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Số điện thoại *</label>
            <input 
              required
              type="tel"
              placeholder="09xx xxx xxx"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input 
              type="email"
              placeholder="ten@gmail.com"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <p className="text-[10px] text-gray-500 italic">
          * Thông tin của bạn được bảo mật tuyệt đối theo chính sách của PiduDigital.
        </p>

        <CTAButton 
          type="submit"
          text={status === 'loading' ? "Đang xử lý..." : "Gửi thông tin ngay"} 
          className="w-full"
          disabled={status === 'loading'}
          icon={status === 'loading' ? Loader2 : Send}
        />
      </div>
    </form>
  );
};

// --- Main App ---

export default function App() {
  const scrollToFinal = () => {
    document.getElementById('consult-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  const comPare = () => {
    document.getElementById('compare-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  const Solution = () => {
    document.getElementById('Solution-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0f1115]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 glass-card">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex gap-8 items-center text-sm font-medium">
            <button
              onClick={Solution}
              className="text-white hover:text-[#d4af37] transition-colors font-medium"
            >
              Giải pháp
            </button>
            <button
              onClick={comPare}
              className="text-white hover:text-[#d4af37] transition-colors font-medium"
            >
              So sánh
            </button>
            <CTAButton text="Tư vấn ngay" onClick={scrollToFinal} className="!py-2 !px-4 !text-sm" />
          </div>
          <Menu className="md:hidden w-6 h-6 text-[#d4af37]" />
        </div>
      </nav>

      {/* 1. Hero Section */}
      <Section
        reveal={false}
        className="relative pt-40 pb-24 md:pb-40 overflow-hidden bg-gradient-to-b from-black to-[#0f1115]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* LEFT: TEXT */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-block py-3 text-lg px-4 bg-gray-900 border border-gray-800 rounded-full mb-8 text-[#d4af37] tracking-wide animate-pulse">
              Giảm 50% công việc tay chân cho chủ doanh nghiệp
            </div>

            <h2 className="text-3x2 md:text-6xl lg:text-7x2 font-bold mb-8 leading-tight">
              Bạn đang tốn quá nhiều thời gian cho việc <br/>
            </h2>
              <span className="gold-text text-3x2 md:text-6xl lg:text-7x2 font-bold mb-8 leading-tight">lặp đi lặp lại mỗi ngày?</span>


            <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-xl leading-relaxed">
              Đừng để bản thân bị kẹt trong đống tin nhắn và lịch hẹn. Hệ thống của chúng tôi làm việc{" "}
              <span className="text-white font-bold">24/7</span> giúp bạn gỡ bỏ gánh nặng vận hành.
            </p>

            <div className="hidden md:block">
              <CTAButton text="Đặt lịch tư vấn miễn phí" onClick={scrollToFinal} />
            </div>
          </div>

          {/* RIGHT: VIDEO */}
{/* RIGHT: VIDEO */}
<div className="relative">
  {/* Glow */}
  <div className="absolute inset-0 bg-[#d4af37]/20 blur-3xl rounded-full"></div>

  {/* VIDEO CONTAINER */}
  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800">
    <video
      className="w-full h-full object-cover"
      src="https://res.cloudinary.com/dwlwf7amq/video/upload/v1773389747/Final_arihbm.mp4"
      autoPlay
      muted
      loop
      playsInline
      controls
    />
  </div>

  {/* CTA chỉ hiện trên mobile */}
  <div className="mt-8 md:hidden">
    <CTAButton text="Đặt lịch tư vấn miễn phí" onClick={scrollToFinal} />
  </div>
</div>
</div>
      </Section>

      {/* 2. Pain Section */}
      <Section className="bg-[#1a1d23] relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Mỗi ngày của bạn có phải là <span className="text-[#d4af37]">một vòng lặp mệt mỏi?</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">Chúng tôi thấu hiểu những áp lực không tên mà bạn đang gánh vác.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: MessageSquare, title: "Trực tin nhắn", text: "Điện thoại rung liên tục từ Messenger, Zalo suốt cả ngày lẫn đêm." },
            { icon: Share2, title: "Áp lực đăng bài", text: "Biết là phải đăng bài nhưng không có thời gian sáng tạo nội dung đều đặn." },
            { icon: Calendar, title: "Rối loạn lịch hẹn", text: "Ghi chép lịch khách bằng sổ tay và lo sợ bị trùng lịch hoặc quên khách." },
            { icon: Star, title: "Bỏ bê đánh giá", text: "Khách khen/chê trên Google Maps nhưng bạn bận đến mức chẳng thể phản hồi, khiến cho thứ hạng Google Map tụt giảm so với đối thủ." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-[#d4af37]/50 transition-all hover:bg-gray-800/60 group">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-[#d4af37]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <CTAButton text="Tôi muốn thoát khỏi vòng lặp này" onClick={scrollToFinal} />
        </div>
      </Section>

      {/* 3. Amplified Pain Section */}
      <Section className="bg-black">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
              Cái giá thực sự của việc <span className="text-red-500">làm thủ công...</span>
            </h2>
            <div className="space-y-6 md:space-y-8">
              {[
                { title: "Mất khách vào tay đối thủ", text: "Khách nhắn tin mà 15 phút chưa thấy trả lời? Họ đã sang đối thủ của bạn." },
                { title: "Sai sót từ con người", text: "Lúc mệt mỏi, bạn sẽ ghi nhầm số, nhầm lịch. Một khách phàn nàn là mất cả uy tín." },
                { title: "Hình ảnh thiếu chuyên nghiệp", text: "Trang Fanpage 'mốc meo' không đăng bài khiến khách nghi ngờ bạn ngừng hoạt động." },
                { title: "Kế hoạch kinh doanh dậm chân", text: "Bạn quá bận việc vặt nên chẳng còn thời gian để nghĩ cách kiếm thêm tiền." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0"><XCircle className="w-6 h-6 text-red-500" /></div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{item.title}</h4>
                    <p className="text-gray-400 text-sm md:text-base">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-square bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full flex items-center justify-center border border-gray-800 p-8 md:p-12">
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-red-500 rotate-180" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-300 italic leading-relaxed">"Đối thủ đang dùng AI để đi nhanh hơn, còn bạn vẫn gõ phím tay?"</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <CTAButton text="Bắt đầu tự động hóa ngay" onClick={scrollToFinal} />
        </div>
      </Section>

      {/* 4. Cost Comparison */}
      <Section id='compare-form' className="bg-[#0f1115]">
        <h2 className="text-2xl md:text-4xl font-bold mb-12 md:mb-16 text-center px-4">Đầu tư vào đâu hiệu quả hơn?</h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-2">
          <div className="p-6 md:p-8 rounded-2xl bg-gray-900/30 border border-gray-800">
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-gray-500" />
              Thuê nhân viên trực tin
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm md:text-base">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></span>Lương: 8tr - 12tr/tháng + Thưởng</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></span>Chỉ làm việc 8-10 tiếng/ngày</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></span>Cần đào tạo, quản lý sát sao</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></span>Dễ nghỉ việc, ảnh hưởng tâm lý</li>
            </ul>
          </div>
          <div className="p-6 md:p-8 rounded-2xl bg-[#1a1d23] border-2 border-[#d4af37] relative overflow-hidden group">
            <div className="absolute top-0 right-0 gold-bg text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">Khuyên dùng</div>
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#d4af37]" />
              Hệ thống PiduDigital AI & Automation
            </h3>
            <ul className="space-y-4 text-gray-200 text-sm md:text-base">
              <li className="flex items-center gap-3 font-semibold"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />Chi phí 1 lần, sở hữu vĩnh viễn</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />Trực khách 24/7 không nghỉ lễ Tết</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />Tự động chốt lịch, không sai sót</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />Quản lý đơn giản qua Google Sheets</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <CTAButton text="Nhận báo giá chi tiết" onClick={scrollToFinal} />
        </div>
      </Section>

      {/* Solutions Track */}
      <div id="solutions">
        {/* 6. Solution 1 */}
        <Section id='Solution-form' className="bg-black">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-[#d4af37] font-bold text-sm uppercase tracking-widest">Hệ thống 01</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Trực tin nhắn & Đặt lịch tự động</h2>
              <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
                Hệ thống tự động trò chuyện với khách trên Facebook/Zalo, xin thông tin và đẩy lịch hẹn vào Google Calendar của bạn ngay lập tức.
              </p>
              <div className="space-y-4">
                {[
                  "Túc trực hệ thống, tư vấn khách hàng 24/7",
                  "Lấy Tên, SĐT, Dịch vụ khách cần.",
                  "Tự động báo giờ trống và chốt lịch.",
                ].map((txt, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#1a1d23] p-4 rounded-xl border border-gray-800">
                    <CheckCircle className="w-6 h-6 text-[#d4af37] flex-shrink-0" />
                    <p className="text-sm md:text-base text-gray-300">{txt}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900/50 p-6 md:p-8 rounded-3xl border border-gray-800 animate-float">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">KH</div>
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%]">"Mình muốn đặt lịch làm nail 3h chiều mai"</div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-[#d4af37] text-black p-3 rounded-2xl rounded-tr-none text-xs max-w-[80%] font-medium">"Chào bạn! 3h mai bên mình còn trống. Bạn cho mình xin SĐT để chốt lịch nhé?"</div>
                  <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center"><Cpu className="w-4 h-4 text-black" /></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">KH</div>
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%]">"0909xxxxxx bạn nhé"</div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-800 flex items-center gap-2 text-green-500 text-[10px] font-bold">
                  <Calendar className="w-4 h-4" /> ĐÃ ĐỒNG BỘ LỊCH HẸN VÀO GOOGLE CALENDAR
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 7. Solution 2 */}
        <Section className="bg-[#1a1d23]">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="p-6 md:p-8 bg-black rounded-3xl border border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-black text-sm">G</div>
                  <div>
                    <h4 className="font-bold text-sm">Đánh giá mới trên Maps</h4>
                    <div className="flex text-yellow-500"><Star className="fill-current w-3 h-3"/><Star className="fill-current w-3 h-3"/><Star className="fill-current w-3 h-3"/><Star className="fill-current w-3 h-3"/><Star className="fill-current w-3 h-3"/></div>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 text-xs italic">"Tiệm phục vụ rất chuyên nghiệp, mình rất hài lòng!"</p>
                <div className="p-4 bg-gray-900 rounded-xl text-xs text-blue-300 border border-blue-900/30 flex gap-2 items-start">
                  <Cpu className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>AI: "Cảm ơn bạn đã tin tưởng! Rất mong được gặp lại bạn..."</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-[#d4af37] font-bold text-sm uppercase tracking-widest">Hệ thống 02</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Quản lý Uy tín & Phản hồi</h2>
              <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
                Tăng thứ hạng trên Google Maps bằng cách trả lời 100% đánh giá của khách hàng ngay lập tức mà không cần động tay.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0"/> Tự động cảm ơn đánh giá 5 sao.</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0"/> Báo động qua Telegram khi có đánh giá xấu để xử lý nhanh.</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0"/> Giữ điểm uy tín luôn ở mức tối đa.</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0"/> Chèn từ khóa một cách hợp lý vào phản hồi giúp tăng mật độ từ khóa cho Google Map</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>

      {/* 9. Simplicity Section */}
      <Section className="bg-black overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <FileSpreadsheet className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Bạn chỉ cần dùng Google Sheets.</h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl mx-auto px-4">
            Mọi dữ liệu khách hàng, tin nhắn và báo cáo đều được đồng bộ tự động lên một trang tính đơn giản. <span className="text-white font-bold">Không phải học phần mềm mới.</span>
          </p>
          <div className="inline-flex items-center gap-3 text-[#d4af37] font-bold text-sm md:text-lg bg-gray-900/50 px-6 py-4 rounded-full border border-gray-800">
            <CheckCircle className="w-6 h-6 flex-shrink-0" /> Quản lý công việc kinh doanh ngay trên điện thoại.
          </div>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1/2 bg-green-500/5 blur-[120px] pointer-events-none"></div>
      </Section>

      {/* 11. Positioning & Leader Profile */}
      <Section id="positioning" className="bg-[#0f1115]">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Mỗi hệ thống là một <br /><span className="gold-text">kiệt tác "may đo".</span></h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Chúng tôi không bán giải pháp đại trà. PiduDigital đồng hành cùng bạn để thiết kế những luồng tự động hóa <span className="text-white font-bold">sát thực tế nhất</span> với mô hình kinh doanh của bạn.
            </p>
            
            <div className="p-6 bg-gray-900/50 rounded-3xl border border-gray-800 flex gap-6 items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0 border-2 border-[#d4af37]">
                <img
                  src="leader.jpg"
                  alt="Leader of Pidu"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">Quốc Nguyễn AI</h4>
                <p className="text-[#d4af37] text-sm mb-2">CEO & Nhà sáng lập PiduDigital</p>
                <div className="flex gap-1">
                   <Quote className="w-4 h-4 text-gray-600 fill-current" />
                   <p className="text-xs text-gray-400 italic">"Chúng tôi ở đây để giúp bạn rảnh tay hơn."</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {[
              { step: "01", title: "Khảo sát thực tế", text: "Chúng tôi tìm ra các điểm yếu và việc vặt đang ngốn thời gian của bạn." },
              { step: "02", title: "Xây dựng hệ thống", text: "Thiết kế luồng AI trực tin và chốt lịch theo phong cách phục vụ của bạn." },
              { step: "03", title: "Bàn giao & Vận hành", text: "Bạn chỉ mất 15 phút để làm quen và bắt đầu rảnh tay ngay lập tức." },
              { step: "04", title: "Thực chiến", text: "Chốt đơn khách hàng online liên tục và tự động hóa quy trình." }
            ].map((s, idx) => (
              <div key={idx} className="flex gap-6 items-start p-6 glass-card rounded-2xl hover:border-[#d4af37]/30 transition-colors">
                <span className="text-2xl md:text-3xl font-black text-gray-800 group-hover:text-[#d4af37]">{s.step}</span>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white">{s.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <CTAButton text="Đăng ký nhận tư vấn ngay" onClick={scrollToFinal} />
        </div>
      </Section>

      {/* Form Section */}
      <Section id="consult-form" className="bg-[#1a1d23]">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Sẵn sàng để bước vào kỷ nguyên <span className="gold-text">tự động hóa?</span></h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Điền thông tin bên cạnh để đội ngũ kỹ thuật của PiduDigital có thể phân tích sơ bộ mô hình kinh doanh của bạn trước khi chúng ta bắt đầu buổi tư vấn.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-gray-300 font-medium">Tư vấn hoàn toàn miễn phí</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-gray-300 font-medium">Lộ trình triển khai chi tiết sau 30 phút</span>
              </div>
            </div>
          </div>
          <div>
            <ConsultationForm />
          </div>
        </div>
      </Section>

      {/* 12. Final CTA Section */}
      <Section id="final-cta" className="bg-gradient-to-t from-black to-[#0f1115] text-center pb-32">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold mb-8">Lấy lại tự do cho <br /><span className="gold-text">chính mình ngay hôm nay!</span></h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 px-4 leading-relaxed">
            Chúng tôi cam kết giúp doanh nghiệp bạn vận hành trơn tru hơn, hiệu quả hơn và hiện đại hơn.
          </p>
          
          <div className="flex flex-col items-center gap-12">
            <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 glass-card rounded-[40px] border border-gray-800 shadow-2xl relative">
              <div className="absolute inset-0 bg-[#d4af37]/5 rounded-[40px] pointer-events-none"></div>
              
              <div className="w-40 h-40 bg-white p-3 rounded-2xl flex-shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                <div className="w-full h-full bg-[#0f1115] flex items-center justify-center border border-gray-100">
                  <BarChart3 className="w-16 h-16 text-[#d4af37]" />
                </div>
                <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-black font-bold uppercase">Quét Zalo</div>
              </div>

              <div className="text-left flex-1">
                <h4 className="text-xl md:text-2xl font-bold mb-4 text-white">Hoặc nhắn tin trực tiếp</h4>
                <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed">Quét mã QR để gặp trực tiếp chuyên gia kỹ thuật và nhận giải đáp tức thì cho mọi thắc mắc của bạn.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#d4af37]" /></div>
                    <span>Hotline: 09xx xxx xxx</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#d4af37]" /></div>
                    <span>Website: pidudigital.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo />
          <div className="flex gap-6 text-gray-500 text-sm font-medium">
            <a href="#" className="hover:text-white">Điều khoản</a>
            <a href="#" className="hover:text-white">Bảo mật</a>
            <a href="#" className="hover:text-white">Liên hệ</a>
          </div>
          <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} PiduDigital. Chuyên gia tự động hóa doanh nghiệp Việt.</p>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}