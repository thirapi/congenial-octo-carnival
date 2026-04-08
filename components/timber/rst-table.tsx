import { useMemo, useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { LocationData, rstData } from "@/lib/timber-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { Settings2, PackageSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RSTTableProps {
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
  location: LocationData;
  filters: {
    woodType: string[];
    grade: string[];
    sertifikat: string[];
  };
}

const ALL_COLUMNS = [
  { id: "ketersediaan", label: "Ketersediaan" },
  { id: "tpk", label: "TPK" },
  { id: "jenisKayu", label: "Jenis Kayu" },
  { id: "productType", label: "Jenis Produk" },
  { id: "noKapling", label: "No. Kapling" },
  { id: "sertifikasi", label: "Sertifikasi" },
  { id: "hargaAwal", label: "Harga Awal (Rp)" },
  { id: "difPersen", label: "Dif (%)" },
  { id: "totalDif", label: "Total Dif (Rp)" },
  { id: "hargaAkhir", label: "Harga Akhir (Rp)" },
  { id: "noBlok", label: "No. Blok" },
  { id: "sortimen", label: "Sortimen" },
  { id: "panjang", label: "Panjang" },
  { id: "lebar", label: "Lebar" },
  { id: "tebalDiameter", label: "Tebal/Diameter" },
  { id: "mutu", label: "Mutu" },
  { id: "jumlah", label: "Jumlah" },
  { id: "volume", label: "Volume" },
  { id: "jenisTebangan", label: "Jenis Tebangan" },
  { id: "usiaTayangKapling", label: "Usia Tayang Kapling" },
  { id: "tahunKapling", label: "Tahun Kapling" },
  { id: "tahunProduksi", label: "Tahun Produksi" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Tersedia":
    case "Available":
      return "bg-accent/10 text-accent";
    case "Dipesan":
    case "Reserved":
      return "bg-secondary/10 text-secondary";
    case "Berkomitmen":
    case "Committed":
      return "bg-primary/10 text-primary";
    case "Ditahan":
    case "On Hold":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function RSTTable({
  selectedItems,
  setSelectedItems,
  location,
  filters,
}: RSTTableProps) {
  const { addRSTItems } = useCart();
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((col) => col.id)
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const filteredData = useMemo(() => {
    if (!location.unit) return [];

    let data = rstData.filter((item) => item.unit === location.unit);

    if (filters.woodType.length > 0) {
      data = data.filter((item) => filters.woodType.includes(item.jenisKayu));
    }

    if (filters.grade.length > 0) {
      data = data.filter((item) => filters.grade.includes(item.mutu));
    }

    if (filters.sertifikat.length > 0) {
      data = data.filter((item) => filters.sertifikat.includes(item.sertifikasi));
    }

    return data;
  }, [location.unit, filters]);

  // Drag to scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isMouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const x = e.clientX - container.getBoundingClientRect().left;
      const walk = (x - startX) * 2; // Increased multiplier for faster scroll
      container.scrollLeft = scrollLeft - walk;
    };

    const mouseDownHandler = (e: MouseEvent) => {
      // Don't drag if clicking interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest("input") || 
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='menuitem']")
      ) return;

      isMouseDown = true;
      setIsDragging(true);
      
      // Prevent text selection and default drag behavior
      document.body.style.userSelect = "none";
      
      startX = e.clientX - container.getBoundingClientRect().left;
      scrollLeft = container.scrollLeft;
    };

    const mouseUpHandler = () => {
      isMouseDown = false;
      setIsDragging(false);
      document.body.style.userSelect = "";
    };

    container.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      container.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("mousemove", mouseMoveHandler);
      document.body.style.userSelect = "";
    };
  }, []);

  const handleAddSelectionToCart = () => {
    const selectedProducts = filteredData.filter((item) =>
      selectedItems.includes(item.id),
    );
    addRSTItems(selectedProducts);
    setSelectedItems([]);
    toast.success("RST ditambahkan ke keranjang", {
      description: `${selectedProducts.length} log kayu berhasil ditambahkan ke keranjang RST.`,
    });
  };

  const toggleAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((item) => item.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedItems(
      selectedItems.includes(id)
        ? selectedItems.filter((item) => item !== id)
        : [...selectedItems, id],
    );
  };

  const isColumnVisible = (id: string) => visibleColumns.includes(id);

  if (!location.unit) {
    return (
      <div className="relative flex flex-col items-center justify-center py-32 bg-muted/10 rounded-xl border-2 border-dashed border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url("/rst-background.jpeg")' }}
        />
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Lokasi Unit Belum Dipilih
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          Silakan pilih Unit / Lokasi terlebih dahulu untuk melihat daftar log
          kayu (RST) yang tersedia untuk didistribusikan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">
                {selectedItems.length} Dipilih
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-border" />
              {location.unit}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all border border-transparent hover:border-border">
                <Settings2 className="w-4 h-4" />
                Kolom Tampilan
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {ALL_COLUMNS.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={visibleColumns.includes(column.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setVisibleColumns([...visibleColumns, column.id]);
                      } else {
                        setVisibleColumns(
                          visibleColumns.filter((id) => id !== column.id)
                        );
                      }
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedItems.length > 0 && (
            <button
              onClick={handleAddSelectionToCart}
              className="px-4 py-2 bg-[#1B4332] text-white font-semibold text-sm rounded-lg hover:bg-[#2D6A4F] transition-all shadow-lg shadow-green-900/10 active:scale-95"
            >
              Tambah ke Keranjang
            </button>
          )}
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className={cn(
          "overflow-x-auto rounded-2xl border border-border bg-white shadow-sm custom-scrollbar",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 whitespace-nowrap">
              <th className="px-5 py-4 sticky left-0 bg-muted/30 z-20 w-12 border-r border-border/50">
                <input 
                  type="checkbox"
                  checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                  onChange={toggleAll}
                  className="translate-y-0.5 h-4 w-4 rounded border-border"
                />
              </th>
              {ALL_COLUMNS.filter(col => isColumnVisible(col.id)).map((column) => (
                <th
                  key={column.id}
                  className="px-5 py-4 text-xs font-semibold text-muted-foreground/60 border-r border-border/10 last:border-0"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.map((row: any) => (
              <tr
                key={row.id}
                className="hover:bg-muted/30 transition-colors whitespace-nowrap group"
              >
                <td className="px-5 py-4 sticky left-0 bg-white group-hover:bg-muted/30 z-10 border-r border-border">
                  <input 
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={() => toggleItem(row.id)}
                    className="h-4 w-4 rounded border-border"
                  />
                </td>
                {visibleColumns.includes("ketersediaan") && (
                  <td className="px-5 py-4">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[10px] font-semibold", getStatusColor(row.ketersediaan))}>
                      {row.ketersediaan}
                    </span>
                  </td>
                )}
                {visibleColumns.includes("tpk") && (
                  <td className="px-5 py-4 text-sm text-foreground/80">{row.tpk}</td>
                )}
                {visibleColumns.includes("jenisKayu") && (
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{row.jenisKayu}</td>
                )}
                {visibleColumns.includes("productType") && (
                  <td className="px-5 py-4 text-sm text-foreground/60">{row.productType}</td>
                )}
                {visibleColumns.includes("noKapling") && (
                  <td className="px-5 py-4 text-sm font-semibold text-primary">{row.noKapling}</td>
                )}
                {visibleColumns.includes("sertifikasi") && (
                  <td className="px-5 py-4 text-[11px] font-medium text-muted-foreground bg-muted/20">{row.sertifikasi}</td>
                )}
                {visibleColumns.includes("hargaAwal") && (
                  <td className="px-5 py-4 text-sm text-right font-medium">{row.hargaAwal.toLocaleString("id-ID")}</td>
                )}
                {visibleColumns.includes("difPersen") && (
                  <td className="px-5 py-4 text-xs text-center text-muted-foreground">{row.difPersen}%</td>
                )}
                {visibleColumns.includes("totalDif") && (
                  <td className="px-5 py-4 text-sm text-right text-muted-foreground">{row.totalDif.toLocaleString("id-ID")}</td>
                )}
                {visibleColumns.includes("hargaAkhir") && (
                  <td className="px-5 py-4 text-sm font-semibold text-primary text-right bg-primary/[0.02]">{row.hargaAkhir.toLocaleString("id-ID")}</td>
                )}
                {visibleColumns.includes("noBlok") && (
                  <td className="px-5 py-4 text-sm text-foreground/70">{row.noBlok}</td>
                )}
                {visibleColumns.includes("sortimen") && (
                  <td className="px-5 py-4 text-sm font-medium">{row.sortimen}</td>
                )}
                {visibleColumns.includes("panjang") && (
                  <td className="px-5 py-4 text-sm text-right">{row.panjang}</td>
                )}
                {visibleColumns.includes("lebar") && (
                  <td className="px-5 py-4 text-sm text-right">{row.lebar || "-"}</td>
                )}
                {visibleColumns.includes("tebalDiameter") && (
                  <td className="px-5 py-4 text-sm text-right">{row.tebalDiameter}</td>
                )}
                {visibleColumns.includes("mutu") && (
                  <td className="px-5 py-4 text-center">
                    <span className="inline-block w-6 h-6 leading-6 rounded bg-primary/10 text-primary text-[10px] font-semibold">
                      {row.mutu}
                    </span>
                  </td>
                )}
                {visibleColumns.includes("jumlah") && (
                  <td className="px-5 py-4 text-sm text-right">{row.jumlah}</td>
                )}
                {visibleColumns.includes("volume") && (
                  <td className="px-5 py-4 text-sm font-semibold text-right">{row.volume.toFixed(3)}</td>
                )}
                {visibleColumns.includes("jenisTebangan") && (
                  <td className="px-5 py-4 text-xs text-muted-foreground">{row.jenisTebangan}</td>
                )}
                {visibleColumns.includes("usiaTayangKapling") && (
                  <td className="px-5 py-4 text-xs text-center text-muted-foreground">{row.usiaTayangKapling}</td>
                )}
                {visibleColumns.includes("tahunKapling") && (
                  <td className="px-5 py-4 text-sm text-center font-medium">{row.tahunKapling}</td>
                )}
                {visibleColumns.includes("tahunProduksi") && (
                  <td className="px-5 py-4 text-sm text-center">{row.tahunProduksi}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="sticky left-0 w-full py-32 bg-white/50 backdrop-blur-sm border-t border-border/50">
            <div className="flex flex-col items-center justify-center max-w-md mx-auto px-6 text-center">
              <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-muted/5 transition-transform hover:scale-105">
                <PackageSearch className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <p className="text-foreground font-semibold text-xl mb-2">
                Data Inventaris Kosong
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maaf, saat ini tidak ada data inventaris yang tersedia di unit ini
                atau tidak ada data yang cocok dengan kriteria filter Anda.
                <br />Silakan periksa unit lain atau sesuaikan filter Anda.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-2">
        <p className="text-sm font-medium text-muted-foreground">
          Menampilkan <span className="text-foreground">{filteredData.length}</span> catatan
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:bg-muted/50 disabled:opacity-30">
            Sebelumnya
          </button>
          <button className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:bg-muted/50 disabled:opacity-30">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
