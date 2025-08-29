// 模擬資料
const items = [
    {
        id: 1,
        name: '高麗菜',
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
        purchaseAmount: 0,
        active: true
    },
    {
        id: 2,
        name: '青江菜',
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
        purchaseAmount: 0,
        active: true
    },
    {
        id: 3,
        name: '大白菜',
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
        purchaseAmount: 0,
        active: true
    },
    {
        id: 4,
        name: '小白菜',
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
        active: true
    },
    {
        id: 5,
        name: '油菜',
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
        active: true
    },
    {
        id: 6,
        name: '菠菜',
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
        purchaseAmount: 15,
        supplier: '攤商A',
        active: true
    },
    {
        id: 7,
        name: '空心菜',
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
        active: false
    },
    {
        id: 8,
        name: '地瓜葉',
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
        purchaseAmount: 0,
        active: true
    },
    {
        id: 9,
        name: '韭菜',
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
        active: true
    },
    {
        id: 10,
        name: '茼蒿',
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
        active: true
    },
    {
        id: 11,
        name: '芹菜',
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
        purchaseAmount: 15,
        supplier: '攤商B',
        active: true
    },
    {
        id: 12,
        name: '菜心',
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
        active: false
    },
    {
        id: 13,
        name: '大芥菜',
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
        purchaseAmount: 0,
        active: true
    },
    {
        id: 14,
        name: '小芥菜',
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
        active: true
    },
    {
        id: 15,
        name: '莧菜',
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
        purchaseAmount: 10,
        supplier: '攤商A',
        active: true
    },
    {
        id: 16,
        name: '皇宮菜',
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
        active: true
    },
    {
        id: 17,
        name: '甜羅美',
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
        active: false
    },
    {
        id: 18,
        name: '龍鬚菜',
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
        purchaseAmount: 0,
        active: true
    },
    {
        id: 19,
        name: '大陸妹',
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
        purchaseAmount: 10,
        supplier: '攤商C',
        active: true
    },
    {
        id: 20,
        name: '白菜苗',
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
        active: true
    },
    {
        id: 21,
        name: '芥蘭菜',
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
        active: true
    },
    {
        id: 22,
        name: '娃娃菜',
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
        active: true
    }
];

const suppliers = ['攤商A', '攤商B', '攤商C'];
