<?php
/**
 * 支付同步回调处理文件
 * 用于用户支付完成后跳转回网站
 */

// 记录回调日志
file_put_contents('payment_return.log', date('Y-m-d H:i:s') . ' - 收到同步回调: ' . json_encode($_GET) . "\n", FILE_APPEND);

// 获取支付结果参数
$tradeStatus = $_GET['trade_status'] ?? '';
$outTradeNo = $_GET['out_trade_no'] ?? '';
$tradeNo = $_GET['trade_no'] ?? '';
$totalAmount = $_GET['total_amount'] ?? '';

// 构建重定向URL
$redirectUrl = 'index.html';

if ($tradeStatus === 'TRADE_SUCCESS') {
    // 支付成功，添加成功参数
    $redirectUrl .= '?status=success&out_trade_no=' . urlencode($outTradeNo) . 
                   '&trade_no=' . urlencode($tradeNo) . 
                   '&total_amount=' . urlencode($totalAmount);
    
    // 记录成功日志
    file_put_contents('payment_success.log', 
        date('Y-m-d H:i:s') . " - 同步回调成功 - 订单号: $outTradeNo, 交易号: $tradeNo, 金额: $totalAmount\n", 
        FILE_APPEND
    );
} else {
    // 支付失败，添加失败参数
    $redirectUrl .= '?status=failed&out_trade_no=' . urlencode($outTradeNo);
    
    // 记录失败日志
    file_put_contents('payment_failed.log', 
        date('Y-m-d H:i:s') . " - 同步回调失败 - 订单号: $outTradeNo, 状态: $tradeStatus\n", 
        FILE_APPEND
    );
}

// 重定向回原页面
header('Location: ' . $redirectUrl);
exit;
?>