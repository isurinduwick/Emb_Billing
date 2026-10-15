<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #222; }
    .header { background: #0F3D3E; color: #fff; padding: 14px 20px; width: 100%; }
    .header td { vertical-align: middle; }
    .header img { width: 40px; height: 40px; }
    .header h1 { font-size: 18px; letter-spacing: 1px; }
    .header p { font-size: 9px; color: #cfe3dd; margin-top: 3px; }
    .meta { padding: 12px 20px; width: 100%; }
    .meta td { vertical-align: top; font-size: 10px; }
    .meta .label { color: #12876F; font-weight: bold; font-size: 8px; text-transform: uppercase; }
    table.items { width: 100%; border-collapse: collapse; margin-top: 4px; }
    table.items th { background: #0F3D3E; color: #fff; text-align: left; padding: 6px 20px 6px 20px; font-size: 9px; }
    table.items th.r, table.items td.r { text-align: right; }
    table.items td { padding: 6px 20px; border-bottom: 0.5px solid #D8E3DF; }
    table.items td .cat { color: #777; font-size: 8px; }
    .totals { width: 100%; margin-top: 8px; }
    .totals td { padding: 3px 20px; font-size: 10px; }
    .totals .r { text-align: right; }
    .grand td { background: #12876F; color: #fff; font-weight: bold; font-size: 12px; padding: 8px 20px; }
    .footer { text-align: center; color: #777; font-size: 9px; margin-top: 18px; padding: 0 20px; }
</style>
</head>
<body>
    <table class="header">
        <tr>
            <td style="width:48px;"><img src="<?php echo e(public_path('logo.png')); ?>" alt="logo"></td>
            <td style="padding-left:10px;">
                <h1><?php echo e($resort['name']); ?></h1>
                <p><?php echo e($resort['address']); ?> <?php if($resort['phone']): ?> | <?php echo e($resort['phone']); ?> <?php endif; ?></p>
            </td>
        </tr>
    </table>

    <table class="meta">
        <tr>
            <td>
                <div class="label">Invoice</div>
                <div><strong><?php echo e($invoice->invoice_no); ?></strong></div>
                <div class="label" style="margin-top:6px;">Date &amp; Time</div>
                <div><?php echo e($invoice->created_at->format('d M Y  h:i A')); ?></div>
            </td>
            <td style="text-align:right;">
                <div class="label">Customer</div>
                <div><?php echo e($invoice->customer_name ?: 'Walk-in Guest'); ?></div>
                <div class="label" style="margin-top:6px;">Payment Method</div>
                <div><strong><?php echo e(strtoupper($invoice->payment_method)); ?></strong></div>
            </td>
        </tr>
    </table>

    <table class="items">
        <tr><th>Item</th><th class="r">Price (LKR)</th></tr>
        <?php $__currentLoopData = $invoice->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
            <td><?php echo e($item->name); ?> <?php if($item->category): ?><span class="cat"> - <?php echo e($item->category->name); ?></span><?php endif; ?></td>
            <td class="r"><?php echo e(number_format((float) $item->price, 2)); ?></td>
        </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </table>

    <table class="totals">
        <tr><td>Subtotal</td><td class="r"><?php echo e(number_format((float) $invoice->subtotal, 2)); ?></td></tr>
        <?php if($invoice->service_charge_pct): ?>
        <tr>
            <td>Service Charge (<?php echo e(rtrim(rtrim(number_format((float) $invoice->service_charge_pct, 2), '0'), '.')); ?>%)</td>
            <td class="r"><?php echo e(number_format((float) $invoice->service_charge_amount, 2)); ?></td>
        </tr>
        <?php endif; ?>
    </table>
    <table class="totals grand">
        <tr><td>TOTAL</td><td class="r">LKR <?php echo e(number_format((float) $invoice->total, 2)); ?></td></tr>
    </table>

    <div class="footer">Thank you for dining with us! We hope to see you again.</div>
</body>
</html>
<?php /**PATH C:\Users\User\Downloads\emeraldbay-billing\emeraldbay-billing\resources\views/pdf/invoice.blade.php ENDPATH**/ ?>