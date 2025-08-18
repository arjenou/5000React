import React from 'react';
import { useProjectsByType } from '../../hooks/useApi';
import PageLayout from '../../components/PageLayout/PageLayout';
import './ExhibitionPlanning.css';

const ExhibitionPlanning: React.FC = () => {
  const { data: projects, loading, error, refetch } = useProjectsByType('exhibition-planning');

  return (
    <PageLayout
      title="展览策划"
      projects={projects}
      loading={loading}
      error={error}
      onRetry={refetch}
      labelMap={{
        architect: '策展人',
        location: '地址',
        category: '类别'
      }}
      className="exhibition-planning"
    />
  );
};

export default ExhibitionPlanning;
