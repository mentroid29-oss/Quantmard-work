import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MarketplaceType } from '@/types';

export async function GET() {
  try {
    const orders = db.getOrders();
    const inventory = db.getInventory();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.internalStatus !== 'CANCELLED' ? o.totalAmount : 0), 0);
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const todayDateStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(o => o.orderDate.startsWith(todayDateStr));
    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter(o => o.internalStatus === 'PENDING' || o.internalStatus === 'CONFIRMED').length;
    const processingOrders = orders.filter(o => o.internalStatus === 'PROCESSING' || o.internalStatus === 'PACKED').length;
    const shippedOrders = orders.filter(o => o.internalStatus === 'SHIPPED' || o.internalStatus === 'OUT_FOR_DELIVERY').length;
    const deliveredOrders = orders.filter(o => o.internalStatus === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => o.internalStatus === 'CANCELLED').length;
    const returnedOrders = orders.filter(o => o.internalStatus === 'RETURNED' || o.internalStatus === 'REFUNDED').length;

    // Marketplace breakdown
    const marketplaceCounts: Record<MarketplaceType, { count: number; revenue: number; name: string }> = {
      AMAZON: { count: 0, revenue: 0, name: 'Amazon' },
      FLIPKART: { count: 0, revenue: 0, name: 'Flipkart' },
      MEESHO: { count: 0, revenue: 0, name: 'Meesho' },
      SHOPIFY: { count: 0, revenue: 0, name: 'Shopify' },
      WOOCOMMERCE: { count: 0, revenue: 0, name: 'WooCommerce' },
      MYNTRA: { count: 0, revenue: 0, name: 'Myntra' },
      AJIO: { count: 0, revenue: 0, name: 'Ajio' },
      CUSTOM: { count: 0, revenue: 0, name: 'Other' },
    };

    orders.forEach(o => {
      if (marketplaceCounts[o.marketplace]) {
        marketplaceCounts[o.marketplace].count++;
        if (o.internalStatus !== 'CANCELLED') {
          marketplaceCounts[o.marketplace].revenue += o.totalAmount;
        }
      }
    });

    // 7-day trend
    const dailyTrendMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyTrendMap[key] = {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: 0,
        revenue: 0,
      };
    }

    orders.forEach(o => {
      const key = o.orderDate.slice(0, 10);
      if (dailyTrendMap[key]) {
        dailyTrendMap[key].orders++;
        if (o.internalStatus !== 'CANCELLED') {
          dailyTrendMap[key].revenue += o.totalAmount;
        }
      }
    });

    const dailyTrend = Object.values(dailyTrendMap);

    // Product-wise sales
    const productSalesMap: Record<string, { sku: string; name: string; quantity: number; revenue: number }> = {};
    orders.forEach(o => {
      if (o.internalStatus !== 'CANCELLED') {
        o.items.forEach(item => {
          if (!productSalesMap[item.sku]) {
            productSalesMap[item.sku] = {
              sku: item.sku,
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
          }
          productSalesMap[item.sku].quantity += item.quantity;
          productSalesMap[item.sku].revenue += item.totalPrice;
        });
      }
    });

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      success: true,
      kpis: {
        totalOrders,
        totalSales,
        totalRevenue,
        todayOrdersCount: todayOrders.length,
        todaySales,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        cancellationRate: totalOrders > 0 ? Number(((cancelledOrders / totalOrders) * 100).toFixed(1)) : 0,
        returnRate: totalOrders > 0 ? Number(((returnedOrders / totalOrders) * 100).toFixed(1)) : 0,
      },
      marketplaceBreakdown: Object.entries(marketplaceCounts).map(([key, val]) => ({
        marketplace: key,
        name: val.name,
        orders: val.count,
        revenue: val.revenue,
      })),
      dailyTrend,
      topProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
