export interface LocationData {
    wilayah: string | null
    manager: string | null
    unit: string | null
}

export type WoodType = 'Jati' | 'Rimba'

export type RSTProductType =
    | 'BBI Venir Stock / Blockware'
    | 'BBI Lamela (Lamstock)'
    | 'RST Garden Furniture'
    | 'RST Housing Componen'
    | 'RST Flooring'
    | 'RST Decking'
    | 'RST Lamparquet'
    | 'RST Listoni'
    | 'RST Skirting'
    | 'RST Parket Block'
    | 'RST Parket Stock'
    | 'RST Reng'
    | 'RST List'
    | 'BBI CLT'
    | 'Jeblosan'
    | 'BBI Componen'
    | 'BBI Flooring'
    | 'BBI Finger Joint Laminating'
    | 'RST Longstrip'
    | 'RST Kayu KAM'
    | 'Afval kayu'

export interface RSTProduct {
    id: number
    ketersediaan: 'Tersedia' | 'Dipesan' | 'Berkomitmen' | 'Ditahan'
    tpk: string
    jenisKayu: WoodType
    productType: RSTProductType
    noKapling: string
    sertifikasi: string
    hargaAwal: number
    difPersen: number
    totalDif: number
    hargaAkhir: number
    noBlok: string
    sortimen: string
    panjang: number
    lebar: number | null
    tebalDiameter: string
    mutu: 'U' | 'P' | 'D' | 'T'
    jumlah: number
    volume: number
    jenisTebangan: string
    usiaTayangKapling: string
    tahunKapling: number
    tahunProduksi: number
    unit: string
}

export type FinishedCategory = 'Home Decore' | 'Home Construction'

export interface FinishedProduct {
    id: number
    name: string
    category: FinishedCategory
    subCategory: string
    woodType: WoodType
    dimensions: string
    price: number
    stock: number
    grade: 'A' | 'B' | 'C'
    image: string
    unit: string
}

export const rstData: RSTProduct[] = [
    {
        id: 1,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Jati',
        productType: 'RST Flooring',
        noKapling: 'KPL-001',
        sertifikasi: 'FSC-PURE',
        hargaAwal: 15000000,
        difPersen: 5,
        totalDif: 750000,
        hargaAkhir: 15750000,
        noBlok: 'B-12',
        sortimen: 'AIII',
        panjang: 200,
        lebar: null,
        tebalDiameter: '24-30"',
        mutu: 'U',
        jumlah: 10,
        volume: 2.48,
        jenisTebangan: 'Tebas Habis',
        usiaTayangKapling: '15 Hari',
        tahunKapling: 2023,
        tahunProduksi: 2023,
        unit: 'PIK Gresik',
    },
    {
        id: 2,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Rimba',
        productType: 'BBI Lamela (Lamstock)',
        noKapling: 'KPL-002',
        sertifikasi: 'SVLK',
        hargaAwal: 8000000,
        difPersen: 0,
        totalDif: 0,
        hargaAkhir: 8000000,
        noBlok: 'B-05',
        sortimen: 'AII',
        panjang: 300,
        lebar: null,
        tebalDiameter: '18-24"',
        mutu: 'P',
        jumlah: 25,
        volume: 1.24,
        jenisTebangan: 'Selektif',
        usiaTayangKapling: '30 Hari',
        tahunKapling: 2023,
        tahunProduksi: 2022,
        unit: 'PIK Gresik',
    },
    {
        id: 5,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Jati',
        productType: 'RST Decking',
        noKapling: 'KPL-003',
        sertifikasi: 'FSC-MIX',
        hargaAwal: 18000000,
        difPersen: 3,
        totalDif: 540000,
        hargaAkhir: 18540000,
        noBlok: 'B-15',
        sortimen: 'AIV',
        panjang: 250,
        lebar: 15,
        tebalDiameter: '30-40"',
        mutu: 'U',
        jumlah: 15,
        volume: 3.52,
        jenisTebangan: 'Tebas Habis',
        usiaTayangKapling: '20 Hari',
        tahunKapling: 2024,
        tahunProduksi: 2024,
        unit: 'PIK Gresik',
    },
    {
        id: 6,
        ketersediaan: 'Berkomitmen',
        tpk: 'TPK Gresik',
        jenisKayu: 'Jati',
        productType: 'RST Housing Componen',
        noKapling: 'KPL-004',
        sertifikasi: 'FSC-PURE',
        hargaAwal: 14000000,
        difPersen: 0,
        totalDif: 0,
        hargaAkhir: 14000000,
        noBlok: 'A-02',
        sortimen: 'AIII',
        panjang: 220,
        lebar: null,
        tebalDiameter: '20-25"',
        mutu: 'P',
        jumlah: 8,
        volume: 1.85,
        jenisTebangan: 'Selektif',
        usiaTayangKapling: '45 Hari',
        tahunKapling: 2023,
        tahunProduksi: 2023,
        unit: 'PIK Gresik',
    },
    {
        id: 7,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Rimba',
        productType: 'RST Reng',
        noKapling: 'KPL-005',
        sertifikasi: 'SVLK',
        hargaAwal: 6500000,
        difPersen: 2,
        totalDif: 130000,
        hargaAkhir: 6630000,
        noBlok: 'B-09',
        sortimen: 'AI',
        panjang: 400,
        lebar: 3,
        tebalDiameter: '10-15"',
        mutu: 'D',
        jumlah: 100,
        volume: 1.20,
        jenisTebangan: 'Tebas Habis',
        usiaTayangKapling: '10 Hari',
        tahunKapling: 2024,
        tahunProduksi: 2024,
        unit: 'PIK Gresik',
    },
    {
        id: 8,
        ketersediaan: 'Ditahan',
        tpk: 'TPK Gresik',
        jenisKayu: 'Jati',
        productType: 'RST Parket Stock',
        noKapling: 'KPL-006',
        sertifikasi: 'FSC-PURE',
        hargaAwal: 22000000,
        difPersen: 0,
        totalDif: 0,
        hargaAkhir: 22000000,
        noBlok: 'C-10',
        sortimen: 'AV',
        panjang: 180,
        lebar: null,
        tebalDiameter: '40-50"',
        mutu: 'U',
        jumlah: 5,
        volume: 4.12,
        jenisTebangan: 'Selektif',
        usiaTayangKapling: '60 Hari',
        tahunKapling: 2022,
        tahunProduksi: 2022,
        unit: 'PIK Gresik',
    },
    {
        id: 9,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Rimba',
        productType: 'BBI Componen',
        noKapling: 'KPL-007',
        sertifikasi: 'SVLK',
        hargaAwal: 9500000,
        difPersen: 1,
        totalDif: 95000,
        hargaAkhir: 9595000,
        noBlok: 'B-21',
        sortimen: 'AII',
        panjang: 350,
        lebar: 20,
        tebalDiameter: '15-20"',
        mutu: 'T',
        jumlah: 40,
        volume: 2.15,
        jenisTebangan: 'Salvage',
        usiaTayangKapling: '5 Hari',
        tahunKapling: 2024,
        tahunProduksi: 2024,
        unit: 'PIK Gresik',
    },
    {
        id: 10,
        ketersediaan: 'Dipesan',
        tpk: 'TPK Gresik',
        jenisKayu: 'Jati',
        productType: 'RST Garden Furniture',
        noKapling: 'KPL-008',
        sertifikasi: 'FSC-MIX',
        hargaAwal: 17500000,
        difPersen: 4,
        totalDif: 700000,
        hargaAkhir: 18200000,
        noBlok: 'A-14',
        sortimen: 'AIII',
        panjang: 210,
        lebar: null,
        tebalDiameter: '25-30"',
        mutu: 'P',
        jumlah: 12,
        volume: 2.88,
        jenisTebangan: 'Tebas Habis',
        usiaTayangKapling: '12 Hari',
        tahunKapling: 2023,
        tahunProduksi: 2023,
        unit: 'PIK Gresik',
    },
    {
        id: 11,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Jati',
        productType: 'RST Listoni',
        noKapling: 'KPL-009',
        sertifikasi: 'FSC-PURE',
        hargaAwal: 13500000,
        difPersen: 0,
        totalDif: 0,
        hargaAkhir: 13500000,
        noBlok: 'B-01',
        sortimen: 'AII',
        panjang: 300,
        lebar: 10,
        tebalDiameter: '15-20"',
        mutu: 'D',
        jumlah: 60,
        volume: 1.45,
        jenisTebangan: 'Selektif',
        usiaTayangKapling: '25 Hari',
        tahunKapling: 2024,
        tahunProduksi: 2023,
        unit: 'PIK Gresik',
    },
    {
        id: 12,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Gresik',
        jenisKayu: 'Rimba',
        productType: 'RST Longstrip',
        noKapling: 'KPL-010',
        sertifikasi: 'SVLK',
        hargaAwal: 11000000,
        difPersen: 2,
        totalDif: 220000,
        hargaAkhir: 11220000,
        noBlok: 'D-05',
        sortimen: 'AIV',
        panjang: 500,
        lebar: null,
        tebalDiameter: '35-45"',
        mutu: 'U',
        jumlah: 4,
        volume: 5.60,
        jenisTebangan: 'Tebas Habis',
        usiaTayangKapling: '8 Hari',
        tahunKapling: 2024,
        tahunProduksi: 2024,
        unit: 'PIK Gresik',
    },
    {
        id: 3,
        ketersediaan: 'Dipesan',
        tpk: 'TPK Saradan',
        jenisKayu: 'Jati',
        productType: 'RST Garden Furniture',
        noKapling: 'KPL-045',
        sertifikasi: 'FSC-MIX',
        hargaAwal: 12000000,
        difPersen: 2,
        totalDif: 240000,
        hargaAkhir: 12240000,
        noBlok: 'C-01',
        sortimen: 'AIII',
        panjang: 250,
        lebar: null,
        tebalDiameter: '12-18"',
        mutu: 'D',
        jumlah: 5,
        volume: 0.89,
        jenisTebangan: 'Tebas Habis',
        usiaTayangKapling: '5 Hari',
        tahunKapling: 2024,
        tahunProduksi: 2024,
        unit: 'PIK Saradan',
    },
    {
        id: 4,
        ketersediaan: 'Tersedia',
        tpk: 'TPK Saradan',
        jenisKayu: 'Rimba',
        productType: 'RST Housing Componen',
        noKapling: 'KPL-046',
        sertifikasi: 'SVLK',
        hargaAwal: 5000000,
        difPersen: 0,
        totalDif: 0,
        hargaAkhir: 5000000,
        noBlok: 'C-02',
        sortimen: 'AII',
        panjang: 400,
        lebar: null,
        tebalDiameter: '20-26"',
        mutu: 'T',
        jumlah: 50,
        volume: 1.56,
        jenisTebangan: 'Selektif',
        usiaTayangKapling: '10 Hari',
        tahunKapling: 2023,
        tahunProduksi: 2023,
        unit: 'PIK Saradan',
    },
]

export const finishedProducts: FinishedProduct[] = [
    {
        id: 1,
        name: 'Meja Makan Jati Minimalis',
        category: 'Home Decore',
        subCategory: 'Meja',
        woodType: 'Jati',
        dimensions: '200x100x75cm',
        price: 3500000,
        stock: 20,
        grade: 'A',
        image: 'https://images.unsplash.com/photo-1577146333359-b9fdd213000c?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Gresik',
    },
    {
        id: 2,
        name: 'Pintu Utama Rimba Solid',
        category: 'Home Construction',
        subCategory: 'Pintu',
        woodType: 'Rimba',
        dimensions: '90x210x4cm',
        price: 1250000,
        stock: 45,
        grade: 'B',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Gresik',
    },
    {
        id: 3,
        name: 'Kursi Teras Jati Retro',
        category: 'Home Decore',
        subCategory: 'Kursi',
        woodType: 'Jati',
        dimensions: '55x60x85cm',
        price: 850000,
        stock: 120,
        grade: 'A',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Saradan',
    },
    {
        id: 4,
        name: 'Kusen Jendela Rimba',
        category: 'Home Construction',
        subCategory: 'Kusen',
        woodType: 'Rimba',
        dimensions: '60x120x12cm',
        price: 450000,
        stock: 80,
        grade: 'C',
        image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Saradan',
    },
    {
        id: 5,
        name: 'Almari Pakaian 3 Pintu',
        category: 'Home Decore',
        subCategory: 'Almari',
        woodType: 'Jati',
        dimensions: '150x60x200cm',
        price: 5200000,
        stock: 12,
        grade: 'A',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Ngawi',
    },
    {
        id: 6,
        name: 'Balok Rimba 6/12',
        category: 'Home Construction',
        subCategory: 'Balok',
        woodType: 'Rimba',
        dimensions: '6x12x400cm',
        price: 180000,
        stock: 200,
        grade: 'B',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Ngawi',
    },
    {
        id: 7,
        name: 'Tempat Tidur King Size',
        category: 'Home Decore',
        subCategory: 'Tempat Tidur',
        woodType: 'Jati',
        dimensions: '180x200cm',
        price: 4800000,
        stock: 10,
        grade: 'A',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Jatirogo',
    },
    {
        id: 8,
        name: 'Reng Rimba 2/3',
        category: 'Home Construction',
        subCategory: 'Reng',
        woodType: 'Rimba',
        dimensions: '2x3x300cm',
        price: 25000,
        stock: 1500,
        grade: 'C',
        image: 'https://images.unsplash.com/photo-1626808642875-0aa545452fe8?q=80&w=800&auto=format&fit=crop',
        unit: 'PIK Jatirogo',
    },
]
