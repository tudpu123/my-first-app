<?php
/**
 * 支付异步回调处理文件
 * 用于接收支付平台的异步通知
 */

// 记录回调日志
file_put_contents('payment_notify.log', date('Y-m-d H:i:s') . ' - 收到异步回调: ' . json_encode($_POST) . "\n", FILE_APPEND);

// 验证签名（这里需要根据实际支付平台的签名规则实现）
function verifySign($params, $key) {
    // 移除sign和sign_type参数
    $sign = $params['sign'];
    unset($params['sign']);
    unset($params['sign_type']);
    
    // 参数排序
    ksort($params);
    
    // 构建待签名字符串
    $signString = '';
    foreach ($params as $k => $v) {
        if ($v !== '' && !is_array($v)) {
            $signString .= $k . '=' . $v . '&';
        }
    }
    $signString = rtrim($signString, '&');
    
    // 添加密钥
    $signString .= $key;
    
    // 计算签名
    $calculatedSign = md5($signString);
    
    return $calculatedSign === $sign;
}

// 处理支付结果
if ($_POST['trade_status'] === 'TRADE_SUCCESS') {
    // 支付成功处理
    $outTradeNo = $_POST['out_trade_no'];
    $tradeNo = $_POST['trade_no'];
    $totalAmount = $_POST['total_amount'];
    
    // 记录成功日志
    file_put_contents('payment_success.log', 
        date('Y-m-d H:i:s') . " - 支付成功 - 订单号: $outTradeNo, 交易号: $tradeNo, 金额: $totalAmount\n", 
        FILE_APPEND
    );
    
    // 返回成功响应给支付平台
    echo 'success';
} else {
    // 支付失败处理
    file_put_contents('payment_failed.log', 
        date('Y-m-d H:i:s') . ' - 支付失败: ' . json_encode($_POST) . "\n", 
        FILE_APPEND
    );
    
    echo 'fail';
}
?>