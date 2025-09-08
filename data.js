// 模擬資料
const items = [
    {
        id: 1,
        name: '高麗菜',
        category: '葉菜類',
        unit: '包(約1KG/包)',
        auctionPrice: 35,
        purchasePrice: 38,
        todayShortage: 12,
        threeDayShortage: 30,
        todayDemand: 50,
        totalStock: 20,
        inStock: {
            amount: 10,
            details: [
                { batch: 'A', amount: 5, date: '2025-08-27' },
                { batch: 'B', amount: 5, date: '2025-08-28' }
            ]
        },
        inTransit: {
            amount: 8,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-30' },
                { supplier: 'B', amount: 3, date: '2025-08-31' }
            ]
        },
        mode: 'auction',
        auctionCode: 'PA12345',
        auctionAmount: 30,
        auctionLocation: 'today',
        purchaseAmount: 0,
        supplier: '攤商A',
        active: true,
        // 異動追蹤欄位
        hasUnsavedChanges: false,
        noteCategory: '',
        noteText: '',
        suggestedAmounts: {
            auctionAmount: 30,
            purchaseAmount: 0
        },
        directSuppliers: [
            {
                supplierName: '直供商A',
                priceUpdateTime: '2025-09-02 10:30',
                unit: '箱(10KG/箱)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 150,
                costWithSpoilage: 158
            },
            {
                supplierName: '直供商B', 
                priceUpdateTime: '2025-09-02 11:15',
                unit: '箱(10KG/箱)',
                spoilageRate: 3,
                purchaseAmount: 0,
                cost: 148,
                costWithSpoilage: 153
            }
        ]
    },
    {
        id: 2,
        name: '青江菜',
        category: '葉菜類',
        unit: '把(約300G/把)',
        auctionPrice: 15,
        purchasePrice: 18,
        todayShortage: 0,
        threeDayShortage: 10,
        todayDemand: 40,
        totalStock: 15,
        inStock: {
            amount: 7,
            details: [
                { batch: 'C', amount: 7, date: '2025-08-28' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'C', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'dual',
        auctionCode: 'PB67890',
        auctionAmount: 10,
        auctionLocation: 'today',
        purchaseAmount: 0,
        supplier: '攤商B',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商C',
                priceUpdateTime: '2025-09-02 09:45',
                unit: '把(約300G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 135,
                costWithSpoilage: 143
            },
            {
                supplierName: '直供商D',
                priceUpdateTime: '2025-09-02 10:20',
                unit: '把(約300G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 142,
                costWithSpoilage: 148
            }
        ]
    },
    {
        id: 3,
        name: '大白菜',
        category: '葉菜類',
        unit: '顆(約1.5KG/顆)',
        auctionPrice: 42,
        purchasePrice: 45,
        todayShortage: 25,
        threeDayShortage: 45,
        todayDemand: 60,
        totalStock: 35,
        inStock: {
            amount: 20,
            details: [
                { batch: 'D', amount: 12, date: '2025-08-28' },
                { batch: 'E', amount: 8, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 15,
            details: [
                { supplier: 'A', amount: 8, date: '2025-08-30' },
                { supplier: 'B', amount: 7, date: '2025-08-31' }
            ]
        },
        mode: 'auction',
        auctionCode: 'PA23456',
        auctionAmount: 45,
        auctionLocation: 'today',
        purchaseAmount: 0,
        supplier: '攤商A',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商B',
                priceUpdateTime: '2025-09-02 11:10',
                unit: '顆(約1.5KG/顆)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 168,
                costWithSpoilage: 180
            },
            {
                supplierName: '直供商C',
                priceUpdateTime: '2025-09-02 09:30',
                unit: '顆(約1.5KG/顆)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 175,
                costWithSpoilage: 184
            },
            {
                supplierName: '直供商E',
                priceUpdateTime: '2025-09-02 12:15',
                unit: '顆(約1.5KG/顆)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 162,
                costWithSpoilage: 175
            }
        ]
    },
    {
        id: 4,
        name: '小白菜',
        category: '葉菜類',
        unit: '把(約400G/把)',
        auctionPrice: 20,
        purchasePrice: 22,
        todayShortage: 0,
        threeDayShortage: 5,
        todayDemand: 30,
        totalStock: 45,
        inStock: {
            amount: 35,
            details: [
                { batch: 'F', amount: 35, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 10,
            details: [
                { supplier: 'C', amount: 10, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商C',
        purchaseAmount: 5,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商A',
                priceUpdateTime: '2025-09-02 08:45',
                unit: '把(約400G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 128,
                costWithSpoilage: 134
            },
            {
                supplierName: '直供商F',
                priceUpdateTime: '2025-09-02 13:20',
                unit: '把(約400G/把)',
                spoilageRate: 3,
                purchaseAmount: 0,
                cost: 132,
                costWithSpoilage: 136
            }
        ]
    },
    {
        id: 5,
        name: '油菜',
        category: '葉菜類',
        unit: '把(約250G/把)',
        auctionPrice: 12,
        purchasePrice: 15,
        todayShortage: 8,
        threeDayShortage: 20,
        todayDemand: 25,
        totalStock: 17,
        inStock: {
            amount: 12,
            details: [
                { batch: 'G', amount: 12, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'B', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商B',
        purchaseAmount: 8,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商D',
                priceUpdateTime: '2025-09-02 07:30',
                unit: '把(約250G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 118,
                costWithSpoilage: 125
            },
            {
                supplierName: '直供商G',
                priceUpdateTime: '2025-09-02 14:10',
                unit: '把(約250G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 125,
                costWithSpoilage: 130
            },
            {
                supplierName: '直供商H',
                priceUpdateTime: '2025-09-02 11:45',
                unit: '把(約250G/把)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 115,
                costWithSpoilage: 123
            }
        ]
    },
    {
        id: 6,
        name: '菠菜',
        category: '葉菜類',
        unit: '把(約200G/把)',
        auctionPrice: 18,
        purchasePrice: 20,
        todayShortage: 15,
        threeDayShortage: 35,
        todayDemand: 45,
        totalStock: 30,
        inStock: {
            amount: 25,
            details: [
                { batch: 'H', amount: 15, date: '2025-08-28' },
                { batch: 'I', amount: 10, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-31' }
            ]
        },
        mode: 'dual',
        auctionCode: 'PC34567',
        auctionAmount: 20,
        auctionLocation: 'today',
        purchaseAmount: 15,
        supplier: '攤商A',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商B',
                priceUpdateTime: '2025-09-02 09:15',
                unit: '把(約200G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 112,
                costWithSpoilage: 118
            },
            {
                supplierName: '直供商I',
                priceUpdateTime: '2025-09-02 12:30',
                unit: '把(約200G/把)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 108,
                costWithSpoilage: 117
            }
        ]
    },
    {
        id: 7,
        name: '空心菜',
        category: '葉菜類',
        unit: '把(約300G/把)',
        auctionPrice: 16,
        purchasePrice: 18,
        todayShortage: 0,
        threeDayShortage: 0,
        todayDemand: 20,
        totalStock: 30,
        inStock: {
            amount: 20,
            details: [
                { batch: 'J', amount: 20, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 10,
            details: [
                { supplier: 'C', amount: 10, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商C',
        purchaseAmount: 0,
        active: false,
        directSuppliers: [
            {
                supplierName: '直供商E',
                priceUpdateTime: '2025-09-02 10:45',
                unit: '把(約300G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 122,
                costWithSpoilage: 127
            },
            {
                supplierName: '直供商J',
                priceUpdateTime: '2025-09-02 08:20',
                unit: '把(約300G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 118,
                costWithSpoilage: 125
            }
        ]
    },
    {
        id: 8,
        name: '地瓜葉',
        category: '葉菜類',
        unit: '把(約200G/把)',
        auctionPrice: 14,
        purchasePrice: 16,
        todayShortage: 18,
        threeDayShortage: 40,
        todayDemand: 55,
        totalStock: 37,
        inStock: {
            amount: 27,
            details: [
                { batch: 'K', amount: 15, date: '2025-08-28' },
                { batch: 'L', amount: 12, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 10,
            details: [
                { supplier: 'B', amount: 10, date: '2025-08-30' }
            ]
        },
        mode: 'auction',
        auctionCode: 'PD45678',
        auctionAmount: 40,
        auctionLocation: 'today',
        purchaseAmount: 0,
        supplier: '攤商C',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商F',
                priceUpdateTime: '2025-09-02 13:45',
                unit: '把(約200G/把)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 105,
                costWithSpoilage: 112
            },
            {
                supplierName: '直供商K',
                priceUpdateTime: '2025-09-02 07:15',
                unit: '把(約200G/把)',
                spoilageRate: 3,
                purchaseAmount: 0,
                cost: 113,
                costWithSpoilage: 116
            },
            {
                supplierName: '直供商L',
                priceUpdateTime: '2025-09-02 15:00',
                unit: '把(約200G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 110,
                costWithSpoilage: 116
            }
        ]
    },
    {
        id: 9,
        name: '韭菜',
        category: '特殊菜類',
        unit: '把(約300G/把)',
        auctionPrice: 25,
        purchasePrice: 28,
        todayShortage: 5,
        threeDayShortage: 15,
        todayDemand: 35,
        totalStock: 30,
        inStock: {
            amount: 25,
            details: [
                { batch: 'M', amount: 25, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商A',
        purchaseAmount: 5,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商G',
                priceUpdateTime: '2025-09-02 08:00',
                unit: '把(約300G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 165,
                costWithSpoilage: 175
            },
            {
                supplierName: '直供商M',
                priceUpdateTime: '2025-09-02 14:30',
                unit: '把(約300G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 172,
                costWithSpoilage: 179
            }
        ]
    },
    {
        id: 10,
        name: '茼蒿',
        category: '葉菜類',
        unit: '把(約250G/把)',
        auctionPrice: 22,
        purchasePrice: 25,
        todayShortage: 0,
        threeDayShortage: 8,
        todayDemand: 28,
        totalStock: 35,
        inStock: {
            amount: 28,
            details: [
                { batch: 'N', amount: 28, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 7,
            details: [
                { supplier: 'C', amount: 7, date: '2025-08-31' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商C',
        purchaseAmount: 8,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商H',
                priceUpdateTime: '2025-09-02 09:00',
                unit: '把(約250G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 155,
                costWithSpoilage: 163
            },
            {
                supplierName: '直供商N',
                priceUpdateTime: '2025-09-02 11:20',
                unit: '把(約250G/把)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 148,
                costWithSpoilage: 160
            },
            {
                supplierName: '直供商O',
                priceUpdateTime: '2025-09-02 16:15',
                unit: '把(約250G/把)',
                spoilageRate: 3,
                purchaseAmount: 0,
                cost: 159,
                costWithSpoilage: 164
            }
        ]
    },
    {
        id: 11,
        name: '芹菜',
        category: '根莖類',
        unit: '把(約400G/把)',
        auctionPrice: 35,
        purchasePrice: 38,
        todayShortage: 22,
        threeDayShortage: 50,
        todayDemand: 65,
        totalStock: 43,
        inStock: {
            amount: 33,
            details: [
                { batch: 'O', amount: 20, date: '2025-08-28' },
                { batch: 'P', amount: 13, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 10,
            details: [
                { supplier: 'B', amount: 10, date: '2025-08-30' }
            ]
        },
        mode: 'dual',
        auctionCode: 'PE56789',
        auctionAmount: 35,
        auctionLocation: 'today',
        purchaseAmount: 15,
        supplier: '攤商B',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商I',
                priceUpdateTime: '2025-09-02 10:10',
                unit: '把(約400G/把)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 185,
                costWithSpoilage: 198
            },
            {
                supplierName: '直供商P',
                priceUpdateTime: '2025-09-02 13:00',
                unit: '把(約400G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 192,
                costWithSpoilage: 200
            }
        ]
    },
    {
        id: 12,
        name: '菜心',
        category: '葉菜類',
        unit: '把(約200G/把)',
        auctionPrice: 28,
        purchasePrice: 30,
        todayShortage: 0,
        threeDayShortage: 0,
        todayDemand: 15,
        totalStock: 25,
        inStock: {
            amount: 20,
            details: [
                { batch: 'Q', amount: 20, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商A',
        purchaseAmount: 0,
        active: false,
        directSuppliers: [
            {
                supplierName: '直供商J',
                priceUpdateTime: '2025-09-02 07:45',
                unit: '把(約200G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 138,
                costWithSpoilage: 145
            },
            {
                supplierName: '直供商Q',
                priceUpdateTime: '2025-09-02 15:30',
                unit: '把(約200G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 133,
                costWithSpoilage: 141
            }
        ]
    },
    {
        id: 13,
        name: '大芥菜',
        category: '葉菜類',
        unit: '把(約500G/把)',
        auctionPrice: 32,
        purchasePrice: 35,
        todayShortage: 10,
        threeDayShortage: 25,
        todayDemand: 40,
        totalStock: 30,
        inStock: {
            amount: 25,
            details: [
                { batch: 'R', amount: 25, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'C', amount: 5, date: '2025-08-31' }
            ]
        },
        mode: 'auction',
        auctionCode: 'PF67890',
        auctionAmount: 25,
        auctionLocation: 'today',
        purchaseAmount: 0,
        supplier: '攤商B',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商K',
                priceUpdateTime: '2025-09-02 08:30',
                unit: '把(約500G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 178,
                costWithSpoilage: 189
            },
            {
                supplierName: '直供商R',
                priceUpdateTime: '2025-09-02 12:00',
                unit: '把(約500G/把)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 165,
                costWithSpoilage: 178
            },
            {
                supplierName: '直供商S',
                priceUpdateTime: '2025-09-02 14:45',
                unit: '把(約500G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 182,
                costWithSpoilage: 189
            }
        ]
    },
    {
        id: 14,
        name: '小芥菜',
        category: '葉菜類',
        unit: '把(約350G/把)',
        auctionPrice: 18,
        purchasePrice: 20,
        todayShortage: 0,
        threeDayShortage: 12,
        todayDemand: 30,
        totalStock: 38,
        inStock: {
            amount: 30,
            details: [
                { batch: 'S', amount: 30, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 8,
            details: [
                { supplier: 'B', amount: 8, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商B',
        purchaseAmount: 12,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商L',
                priceUpdateTime: '2025-09-02 09:20',
                unit: '把(約350G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 142,
                costWithSpoilage: 149
            },
            {
                supplierName: '直供商T',
                priceUpdateTime: '2025-09-02 16:00',
                unit: '把(約350G/把)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 138,
                costWithSpoilage: 148
            }
        ]
    },
    {
        id: 15,
        name: '莧菜',
        category: '葉菜類',
        unit: '把(約300G/把)',
        auctionPrice: 24,
        purchasePrice: 27,
        todayShortage: 15,
        threeDayShortage: 35,
        todayDemand: 50,
        totalStock: 35,
        inStock: {
            amount: 30,
            details: [
                { batch: 'T', amount: 18, date: '2025-08-28' },
                { batch: 'U', amount: 12, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'dual',
        auctionCode: 'PG78901',
        auctionAmount: 25,
        auctionLocation: 'today',
        purchaseAmount: 10,
        supplier: '攤商A',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商M',
                priceUpdateTime: '2025-09-02 10:50',
                unit: '把(約300G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 158,
                costWithSpoilage: 167
            },
            {
                supplierName: '直供商U',
                priceUpdateTime: '2025-09-02 13:15',
                unit: '把(約300G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 165,
                costWithSpoilage: 172
            },
            {
                supplierName: '直供商V',
                priceUpdateTime: '2025-09-02 07:00',
                unit: '把(約300G/把)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 152,
                costWithSpoilage: 164
            }
        ]
    },
    {
        id: 16,
        name: '皇宮菜',
        category: '特殊菜類',
        unit: '把(約250G/把)',
        auctionPrice: 28,
        purchasePrice: 32,
        todayShortage: 8,
        threeDayShortage: 20,
        todayDemand: 35,
        totalStock: 27,
        inStock: {
            amount: 22,
            details: [
                { batch: 'V', amount: 22, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'C', amount: 5, date: '2025-08-31' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商C',
        purchaseAmount: 8,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商N',
                priceUpdateTime: '2025-09-02 08:15',
                unit: '把(約250G/把)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 172,
                costWithSpoilage: 184
            },
            {
                supplierName: '直供商W',
                priceUpdateTime: '2025-09-02 11:40',
                unit: '把(約250G/把)',
                spoilageRate: 3,
                purchaseAmount: 0,
                cost: 178,
                costWithSpoilage: 183
            }
        ]
    },
    {
        id: 17,
        name: '甜羅美',
        category: '葉菜類',
        unit: '把(約400G/把)',
        auctionPrice: 20,
        purchasePrice: 22,
        todayShortage: 0,
        threeDayShortage: 0,
        todayDemand: 25,
        totalStock: 35,
        inStock: {
            amount: 30,
            details: [
                { batch: 'W', amount: 30, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'B', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商B',
        purchaseAmount: 0,
        active: false,
        directSuppliers: [
            {
                supplierName: '直供商O',
                priceUpdateTime: '2025-09-02 09:35',
                unit: '把(約400G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 125,
                costWithSpoilage: 131
            },
            {
                supplierName: '直供商X',
                priceUpdateTime: '2025-09-02 14:20',
                unit: '把(約400G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 128,
                costWithSpoilage: 136
            }
        ]
    },
    {
        id: 18,
        name: '龍鬚菜',
        category: '特殊菜類',
        unit: '把(約300G/把)',
        auctionPrice: 26,
        purchasePrice: 28,
        todayShortage: 20,
        threeDayShortage: 45,
        todayDemand: 60,
        totalStock: 40,
        inStock: {
            amount: 35,
            details: [
                { batch: 'X', amount: 20, date: '2025-08-28' },
                { batch: 'Y', amount: 15, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-31' }
            ]
        },
        mode: 'auction',
        auctionCode: 'PH89012',
        auctionAmount: 45,
        auctionLocation: 'today',
        purchaseAmount: 0,
        supplier: '攤商A',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商P',
                priceUpdateTime: '2025-09-02 10:25',
                unit: '把(約300G/把)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 145,
                costWithSpoilage: 157
            },
            {
                supplierName: '直供商Y',
                priceUpdateTime: '2025-09-02 12:45',
                unit: '把(約300G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 152,
                costWithSpoilage: 158
            },
            {
                supplierName: '直供商Z',
                priceUpdateTime: '2025-09-02 15:10',
                unit: '把(約300G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 148,
                costWithSpoilage: 157
            }
        ]
    },
    {
        id: 19,
        name: '大陸妹',
        category: '葉菜類',
        unit: '顆(約800G/顆)',
        auctionPrice: 30,
        purchasePrice: 32,
        todayShortage: 12,
        threeDayShortage: 30,
        todayDemand: 45,
        totalStock: 33,
        inStock: {
            amount: 28,
            details: [
                { batch: 'Z', amount: 28, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'C', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'dual',
        auctionCode: 'PI90123',
        auctionAmount: 20,
        auctionLocation: 'today',
        purchaseAmount: 10,
        supplier: '攤商C',
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商Q',
                priceUpdateTime: '2025-09-02 07:20',
                unit: '顆(約800G/顆)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 188,
                costWithSpoilage: 197
            },
            {
                supplierName: '直供商AA',
                priceUpdateTime: '2025-09-02 13:50',
                unit: '顆(約800G/顆)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 175,
                costWithSpoilage: 187
            }
        ]
    },
    {
        id: 20,
        name: '白菜苗',
        category: '葉菜類',
        unit: '把(約200G/把)',
        auctionPrice: 16,
        purchasePrice: 18,
        todayShortage: 0,
        threeDayShortage: 15,
        todayDemand: 35,
        totalStock: 42,
        inStock: {
            amount: 35,
            details: [
                { batch: 'AA', amount: 35, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 7,
            details: [
                { supplier: 'B', amount: 7, date: '2025-08-31' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商B',
        purchaseAmount: 15,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商R',
                priceUpdateTime: '2025-09-02 08:50',
                unit: '把(約200G/把)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 162,
                costWithSpoilage: 168
            },
            {
                supplierName: '直供商BB',
                priceUpdateTime: '2025-09-02 11:30',
                unit: '把(約200G/把)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 158,
                costWithSpoilage: 167
            },
            {
                supplierName: '直供商CC',
                priceUpdateTime: '2025-09-02 16:40',
                unit: '把(約200G/把)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 155,
                costWithSpoilage: 167
            }
        ]
    },
    {
        id: 21,
        name: '芥蘭菜',
        category: '根莖類',
        unit: '把(約350G/把)',
        auctionPrice: 24,
        purchasePrice: 26,
        todayShortage: 5,
        threeDayShortage: 18,
        todayDemand: 30,
        totalStock: 25,
        inStock: {
            amount: 20,
            details: [
                { batch: 'AB', amount: 20, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 5,
            details: [
                { supplier: 'A', amount: 5, date: '2025-08-30' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商A',
        purchaseAmount: 5,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商S',
                priceUpdateTime: '2025-09-02 09:10',
                unit: '把(約350G/把)',
                spoilageRate: 5,
                purchaseAmount: 0,
                cost: 145,
                costWithSpoilage: 152
            },
            {
                supplierName: '直供商DD',
                priceUpdateTime: '2025-09-02 12:20',
                unit: '把(約350G/把)',
                spoilageRate: 7,
                purchaseAmount: 0,
                cost: 138,
                costWithSpoilage: 148
            }
        ]
    },
    {
        id: 22,
        name: '娃娃菜',
        category: '葉菜類',
        unit: '顆(約200G/顆)',
        auctionPrice: 15,
        purchasePrice: 18,
        todayShortage: 0,
        threeDayShortage: 10,
        todayDemand: 25,
        totalStock: 32,
        inStock: {
            amount: 25,
            details: [
                { batch: 'AC', amount: 25, date: '2025-08-29' }
            ]
        },
        inTransit: {
            amount: 7,
            details: [
                { supplier: 'C', amount: 7, date: '2025-08-31' }
            ]
        },
        mode: 'purchase',
        supplier: '攤商C',
        purchaseAmount: 10,
        active: true,
        directSuppliers: [
            {
                supplierName: '直供商T',
                priceUpdateTime: '2025-09-02 10:05',
                unit: '顆(約200G/顆)',
                spoilageRate: 6,
                purchaseAmount: 0,
                cost: 118,
                costWithSpoilage: 125
            },
            {
                supplierName: '直供商EE',
                priceUpdateTime: '2025-09-02 14:55',
                unit: '顆(約200G/顆)',
                spoilageRate: 4,
                purchaseAmount: 0,
                cost: 125,
                costWithSpoilage: 130
            },
            {
                supplierName: '直供商FF',
                priceUpdateTime: '2025-09-02 08:40',
                unit: '顆(約200G/顆)',
                spoilageRate: 8,
                purchaseAmount: 0,
                cost: 115,
                costWithSpoilage: 124
            }
        ]
    }
];

const suppliers = ['攤商A', '攤商B', '攤商C'];

const categories = ['葉菜類', '根莖類', '特殊菜類'];

// 預設備註類別
const noteCategories = [
    '市場價格變動',
    '供應商異動',
    '庫存調整',
    '需求預測修正',
    '其他原因'
];

// 初始化異動追蹤欄位
function initializeItemTracking() {
    items.forEach(item => {
        if (item.hasUnsavedChanges === undefined) {
            item.hasUnsavedChanges = false;
        }
        if (item.noteCategory === undefined) {
            item.noteCategory = '';
        }
        if (item.noteText === undefined) {
            item.noteText = '';
        }
        if (!item.suggestedAmounts) {
            item.suggestedAmounts = {
                auctionAmount: item.auctionAmount || 0,
                purchaseAmount: item.purchaseAmount || 0
            };
        }
    });
}
