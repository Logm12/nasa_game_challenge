/**
 * Netlify Function: Mission History & Debrief Report API
 *
 * Endpoint serverless điều phối các yêu cầu:
 * - POST /.netlify/functions/mission-history (hoặc /api/missions/history/sync): Lưu lượt chơi online
 * - GET  /.netlify/functions/mission-history (hoặc /api/missions/history): Lấy danh sách lịch sử có phân trang
 * - GET  /.netlify/functions/mission-history?runId=...&action=report: Lấy debrief report theo runId
 */

import { FileBasedOnlineHistoryStorage } from '../../src/domain/online-history-storage';
import { OnlineHistoryService } from '../../src/domain/online-history-service';
import { OnlineSyncPayload, OnlineHistoryPaginationQuery } from '../../src/domain/mission-contract';

// Khởi tạo persistent storage (bền vững server-side)
const storage = new FileBasedOnlineHistoryStorage();
const historyService = new OnlineHistoryService(storage);

export async function handler(event: any, context: any) {
  const method = event.httpMethod || 'GET';
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  const query = event.queryStringParameters || {};

  // Headers chuẩn CORS và Content-Type
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    if (method === 'POST') {
      let payload: OnlineSyncPayload;
      try {
        payload = JSON.parse(event.body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: { code: 'INVALID_JSON', message: 'Body không phải JSON hợp lệ.' } })
        };
      }

      const res = await historyService.handleSyncRun(authHeader, payload);
      return {
        statusCode: res.statusCode,
        headers,
        body: JSON.stringify(res)
      };
    }

    if (method === 'GET') {
      // Nếu query có runId và action=report -> lấy report
      if (query.runId && query.action === 'report') {
        const res = await historyService.handleGetReport(authHeader, query.runId);
        return {
          statusCode: res.statusCode,
          headers,
          body: JSON.stringify(res)
        };
      }

      // Ngược lại -> lấy danh sách lịch sử
      const paginationQuery: OnlineHistoryPaginationQuery = {
        page: query.page ? parseInt(query.page, 10) : 1,
        pageSize: query.pageSize ? parseInt(query.pageSize, 10) : 10,
        status: query.status as any
      };

      const res = await historyService.handleListHistory(authHeader, paginationQuery);
      return {
        statusCode: res.statusCode,
        headers,
        body: JSON.stringify(res)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: `Phương thức ${method} không được hỗ trợ.` } })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Lỗi server.' } })
    };
  }
}
