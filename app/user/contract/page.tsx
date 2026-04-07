"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/timber/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, MoreHorizontal, FileEdit, Send, Trash2, Calendar, MapPin, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocationData } from "@/lib/timber-data";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Contract {
  id: string;
  date: string;
  type: string;
  volume: string;
  location: string;
  status: "Draft" | "Diajukan" | "Aktif" | "Selesai" | "Ditolak";
}

const initialContracts: Contract[] = [
  {
    id: "CTR-2403-089",
    date: "2024-03-22",
    type: "Finished Product",
    volume: "500 Pcs",
    location: "Wilayah Jawa Tengah - PIK Cepu",
    status: "Diajukan",
  },
  {
    id: "CTR-2401-012",
    date: "2024-01-15",
    type: "Raw Sawn Timber (RST)",
    volume: "1000 M³",
    location: "Wilayah Jawa Timur - PIK Saradan",
    status: "Aktif",
  },
  {
    id: "CTR-2311-045",
    date: "2023-11-02",
    type: "Pesanan Custom",
    volume: "200 Item(s)",
    location: "Wilayah Jawa Timur - PPL",
    status: "Selesai",
  },
  {
    id: "CTR-2404-002",
    date: "2024-04-01",
    type: "Raw Sawn Timber (RST)",
    volume: "50 M³",
    location: "Wilayah Jawa Tengah - PIK Randublatung",
    status: "Ditolak",
  }
];

export default function UserContractList() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [location, setLocation] = useState<LocationData>({ wilayah: "GM Wilayah", manager: null, unit: null });
  
  // State for Dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"approve" | "delete">("approve");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Edit Form State
  const [editVolume, setEditVolume] = useState("");
  const [editLocation, setEditLocation] = useState("");

  useEffect(() => {
    try {
      const existingStr = localStorage.getItem("tokoperhutani_contracts");
      if (existingStr && existingStr !== "[]") {
        setContracts(JSON.parse(existingStr));
      } else {
        localStorage.setItem("tokoperhutani_contracts", JSON.stringify(initialContracts));
        setContracts(initialContracts);
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
      setContracts(initialContracts);
    }
    setIsLoaded(true);
  }, []);

  const getStatusBadge = () => {
    return "bg-gray-50 text-[#1B4332] border-gray-200";
  };

  const updateContracts = (newArr: Contract[]) => {
    setContracts(newArr);
    try {
      localStorage.setItem("tokoperhutani_contracts", JSON.stringify(newArr));
    } catch (e) {}
  };

  const handleAjukanClick = (contract: Contract) => {
    setSelectedContract(contract);
    setConfirmType("approve");
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteClick = (contract: Contract) => {
    setSelectedContract(contract);
    setConfirmType("delete");
    setIsConfirmDialogOpen(true);
  };

  const handleEditClick = (contract: Contract) => {
    setSelectedContract(contract);
    setEditVolume(contract.volume);
    setEditLocation(contract.location);
    setIsEditDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedContract) return;

    if (confirmType === "approve") {
      updateContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, status: "Diajukan" } : c));
      toast.success(`Kontrak ${selectedContract.id} berhasil diajukan.`);
    } else {
      updateContracts(contracts.filter(c => c.id !== selectedContract.id));
      toast.success(`Draft kontrak ${selectedContract.id} berhasil dihapus.`);
    }
    setIsConfirmDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!selectedContract) return;
    updateContracts(contracts.map(c => 
      c.id === selectedContract.id ? { ...c, volume: editVolume, location: editLocation } : c
    ));
    toast.success("Kontrak berhasil diperbarui.");
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header location={location} setLocation={setLocation} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1B4332] mb-1">Daftar Kontrak Saya</h1>
            <p className="text-sm text-muted-foreground">
              Kelola dan pantau status permohonan kontrak pengadaan kayu Anda di sini.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/contract/draft')}
            className="rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold h-[44px] px-6 shadow-sm transition-all"
          >
            Buat Kontrak Baru
          </Button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FDF5] border-b border-gray-100 text-[#1B4332]">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Kontrak</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Lokasi TPK</th>
                  <th className="px-6 py-4 font-semibold">Tipe & Volume</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!isLoaded ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground animate-pulse">
                      Memuat data...
                    </td>
                  </tr>
                ) : contracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Belum ada draft atau kontrak aktif.
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-semibold text-[#1B4332]">
                        <FileText className="w-4 h-4 text-[#40916C]/60" />
                        {contract.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {contract.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{contract.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1B4332]">{contract.type}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Package className="w-3 h-3" />
                          {contract.volume}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border", getStatusBadge())}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {contract.status === "Draft" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:bg-gray-100 hover:text-[#1B4332] active:bg-gray-200 transition-colors rounded-lg"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border-gray-100 p-2">
                            <DropdownMenuItem onClick={() => handleAjukanClick(contract)} className="cursor-pointer font-semibold text-[#1B4332] data-[highlighted]:bg-[#40916C]/10 data-[highlighted]:text-[#1B4332] rounded-lg py-2.5 transition-colors">
                              <Send className="w-4 h-4 mr-2" /> Ajukan Kontrak
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(contract)} className="cursor-pointer font-medium text-gray-700 data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 rounded-lg py-2.5 transition-colors">
                              <FileEdit className="w-4 h-4 mr-2" /> Edit Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(contract)} className="cursor-pointer font-medium text-red-600 data-[highlighted]:text-red-700 data-[highlighted]:bg-red-100 rounded-lg py-2.5 transition-colors">
                              <Trash2 className="w-4 h-4 mr-2" /> Hapus Draft
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold text-[#40916C] hover:text-[#2D6A4F] hover:bg-[#F8FDF5] rounded-lg">
                          Lihat Detail
                        </Button>
                      )}
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1B4332]">Edit Draft Kontrak</DialogTitle>
            <DialogDescription>
              Perbarui detail draft kontrak Anda sebelum diajukan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id" className="text-muted-foreground">ID Kontrak</Label>
              <Input id="id" value={selectedContract?.id || ""} disabled className="bg-gray-50 border-gray-100 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-muted-foreground">Lokasi TPK</Label>
              <Input 
                id="location" 
                value={editLocation} 
                onChange={(e) => setEditLocation(e.target.value)} 
                className="border-gray-100 rounded-xl focus-visible:ring-[#1B4332]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="volume" className="text-muted-foreground">Volume</Label>
              <Input 
                id="volume" 
                value={editVolume} 
                onChange={(e) => setEditVolume(e.target.value)} 
                className="border-gray-100 rounded-xl focus-visible:ring-[#1B4332]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-gray-200">Batal</Button>
            <Button onClick={handleUpdate} className="rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B4332]">
              {confirmType === "approve" ? "Ajukan Kontrak?" : "Hapus Draft?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmType === "approve" 
                ? "Apakah Anda yakin ingin mengajukan kontrak ini untuk ditinjau? Anda tidak dapat mengeditnya lagi setelah diajukan."
                : "Tindakan ini tidak dapat dibatalkan. Draft ini akan dihapus secara permanen dari sistem."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-gray-200">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={cn(
                "rounded-xl font-semibold",
                confirmType === "delete" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-[#1B4332] hover:bg-[#2D6A4F] text-white"
              )}
            >
              {confirmType === "approve" ? "Ajukan Sekarang" : "Hapus Draft"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
