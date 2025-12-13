/**
 * 示例 API 路由
 * 演示 Next.js App Router 的 API 路由用法
 * 后续可扩展为登录、数据库操作、文件上传等功能
 */

import { NextResponse } from 'next/server';

/**
 * GET 请求处理
 */
export async function GET() {
  return NextResponse.json({
    message: '欢迎来到 Vanilla Yukirin 的 API',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST 请求处理
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: '数据接收成功',
      received: body,
      status: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: '请求处理失败',
        status: 'error',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 400 }
    );
  }
}
