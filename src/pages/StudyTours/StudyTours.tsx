import React from 'react';
import { useProjectsByType } from '../../hooks/useApi';
import PageLayout from '../../components/PageLayout/PageLayout';
import './StudyTours.css';

const StudyTours: React.FC = () => {
  const { data: projects, loading, error, refetch } = useProjectsByType('study_tours');

  return (
    <PageLayout
      title="专项游学"
      projects={projects}
      loading={loading}
      error={error}
      onRetry={refetch}
      className="study-tours"
    />
  );
};

export default StudyTours;
