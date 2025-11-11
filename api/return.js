/**
 * 支付同步回调处理函数
 * 用于用户支付完成后跳转回网站
 */
module.exports = async (req, res) => {
  try {
    // 记录回调日志
    const logEntry = `${new Date().toISOString()} - 收到同步回调: ${JSON.stringify(req.query)}\n`;
    console.log(logEntry);

    // 获取支付结果参数
    const tradeStatus = req.query.trade_status || '';
    const outTradeNo = req.query.out_trade_no || '';
    const tradeNo = req.query.trade_no || '';
    const totalAmount = req.query.total_amount || '';

    // 构建重定向URL
    let redirectUrl = '/1.html';

    if (tradeStatus === 'TRADE_SUCCESS') {
      // 支付成功，添加成功参数
      redirectUrl += `?status=success&out_trade_no=${encodeURIComponent(outTradeNo)}` +
                    `&trade_no=${encodeURIComponent(tradeNo)}` +
                    `&total_amount=${encodeURIComponent(totalAmount)}`;
      
      // 记录成功日志
      const successLog = `${new Date().toISOString()} - 同步回调成功 - 订单号: ${outTradeNo}, 交易号: ${tradeNo}, 金额: ${totalAmount}\n`;
      console.log(successLog);
    } else {
      // 支付失败，添加失败参数
      redirectUrl += `?status=failed&out_trade_no=${encodeURIComponent(outTradeNo)}`;
      
      // 记录失败日志
      const failedLog = `${new Date().toISOString()} - 同步回调失败 - 订单号: ${outTradeNo}, 状态: ${tradeStatus}\n`;
      console.log(failedLog);
    }

    // 重定向回原页面
    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('同步回调处理错误:', error);
    res.redirect(302, '/1.html?status=error');
  }
};