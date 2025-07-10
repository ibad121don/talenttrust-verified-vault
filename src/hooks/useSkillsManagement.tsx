
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getUserDbId } from '@/utils/userUtils';
import { SkillsService, Skill } from '@/services/skillsService';
import { QualificationsService, Qualification } from '@/services/qualificationsService';

export type { Skill, Qualification };

export const useSkillsManagement = (userId?: string) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDbId, setUserDbId] = useState<string | null>(null);

  // Initialize user database ID
  useEffect(() => {
    const initializeUserDbId = async () => {
      if (userId) {
        const dbId = await getUserDbId(userId);
        setUserDbId(dbId);
      }
    };
    initializeUserDbId();
  }, [userId]);

  const loadSkills = async () => {
    if (!userDbId) return;
    
    setIsLoading(true);
    try {
      const skillsData = await SkillsService.loadSkills(userDbId);
      setSkills(skillsData);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadQualifications = async () => {
    if (!userDbId) return;
    
    setIsLoading(true);
    try {
      const qualificationsData = await QualificationsService.loadQualifications(userDbId);
      setQualifications(qualificationsData);
    } catch (error) {
      console.error('Error loading qualifications:', error);
      toast({
        title: "Error",
        description: "Failed to load qualifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = async (skillName: string, category: 'technical' | 'soft' | 'certification' = 'technical') => {
    if (!userDbId) {
      toast({
        title: "Error",
        description: "User not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSkill = await SkillsService.addSkill(userDbId, skillName, category);
      setSkills(prev => [...prev, newSkill]);
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    if (!userDbId) return;

    try {
      await SkillsService.removeSkill(userDbId, skillId);
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      toast({
        title: "Success",
        description: "Skill removed successfully",
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    }
  };

  const addQualification = async (qualification: Omit<Qualification, 'id' | 'verified'>) => {
    if (!userDbId) {
      toast({
        title: "Error",
        description: "User not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newQualification = await QualificationsService.addQualification(userDbId, qualification);
      setQualifications(prev => [...prev, newQualification]);
      toast({
        title: "Success",
        description: "Qualification added successfully",
      });
    } catch (error) {
      console.error('Error adding qualification:', error);
      toast({
        title: "Error",
        description: "Failed to add qualification",
        variant: "destructive",
      });
    }
  };

  const removeQualification = async (qualificationId: string) => {
    if (!userDbId) return;

    try {
      await QualificationsService.removeQualification(userDbId, qualificationId);
      setQualifications(prev => prev.filter(qual => qual.id !== qualificationId));
      toast({
        title: "Success",
        description: "Qualification removed successfully",
      });
    } catch (error) {
      console.error('Error removing qualification:', error);
      toast({
        title: "Error",
        description: "Failed to remove qualification",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (userDbId) {
      loadSkills();
      loadQualifications();
    }
  }, [userDbId]);

  return {
    skills,
    qualifications,
    isLoading,
    addSkill,
    removeSkill,
    addQualification,
    removeQualification,
    refreshData: () => {
      loadSkills();
      loadQualifications();
    }
  };
};
