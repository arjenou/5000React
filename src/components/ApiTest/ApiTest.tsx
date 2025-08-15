import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const result = await apiService.testConnection();
      if (result.success) {
        setTestResult(`✅ ${result.data?.message}`);
      } else {
        setTestResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ 测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProjectsApi = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const result = await apiService.getProjects();
      if (result.success) {
        setTestResult(`✅ 项目列表获取成功，共 ${result.data?.length || 0} 个项目`);
      } else {
        setTestResult(`❌ 项目列表获取失败: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ 项目列表测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSingleProject = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const result = await apiService.getProject('4');
      if (result.success) {
        setTestResult(`✅ 项目详情获取成功: ${result.data?.title}`);
      } else {
        setTestResult(`❌ 项目详情获取失败: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ 项目详情测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>API 测试工具</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={testApiConnection}
          disabled={isLoading}
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px',
            border: '1px solid #007acc',
            background: '#007acc',
            color: 'white',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '测试中...' : '测试API连接'}
        </button>
        
        <button 
          onClick={testProjectsApi}
          disabled={isLoading}
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px',
            border: '1px solid #28a745',
            background: '#28a745',
            color: 'white',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '测试中...' : '测试项目列表'}
        </button>
        
        <button 
          onClick={testSingleProject}
          disabled={isLoading}
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px',
            border: '1px solid #ffc107',
            background: '#ffc107',
            color: 'black',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '测试中...' : '测试项目详情'}
        </button>
      </div>
      
      {testResult && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          fontSize: '12px',
          background: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default ApiTest;
