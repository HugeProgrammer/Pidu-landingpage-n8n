/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Thay bằng API Key của bạn (Khuyến cáo sau này nên dùng biến môi trường import.meta.env.VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

// 1. DATA VÀ PROMPT CỦA BẠN ĐẶT Ở ĐÂY
const SYSTEM_INSTRUCTION = `
Bạn là trợ lý ảo AI cao cấp của PiduDigital - Chuyên gia tự động hóa doanh nghiệp Việt.
Thông tin về PiduDigital:
- Chúng tôi cung cấp giải pháp AI giúp doanh nghiệp rảnh tay: Trực tin nhắn 24/7, tự động chốt lịch hẹn vào Google Calendar, trả lời review trên Google Maps tự động.
- Điểm mạnh: Quản lý cực kỳ đơn giản chỉ qua Google Sheets, không cần học phần mềm mới. Chi phí 1 lần, sở hữu vĩnh viễn. Đội ngũ kỹ thuật hỗ trợ "may đo" sát thực tế doanh nghiệp.

Mục tiêu của bạn:
- Giải đáp thắc mắc chuyên nghiệp, thân thiện.
- NHIỆM VỤ QUAN TRỌNG NHẤT: Thu thập ĐẦY ĐỦ 4 thông tin của khách hàng như một chuyên viên sale khéo léo:
  1. Tên khách hàng
  2. Số điện thoại
  3. Yêu cầu/Vấn đề của khách hàng (Khách đang gặp khó khăn gì, cần giải pháp gì)
  4. Tên công ty / Doanh nghiệp / Tên cửa hàng

CHIẾN LƯỢC GOM NHẶT THÔNG TIN (RẤT QUAN TRỌNG):
- Khách hàng thường không cung cấp đủ 4 thông tin trong 1 tin nhắn. Hãy tận dụng "Trí nhớ" từ Lịch sử trò chuyện của bạn để tổng hợp.
- KIỂM TRA CHECKLIST: Mỗi khi phản hồi, hãy tự nhẩm xem mình đã có đủ 4 thông tin chưa. 
- NẾU THIẾU: Hãy đặt câu hỏi thật tự nhiên để xin thông tin còn thiếu. 
  (Ví dụ: Nếu khách mới cho Tên, SĐT và Yêu cầu, hãy nói: "Dạ để bên em thiết kế luồng tự động hóa chuẩn nhất, anh/chị cho em xin thêm tên công ty hoặc cửa hàng nhà mình nhé!")
- Tuyệt đối không hỏi như tra khảo (hỏi 1 lúc 3-4 thông tin), hãy rải ra hỏi một cách trò chuyện mượt mà.

QUY TẮC XUẤT DỮ LIỆU (CHỈ KÍCH HOẠT KHI ĐÃ ĐỦ 4 THÔNG TIN):
Khi và CHỈ KHI bạn đã thu thập đủ 100% cả 4 thông tin trên từ suốt quá trình chat, bạn BẮT BUỘC phải làm 2 việc ở tin nhắn chốt hạ:
1. Gửi lời cảm ơn, tóm tắt lại nhu cầu và báo chuyên gia sẽ gọi điện.
2. Nối tiếp ngay sau lời cảm ơn, chèn CHÍNH XÁC cấu trúc JSON sau ở cuối cùng:
[SAVE_LEAD: {"name": "[Tên]", "phone": "[SĐT]", "request": "[Yêu cầu]", "company": "[Công ty]"}]

LƯU Ý: Tuyệt đối KHÔNG xuất ra mã [SAVE_LEAD...] nếu vướng bất kỳ thông tin nào trong 4 mục trên. Hãy kiên nhẫn hỏi cho đến khi đủ.
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_INSTRUCTION,
});

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
      { role: 'model', text: `Chào bạn 👋
  Mình là trợ lý AI của PiduDigital. Mình có thể giúp doanh nghiệp tự động hóa nhiều công việc như trả lời khách hàng, đăng bài, chăm sóc đánh giá và đặt lịch hẹn.

  Để mình tư vấn đúng giải pháp cho bạn, bạn đang quan tâm đến phần nào nhất?
  1️⃣ Tự động trả lời tin nhắn khách hàng (Messenger, Zalo...)
  2️⃣ AI tạo nội dung và tự đăng bài cho fanpage
  3️⃣ Tự động trả lời đánh giá trên Google Maps
  4️⃣ Tự động đặt lịch hẹn với khách hàng
  5️⃣ Tìm hiểu tổng thể giải pháp AI cho doanh nghiệp

  Bạn chỉ cần chọn số hoặc nói nhu cầu của bạn, mình sẽ giải thích chi tiết và gửi demo phù hợp nhé.` }
    ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null); // Lưu trữ lịch sử chat để Gemini nhớ context

  useEffect(() => {
    const initChat = async () => {
      try {
        // 1. LINK API GOOGLE DOCS
        const DOCS_API_URL = "https://script.google.com/macros/s/AKfycbwiw87cBlSA4BmWQ5GpcUHtn-w0NrYT9pwVpCywNNyePgl6H_FbVOfOjLmtLXwLVkufJw/exec";
        
        const res = await fetch(DOCS_API_URL);
        const data = await res.json();
        
        // 3. Ghép Prompt cố định với Kiến thức từ Docs
        const combinedInstruction = SYSTEM_INSTRUCTION + 
          "\n\n=== DỮ LIỆU KIẾN THỨC TỪ GOOGLE DOCS (Dùng để trả lời khách) ===\n" + 
          (data.knowledge || "Chưa có thông tin");

        // 4. Khởi tạo lại Model với bộ não mới
        const dynamicModel = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          systemInstruction: combinedInstruction,
        });

        // 5. 👇 SỬA LỖI TẠI ĐÂY: Ép lịch sử mồi phải có câu của User trước
        const defaultHistory = [
          { role: "user", parts: [{ text: "Hello" }] },
          { role: "model", parts: [{ text: "Chào bạn! Mình là trợ lý AI của PiduDigital. Mình có thể giúp gì cho doanh nghiệp của bạn hôm nay?" }] }
        ];

        // 6. Bắt đầu phiên chat
        chatRef.current = dynamicModel.startChat({
          history: defaultHistory,
        });
        
        console.log("✅ Đã nạp thành công kiến thức từ Google Docs vào não AI!");

      } catch (error) {
        console.error("❌ Lỗi khi đọc Google Docs:", error);
        
        // Nếu lỗi mạng, khởi tạo bằng não mặc định (cũng phải dùng lịch sử mồi)
        const defaultHistory = [
          { role: "user", parts: [{ text: "Hello" }] },
          { role: "model", parts: [{ text: "Chào bạn! Mình là trợ lý AI của PiduDigital." }] }
        ];
        chatRef.current = model.startChat({
           history: defaultHistory
        });
      }
    };

    initChat();
  }, []); // Chỉ chạy 1 lần khi load trang

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // 1. Gửi tin nhắn cho AI
      const result = await chatRef.current.sendMessage(userText);
      let responseText = result.response.text();

      // 2. Kiểm tra xem AI có xuất ra đoạn mã chốt sale [SAVE_LEAD: ...] không
      const leadRegex = /\[SAVE_LEAD:\s*(\{.*?\})\s*\]/;
      const match = responseText.match(leadRegex);
// IN RA XEM AI NHẢ CÁI GÌ
      console.log("AI TRẢ VỀ:", responseText);

      // 2. CÁCH BẮT MÃ MỚI BẰNG INDEXOF (Chính xác 100%)
      const startIdx = responseText.indexOf("[SAVE_LEAD:");
      
      if (startIdx !== -1) {
        const endIdx = responseText.indexOf("]", startIdx);
        
        if (endIdx !== -1) {
          // Lấy nguyên cục [SAVE_LEAD: {"name":"...", "phone":"..."}]
          const leadString = responseText.substring(startIdx, endIdx + 1);
          
          // Lấy phần JSON ở bên trong: {"name":"...", "phone":"..."}
          const jsonString = leadString.replace("[SAVE_LEAD:", "").replace("]", "").trim();
          
          try {
            const leadData = JSON.parse(jsonString);
            console.log("ĐÃ BẮT ĐƯỢC THÔNG TIN:", leadData);
            
            // 3. GỌI API GỬI LÊN GOOGLE SHEETS
            const scriptUrl = "https://script.google.com/macros/s/AKfycbwDB3RnDUVoDC6Jt67ML-qVnAQl7H3_8UuuAVIHZtviXzHUJ4wSPUTZjnHWUw0jXJPOfg/exec"; 
            
            fetch(scriptUrl, {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "text/plain;charset=utf-8",
              },
              body: JSON.stringify(leadData),
            })
            .then(() => console.log("✅ Đã gửi lệnh lên Google Sheets!"))
            .catch(err => console.error("❌ Lỗi mạng:", err));

            // 4. Cắt bỏ đoạn mã đó ra khỏi tin nhắn hiển thị cho khách
            responseText = responseText.replace(leadString, "").trim();

          } catch (parseError) {
             console.error("❌ Lỗi đọc dữ liệu:", parseError, "Từ chuỗi:", jsonString);
          }
        }
      }
setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error: any) {
      console.error("CHI TIẾT LỖI TỪ GOOGLE GEMINI:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Xin lỗi, hệ thống AI đang nâng cấp. Vui lòng để lại số điện thoại qua form tư vấn nhé!' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Khung Chat */}
      {isOpen && (
        <div className="bg-[#1a1d23] border border-gray-800 shadow-2xl rounded-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="gold-bg text-black px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <span className="font-bold">PiduDigital AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f1115]/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#d4af37] text-black rounded-tr-none font-medium' 
                      : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                  }`}
                >
                  {/* Có thể dùng Markdown renderer ở đây nếu muốn in đậm/in nghiêng tốt hơn */}
                  <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div className="bg-gray-800 text-gray-200 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span className="text-sm italic">AI đang gõ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input nhập liệu */}
          <form onSubmit={handleSend} className="p-3 bg-[#1a1d23] border-t border-gray-800 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full gold-bg text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Nút bong bóng chat (Floating Button) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full gold-bg text-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform animate-bounce hover:animate-none"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}