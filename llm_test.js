const { OpenAI } = require('openai');

// 配置DeepSeek API客户端
function createOpenAIClient() {
  // 用户需要替换以下值为实际信息
  const API_KEY = "7acecda5-cbc2-4b21-8971-6e0b732b2861"; // 替换为实际API密钥
  const BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"; // 火山引擎API端点
  const MODEL = "ep-20250618120523-5qfgx"; // 替换为实际模型名称
  
  return new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
  });
}

// 测试用例 - 标准请求
async function testStandardRequest() {
  const openai = createOpenAIClient();
  
  try {
    console.log("\n========== 标准请求测试 ==========");
    console.log("开始测试...\n");
    
    const testPrompt = "请用一句话解释量子计算的基本原理";
    console.log(`测试Prompt: "\x1b[33m${testPrompt}\x1b[0m"`);
    
    console.log("\n\x1b[36m调用API中...\x1b[0m");
    const completion = await openai.chat.completions.create({
      model: "ep-20250618120523-5qfgx",
      messages: [
        { role: 'system', content: '你是人工智能助手' },
        { role: 'user', content: testPrompt },
      ],
    });
    
    console.log("\n收到API响应:");
    console.log(JSON.stringify(completion, null, 2));
    
    console.log("\n测试结果:");
    if (completion.choices && completion.choices.length > 0) {
      const choice = completion.choices[0];
      console.log(`- 状态: ${choice.finish_reason === "stop" ? "\x1b[32m成功\x1b[0m" : "\x1b[31m失败\x1b[0m"}`);
      console.log(`- 响应内容: "\x1b[33m${choice.message?.content || '无内容'}\x1b[0m"`);
      
      if (completion.usage) {
        console.log(`- 使用token数: \x1b[36m${completion.usage.total_tokens}\x1b[0m`);
      }
      
      console.log("\n\x1b[42m\x1b[30m✅ 标准请求测试通过\x1b[0m");
      return true;
    } else {
      throw new Error("未收到有效响应");
    }
  } catch (error) {
    console.error("\x1b[41m❌ 标准请求测试失败:\x1b[0m", error);
    return false;
  }
}

// 测试用例 - 流式请求
async function testStreamingRequest() {
  const openai = createOpenAIClient();
  
  try {
    console.log("\n\n========== 流式请求测试 ==========");
    console.log("开始测试...\n");
    
    const testPrompt = "列举三种常见的十字花科植物";
    console.log(`测试Prompt: "\x1b[33m${testPrompt}\x1b[0m"`);
    
    console.log("\n\x1b[36m调用API中(流式模式)...\x1b[0m");
    const stream = await openai.chat.completions.create({
      model: "ep-20250618120523-5qfgx",
      messages: [
        { role: 'system', content: '你是人工智能助手' },
        { role: 'user', content: testPrompt },
      ],
      stream: true,
    });
    
    let fullResponse = "";
    console.log("\n流式响应内容:");
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(`\x1b[33m${content}\x1b[0m`);
      fullResponse += content;
    }
    console.log("\n");
    
    console.log("\n测试结果:");
    console.log(`- 完整响应: "\x1b[33m${fullResponse}\x1b[0m"`);
    console.log("\n\x1b[42m\x1b[30m✅ 流式请求测试通过\x1b[0m");
    return true;
  } catch (error) {
    console.error("\x1b[41m❌ 流式请求测试失败:\x1b[0m", error);
    return false;
  }
}

// 执行测试
async function runTests() {
  console.log("\x1b[44m\x1b[37m========== 开始LLM API测试 ==========\x1b[0m");
  
  const standardResult = await testStandardRequest();
  const streamingResult = await testStreamingRequest();
  
  console.log("\n\x1b[44m\x1b[37m========== 测试总结 ==========\x1b[0m");
  console.log(`- 标准请求测试: ${standardResult ? "\x1b[32m通过" : "\x1b[31m失败"}\x1b[0m`);
  console.log(`- 流式请求测试: ${streamingResult ? "\x1b[32m通过" : "\x1b[31m失败"}\x1b[0m`);
  
  if (standardResult && streamingResult) {
    console.log("\n\x1b[42m\x1b[30m✅ 所有测试通过\x1b[0m");
  } else {
    console.log("\n\x1b[41m❌ 部分测试失败\x1b[0m");
  }
}

runTests();