import React from 'react';
import { useProjectsByType } from '../../hooks/useApi';
import PageLayout from '../../components/PageLayout/PageLayout';
import './SpaceDesign.css';

const SpaceDesign: React.FC = () => {
  const { data: projects, loading, error, refetch } = useProjectsByType('space-design');

  return (
    <PageLayout
      title="空间设计"
      projects={projects}
      loading={loading}
      error={error}
      onRetry={refetch}
      labelMap={{
        architect: '建筑设计',
        location: '地址',
        category: '类别'
      }}
    />
  );
};

export default SpaceDesign;
