<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Invoice <?php echo e($invoice->invoice_no); ?> — <?php echo e($resort['name']); ?></title>
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
            background: #f5f5f4;
            color: #1c1917;
            padding: 20px 14px 48px;
        }
        .card {
            max-width: 480px;
            margin: 0 auto;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,.08);
        }
        .header {
            background: #0f3d3e;
            color: #fff;
            padding: 24px 22px;
            text-align: center;
        }
        .header img { width: 56px; height: 56px; object-fit: contain; margin-bottom: 6px; }
        .header h1 { margin: 0; font-size: 18px; letter-spacing: .04em; font-weight: 800; }
        .header p { margin: 4px 0 0; font-size: 12px; color: #a9d8c9; }
        .badge {
            display: inline-block; margin-top: 14px; background: #12876f;
            color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .05em;
            padding: 4px 12px; border-radius: 999px; text-transform: uppercase;
        }
        .meta { display: flex; justify-content: space-between; gap: 12px; padding: 18px 22px; border-bottom: 1px solid #e7e5e4; flex-wrap: wrap; }
        .meta div { min-width: 45%; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #0e6d5a; font-weight: 700; }
        .value { font-size: 13px; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; }
        .items { padding: 6px 22px 0; }
        .items td { padding: 9px 0; border-bottom: 1px solid #f0efee; font-size: 13px; }
        .items td.r { text-align: right; white-space: nowrap; }
        .cat { display: inline-block; margin-left: 6px; font-size: 10px; background: #d5ece4; color: #0f5449; padding: 1px 7px; border-radius: 999px; }
        .totals { padding: 4px 22px 18px; }
        .totals td { padding: 4px 0; font-size: 13px; }
        .totals td.r { text-align: right; }
        .totals .muted { color: #78716c; }
        .grand td { font-weight: 800; font-size: 17px; padding-top: 10px; border-top: 1px solid #e7e5e4; color: #0f3d3e; }
        .actions { padding: 4px 22px 24px; }
        .btn {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 13px; border-radius: 12px; text-decoration: none;
            font-weight: 700; font-size: 14px; background: #12876f; color: #fff;
        }
        .footer { text-align: center; font-size: 12px; color: #a8a29e; margin-top: 18px; padding: 0 12px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <img src="/logo.png" alt="<?php echo e($resort['name']); ?>">
            <h1><?php echo e($resort['name']); ?></h1>
            <p><?php echo e($resort['address']); ?><?php if($resort['phone']): ?> &nbsp;&middot;&nbsp; <?php echo e($resort['phone']); ?><?php endif; ?></p>
            <span class="badge">Invoice <?php echo e($invoice->invoice_no); ?></span>
        </div>

        <div class="meta">
            <div>
                <div class="label">Date &amp; time</div>
                <div class="value"><?php echo e($invoice->created_at->format('d M Y, h:i A')); ?></div>
            </div>
            <div>
                <div class="label">Guest</div>
                <div class="value"><?php echo e($invoice->customer_name ?: 'Walk-in Guest'); ?></div>
            </div>
            <div>
                <div class="label">Payment</div>
                <div class="value"><?php echo e(strtoupper($invoice->payment_method)); ?></div>
            </div>
        </div>

        <table class="items">
            <?php $__currentLoopData = $invoice->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td><?php echo e($item->name); ?><?php if($item->category): ?><span class="cat"><?php echo e($item->category->name); ?></span><?php endif; ?></td>
                <td class="r">LKR <?php echo e(number_format((float) $item->price, 2)); ?></td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </table>

        <table class="totals">
            <tr><td class="muted">Subtotal</td><td class="r">LKR <?php echo e(number_format((float) $invoice->subtotal, 2)); ?></td></tr>
            <?php if($invoice->service_charge_pct): ?>
            <tr>
                <td class="muted">Service charge (<?php echo e(rtrim(rtrim(number_format((float) $invoice->service_charge_pct, 2), '0'), '.')); ?>%)</td>
                <td class="r">LKR <?php echo e(number_format((float) $invoice->service_charge_amount, 2)); ?></td>
            </tr>
            <?php endif; ?>
            <tr class="grand"><td>Total</td><td class="r">LKR <?php echo e(number_format((float) $invoice->total, 2)); ?></td></tr>
        </table>

        <div class="actions">
            <a class="btn" href="<?php echo e($downloadUrl); ?>">Download PDF</a>
        </div>
    </div>
    <div class="footer">Thank you for dining with us! We hope to see you again soon.</div>
</body>
</html>
<?php /**PATH C:\Users\User\Downloads\emeraldbay-billing\emeraldbay-billing\resources\views/public/invoice.blade.php ENDPATH**/ ?>