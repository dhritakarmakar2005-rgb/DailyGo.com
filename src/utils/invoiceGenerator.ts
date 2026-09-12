import { Order } from '../types';

export function generateInvoiceHtml(order: Order, appName: string = 'DailyGo'): string {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsRows = order.items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${idx + 1}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <strong>${item.product.name}</strong>
        ${item.selectedVariation ? `<div style="font-size: 11px; color: #64748b;">Variant: ${item.selectedVariation.name}</div>` : ''}
        ${item.selectedAddOns && item.selectedAddOns.length > 0 ? `<div style="font-size: 11px; color: #16a34a;">+ ${item.selectedAddOns.map(a => a.name).join(', ')}</div>` : ''}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right;">₹${item.itemPrice}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; font-weight: bold;">₹${item.itemPrice * item.quantity}</td>
    </tr>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice - ${order.orderNumber} - ${appName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 24px;
    }
    .invoice-card {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #047857;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    .inv-details {
      text-align: right;
    }
    .inv-number {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }
    .inv-date {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .grid {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .col {
      width: 48%;
    }
    .col-title {
      font-weight: 800;
      text-transform: uppercase;
      font-size: 11px;
      color: #94a3b8;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      padding: 10px 12px;
      text-align: left;
    }
    .summary-table {
      width: 260px;
      margin-left: auto;
      font-size: 13px;
    }
    .summary-table td {
      padding: 6px 0;
    }
    .summary-total {
      border-top: 2px solid #0f172a;
      padding-top: 10px !important;
      font-size: 16px !important;
      font-weight: 900;
      color: #047857;
    }
    .footer-note {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .invoice-card {
        box-shadow: none;
        border: none;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <h1 class="brand-title">${appName}</h1>
        <p class="brand-subtitle">Hyperlocal Fast Delivery • Local Town & Villages</p>
      </div>
      <div class="inv-details">
        <div class="inv-number">INVOICE #${order.orderNumber}</div>
        <div class="inv-date">${dateStr}</div>
        <div style="font-size: 11px; color: #16a34a; font-weight: bold; margin-top: 4px;">
          STATUS: ${order.orderStatus.toUpperCase()}
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="col">
        <div class="col-title">Store & Vendor</div>
        <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${order.shopName}</div>
        <div style="color: #64748b; margin-top: 2px;">Category: ${order.shopType}</div>
      </div>
      <div class="col">
        <div class="col-title">Billed & Delivered To</div>
        <div style="font-weight: bold; color: #0f172a;">${order.customerName}</div>
        <div style="color: #475569;">📞 ${order.customerMobile}</div>
        ${order.customerEmail ? `<div style="color: #64748b;">✉️ ${order.customerEmail}</div>` : ''}
        <div style="color: #475569; margin-top: 4px;">
          📍 ${order.deliveryAddress.street}, ${order.deliveryAddress.townOrVillage}
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 30px;">#</th>
          <th>Item Description</th>
          <th style="text-align: center; width: 60px;">Qty</th>
          <th style="text-align: right; width: 80px;">Rate</th>
          <th style="text-align: right; width: 90px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <table class="summary-table">
      <tr>
        <td style="color: #64748b;">Subtotal:</td>
        <td style="text-align: right; font-weight: 600;">₹${order.itemTotal}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Delivery Fee:</td>
        <td style="text-align: right; font-weight: 600;">
          ${order.deliveryFee === 0 ? '<span style="color: #16a34a;">FREE</span>' : `₹${order.deliveryFee}`}
        </td>
      </tr>
      ${
        order.couponDiscount && order.couponDiscount > 0
          ? `<tr>
        <td style="color: #16a34a; font-weight: 600;">Discount (${order.appliedCouponCode || 'PROMO'}):</td>
        <td style="text-align: right; color: #16a34a; font-weight: 600;">-₹${order.couponDiscount}</td>
      </tr>`
          : ''
      }
      <tr>
        <td class="summary-total">Total Paid:</td>
        <td class="summary-total" style="text-align: right;">₹${order.totalAmount}</td>
      </tr>
    </table>

    <div style="margin-top: 20px; font-size: 12px; color: #475569;">
      <strong>Payment Mode:</strong> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'})
    </div>

    <div class="footer-note">
      <p style="margin: 0; font-weight: 600; color: #0f172a;">Thank you for ordering with ${appName}!</p>
      <p style="margin: 4px 0 0 0;">For assistance or order inquiries, please reach out via Customer Support in the app.</p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadInvoiceFile(order: Order, appName: string = 'DailyGo'): void {
  const htmlContent = generateInvoiceHtml(order, appName);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `DailyGo-Invoice-${order.orderNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printInvoice(order: Order, appName: string = 'DailyGo'): void {
  const htmlContent = generateInvoiceHtml(order, appName);
  try {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // ignore print failure
        }
      }, 400);
      return;
    }
  } catch (e) {
    console.warn('[Invoice] Popup window blocked by sandbox or browser:', e);
  }
  // Fallback: trigger clean HTML invoice download
  downloadInvoiceFile(order, appName);
}
