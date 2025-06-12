// hooks/useStageManager.js
import { useState, useCallback } from 'react';

export const useStageManager = () => {
  const [stages, setStages] = useState([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);

  const fetchStages = useCallback(async () => {
    setLoadingStages(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.stage`);
      const result = await response.json();
      
      if (result.success) {
        const sortedStages = result.data.sort((a, b) => a.sequence - b.sequence);
        setStages(sortedStages);
      } else {
        throw new Error('Failed to fetch stages');
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
      throw error;
    } finally {
      setLoadingStages(false);
    }
  }, []);

  const updateLeadStage = useCallback(async (leadId, stageId) => {
    setUpdatingStage(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage_id: stageId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update stage');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating stage:', error);
      throw error;
    } finally {
      setUpdatingStage(false);
    }
  }, []);

  const getAvailableStages = useCallback((currentStageId) => {
    if (!stages.length) return [];
    
    const currentIndex = stages.findIndex(stage => stage.id === currentStageId);
    if (currentIndex === -1) return stages;
    
    return stages.filter((stage, index) => index > currentIndex);
  }, [stages]);

  const getNextStage = useCallback((currentStageId) => {
    if (!stages.length) return null;
    
    const currentIndex = stages.findIndex(stage => stage.id === currentStageId);
    if (currentIndex === -1 || currentIndex === stages.length - 1) return null;
    
    return stages[currentIndex + 1];
  }, [stages]);

  return {
    stages,
    loadingStages,
    updatingStage,
    fetchStages,
    updateLeadStage,
    getAvailableStages,
    getNextStage
  };
};