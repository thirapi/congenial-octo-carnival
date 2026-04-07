import { Instagram, Youtube, Facebook, Linkedin, Twitter, Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#FAFCFC] border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Top Logo and Address */}
        <div className="flex flex-col items-center mb-16 text-center max-w-2xl">
          <img
            src="/image.png"
            alt="Perhutani Logo"
            className="w-40 h-auto object-contain mb-4"
          />
          <p className="text-[#6A9983] text-[15px] font-medium leading-relaxed">
            <span className="text-[#1B4332] font-bold">Address:</span> Jl. TB Simatupang No.22, Jati Padang, Kec. Ps. Minggu, Kota Jakarta 
            <br className="hidden md:block" /> Selatan, DKI Jakarta 12540
          </p>
        </div>

        {/* 4 Columns Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1 */}
          <div className="flex flex-col">
            <h4 className="text-[#1B4332] font-bold text-lg mb-6">Produk / Layanan</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Produk Jadi</a></li>
              <li><a href="/rst" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Kayu Gergajian Mentah (RST)</a></li>
              <li><a href="/contract" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Pesanan Korporat</a></li>
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Unduh Katalog</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <h4 className="text-[#1B4332] font-bold text-lg mb-6">Informasi</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Berita</a></li>
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Keberlanjutan</a></li>
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Laporan</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <h4 className="text-[#1B4332] font-bold text-lg mb-6">Perusahaan</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Bantuan</a></li>
              <li><a href="#" className="text-[#6A9983] font-semibold text-[15px] hover:text-[#1B4332] transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col">
            <h4 className="text-[#1B4332] font-bold text-lg mb-6">Sosial Media</h4>
            
            <div className="flex items-center gap-3 mb-6">
              <a href="#" className="p-2 bg-transparent text-[#6A9983] hover:text-[#1B4332] transition-colors">
                <Instagram className="w-5 h-5 stroke-[2.5]" />
              </a>
              <a href="#" className="p-2 bg-transparent text-[#6A9983] hover:text-[#1B4332] transition-colors">
                <Music className="w-5 h-5 stroke-[2.5]" />
              </a>
              <a href="#" className="p-2 bg-transparent text-[#6A9983] hover:text-[#1B4332] transition-colors">
                <Youtube className="w-6 h-6 stroke-[2.5]" />
              </a>
              <a href="#" className="p-2 bg-transparent text-[#6A9983] hover:text-[#1B4332] transition-colors">
                <Facebook className="w-5 h-5 stroke-[2.5]" />
              </a>
              <a href="#" className="p-2 bg-transparent text-[#6A9983] hover:text-[#1B4332] transition-colors">
                <Linkedin className="w-5 h-5 stroke-[2.5]" />
              </a>
              <a href="#" className="p-2 bg-transparent text-[#6A9983] hover:text-[#1B4332] transition-colors">
                {/* SVG for X (Twitter) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
            </div>

            <div className="space-y-2">
              <p className="text-[#6A9983] text-[14px]">
                <span className="text-[#1B4332] font-bold">CP jawa timur : </span> humasjatim@perhutani.co.id
              </p>
              <p className="text-[#6A9983] text-[14px]">
                <span className="text-[#1B4332] font-bold">CP jawa tengah : </span> humasjateng@perhutani.co.id
              </p>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Footer Bottom Divider */}
      <div className="w-full border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-6 text-center">
          <p className="text-[#1B4332] font-semibold text-[14px]">
            © {new Date().getFullYear()} Perhutani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
