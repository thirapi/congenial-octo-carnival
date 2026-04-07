import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationData, rstData } from "@/lib/timber-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

interface RSTTableProps {
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
  location: LocationData;
  filters: {
    woodType: string[];
    grade: string[];
  };
}

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

  const filteredData = useMemo(() => {
    if (!location.unit) return [];

    let data = rstData.filter((item) => item.unit === location.unit);

    if (filters.woodType.length > 0) {
      data = data.filter((item) => filters.woodType.includes(item.jenisKayu));
    }

    if (filters.grade.length > 0) {
      data = data.filter((item) => filters.grade.includes(item.mutu));
    }

    return data;
  }, [location.unit, filters]);

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
        <h3 className="text-xl font-bold text-foreground mb-2">
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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            {/* <input
              type="checkbox"
              disabled={filteredData.length === 0}
              checked={
                filteredData.length > 0 &&
                selectedItems.length === filteredData.length
              }
              onChange={toggleAll}
              className="h-4 w-4 rounded border-border"
            /> */}
            <span className="text-sm font-semibold text-foreground">
              {selectedItems.length} dipilih
            </span>
          </label>
          <span className="text-sm font-medium text-muted-foreground">
            Unit: <span className="text-primary">{location.unit}</span>
          </span>
        </div>

        {selectedItems.length > 0 && (
          <button
            onClick={handleAddSelectionToCart}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Tambahkan {selectedItems.length} ke Keranjang
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded border border-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 whitespace-nowrap">
              <th className="px-4 py-3 sticky left-0 bg-muted/50 z-10 w-10">
                {/* <input
                  type="checkbox"
                  disabled={filteredData.length === 0}
                  checked={
                    filteredData.length > 0 &&
                    selectedItems.length === filteredData.length
                  }
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-border"
                /> */}
              </th>
              {[
                "Ketersediaan",
                "TPK",
                "Jenis Kayu",
                "Jenis Produk",
                "No. Kapling",
                "Sertifikasi",
                "Harga Awal (Rp)",
                "Dif (%)",
                "Total Dif (Rp)",
                "Harga Akhir (Rp)",
                "No. Blok",
                "Sortimen",
                "Panjang",
                "Lebar",
                "Tebal/Diameter",
                "Mutu",
                "Jumlah",
                "Volume",
                "Jenis Tebangan",
                "Usia Tayang Kapling",
                "Tahun Kapling",
                "Tahun Produksi",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-r border-border/50 last:border-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors whitespace-nowrap group"
                >
                  <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-muted/30 z-10 border-r border-border">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(row.id)}
                      onChange={() => toggleItem(row.id)}
                      className="h-4 w-4 rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${getStatusColor(row.ketersediaan)}`}
                    >
                      {row.ketersediaan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.tpk}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">
                    {row.jenisKayu}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.productType}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-primary">
                    {row.noKapling}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.sertifikasi}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">
                    {row.hargaAwal.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-xs text-center">
                    {row.difPersen}%
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">
                    {row.totalDif.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-primary text-right">
                    {row.hargaAkhir.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.noBlok}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {row.sortimen}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {row.panjang}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {row.lebar || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {row.tebalDiameter}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block w-6 h-6 leading-6 rounded bg-primary/10 text-primary text-[10px] font-bold">
                      {row.mutu}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{row.jumlah}</td>
                  <td className="px-4 py-3 text-sm font-bold text-right">
                    {row.volume.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.jenisTebangan}
                  </td>
                  <td className="px-4 py-3 text-xs text-center">
                    {row.usiaTayangKapling}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-medium">
                    {row.tahunKapling}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {row.tahunProduksi}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={22} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-muted-foreground font-medium text-lg">
                      Tidak ada data inventaris yang cocok.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Silakan sesuaikan filter atau pilih unit lain.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan{" "}
          <span className="font-bold text-foreground">
            {filteredData.length}
          </span>{" "}
          catatan inventaris
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border rounded transition-colors bg-white">
            ← Sebelumnya
          </button>
          <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border rounded transition-colors bg-white">
            Berikutnya →
          </button>
        </div>
      </div>
    </div>
  );
}
