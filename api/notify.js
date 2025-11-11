const fs = require('fs');
const crypto = require('crypto');

/**
 * 支付异步回调处理函数
 * 用于接收支付平台的异步通知
 */
module.exports = async (req, res) => {
  try {
    // 记录回调日志
    const logEntry = `${new Date().toISOString()} - 收到异步回调: ${JSON.stringify(req.body)}\n`;
    
    // 在Vercel环境中，我们无法直接写入文件，所以使用console.log记录日志
    console.log(logEntry);

    // 验证签名函数
    const verifySign = (params, key) => {
      // 移除sign和sign_type参数
      const sign = params.sign;
      delete params.sign;
      delete params.sign_type;
      
      // 参数排序
      const sortedParams = Object.keys(params)
        .sort()
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {});
      
      // 构建待签名字符串
      let signString = '';
      for (const [key, value] of Object.entries(sortedParams)) {
        if (value !== '' && typeof value !== 'object') {
          signString += `${key}=${value}&`;
        }
      }
      signString = signString.slice(0, -1); // 移除最后一个&
      
      // 添加密钥
      signString += key;
      
      // 计算MD5签名
      const calculatedSign = crypto.createHash('md5').update(signString).digest('hex');
      
      return calculatedSign === sign;
    };

    // 处理支付结果
    if (req.body.trade_status === 'TRADE_SUCCESS') {
      // 支付成功处理
      const outTradeNo = req.body.out_trade_no;
      const tradeNo = req.body.trade_no;
      const totalAmount = req.body.total_amount;
      
      // 记录成功日志
      const successLog = `${new Date().toISOString()} - 支付成功 - 订单号: ${outTradeNo}, 交易号: ${tradeNo}, 金额: ${totalAmount}\n`;
      console.log(successLog);
      
      // 返回成功响应给支付平台
      res.status(200).send('success');
    } else {
      // 支付失败处理
      const failedLog = `${new Date().toISOString()} - 支付失败: ${JSON.stringify(req.body)}\n`;
      console.log(failedLog);
      
      res.status(200).send('fail');
    }
  } catch (error) {
    console.error('回调处理错误:', error);
    res.status(500).send('error');
  }
};