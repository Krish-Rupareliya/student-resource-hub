// frontend/src/hooks/useViva.js
/**
 * Hook for managing universal viva questions, filtering, search,
 * progress tracking, and local persistence.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { getSubjectVivaData } from '../services/viva/vivaApi';
import { useSubject } from './useSubject';

export function useViva(subjectCode) {
  const normalizedCode = (subjectCode || '').toUpperCase().trim();
  
  // Load subject metadata from catalog
  const { subject, loading: subjectLoading } = useSubject(normalizedCode);

  // Dynamic Viva Data from DB via backend proxy
  const [vivaData, setVivaData] = useState(null);
  const [vivaLoading, setVivaLoading] = useState(Boolean(normalizedCode));
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!normalizedCode) {
      setVivaData(null);
      setVivaLoading(false);
      return;
    }
    setVivaLoading(true);
    setError(null);
    try {
      const data = await getSubjectVivaData(normalizedCode, subject);
      setVivaData(data);
    } catch (err) {
      setError(err);
    } finally {
      setVivaLoading(false);
    }
  }, [normalizedCode, subject]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // UI Filtering State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'theory' | 'practical' | 'experiments' | 'quick-revision' | 'bookmarked'
  const [selectedSection, setSelectedSection] = useState('all'); // 'all' or sectionId/name
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all'); // 'all' | 'basic' | 'intermediate' | 'advanced'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'learned' | 'revision' | 'unattempted'

  // Expanded Questions State (Set of IDs)
  const [expandedQuestionIds, setExpandedQuestionIds] = useState(new Set());

  // Local Storage Persistence for Bookmarks and Learning Progress
  const bookmarkStorageKey = `viva_bookmarks_${normalizedCode}`;
  const learnedStorageKey = `viva_learned_${normalizedCode}`;
  const revisionStorageKey = `viva_revision_${normalizedCode}`;

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const [learnedIds, setLearnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(learnedStorageKey);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const [revisionIds, setRevisionIds] = useState(() => {
    try {
      const saved = localStorage.getItem(revisionStorageKey);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(bookmarkStorageKey, JSON.stringify([...bookmarkedIds]));
    } catch (e) {
      console.warn('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds, bookmarkStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(learnedStorageKey, JSON.stringify([...learnedIds]));
    } catch (e) {
      console.warn('Failed to save learned status to localStorage', e);
    }
  }, [learnedIds, learnedStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(revisionStorageKey, JSON.stringify([...revisionIds]));
    } catch (e) {
      console.warn('Failed to save revision status to localStorage', e);
    }
  }, [revisionIds, revisionStorageKey]);

  // Actions
  const toggleBookmark = useCallback((id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleLearned = useCallback((id) => {
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // If marked learned, remove from need-revision
        setRevisionIds((rev) => {
          const nextRev = new Set(rev);
          nextRev.delete(id);
          return nextRev;
        });
      }
      return next;
    });
  }, []);

  const toggleNeedRevision = useCallback((id) => {
    setRevisionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // If marked need-revision, remove from learned
        setLearnedIds((lrn) => {
          const nextLrn = new Set(lrn);
          nextLrn.delete(id);
          return nextLrn;
        });
      }
      return next;
    });
  }, []);

  const toggleQuestionExpanded = useCallback((id) => {
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback((idsToExpand) => {
    setExpandedQuestionIds(new Set(idsToExpand));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedQuestionIds(new Set());
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSection('all');
    setSelectedDifficulty('all');
    setStatusFilter('all');
    setActiveTab('all');
  }, []);

  // Raw Questions
  const allQuestions = useMemo(() => {
    return vivaData?.questions || [];
  }, [vivaData]);

  const allExperiments = useMemo(() => {
    return vivaData?.experiments || [];
  }, [vivaData]);

  const sections = useMemo(() => {
    return vivaData?.sections || [];
  }, [vivaData]);

  // Filtered Questions Engine
  const filteredQuestions = useMemo(() => {
    let result = [...allQuestions];

    // Tab filter
    if (activeTab === 'theory') {
      result = result.filter((q) => (q.category || '').toLowerCase().includes('theory'));
    } else if (activeTab === 'practical') {
      result = result.filter((q) => {
        const cat = (q.category || '').toLowerCase();
        return cat.includes('practical') || cat.includes('experiment') || cat.includes('lab');
      });
    } else if (activeTab === 'bookmarked') {
      result = result.filter((q) => bookmarkedIds.has(q.id));
    }

    // Section filter
    if (selectedSection !== 'all') {
      result = result.filter(
        (q) => q.section === selectedSection || (q.section && q.section.toLowerCase().includes(selectedSection.toLowerCase()))
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter((q) => q.difficulty === selectedDifficulty);
    }

    // Status filter
    if (statusFilter === 'learned') {
      result = result.filter((q) => learnedIds.has(q.id));
    } else if (statusFilter === 'revision') {
      result = result.filter((q) => revisionIds.has(q.id));
    } else if (statusFilter === 'unattempted') {
      result = result.filter((q) => !learnedIds.has(q.id) && !revisionIds.has(q.id));
    }

    // Search Query (Text, keywords, section, answer, code)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const questionMatch = (item.question || '').toLowerCase().includes(q);
        const shortAnsMatch = (item.shortAnswer || '').toLowerCase().includes(q);
        const detailedMatch = (item.detailedAnswer || '').toLowerCase().includes(q);
        const sectionMatch = (item.section || '').toLowerCase().includes(q);
        const quickRevMatch = (item.quickRevision || '').toLowerCase().includes(q);
        const tagsMatch = Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(q));
        const keyPointsMatch = Array.isArray(item.keyPoints) && item.keyPoints.some((kp) => kp.toLowerCase().includes(q));

        return questionMatch || shortAnsMatch || detailedMatch || sectionMatch || quickRevMatch || tagsMatch || keyPointsMatch;
      });
    }

    return result;
  }, [
    allQuestions,
    activeTab,
    selectedSection,
    selectedDifficulty,
    statusFilter,
    searchQuery,
    bookmarkedIds,
    learnedIds,
    revisionIds,
  ]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = allQuestions.length;
    const learned = allQuestions.filter((q) => learnedIds.has(q.id)).length;
    const revision = allQuestions.filter((q) => revisionIds.has(q.id)).length;
    const bookmarked = allQuestions.filter((q) => bookmarkedIds.has(q.id)).length;
    const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

    return {
      total,
      learned,
      revision,
      bookmarked,
      percentage,
      experimentsCount: allExperiments.length
    };
  }, [allQuestions, learnedIds, revisionIds, bookmarkedIds, allExperiments]);

  // Find next unlearned question for "Continue Preparation"
  const getNextUnlearnedQuestion = useCallback(() => {
    return allQuestions.find((q) => !learnedIds.has(q.id)) || allQuestions[0];
  }, [allQuestions, learnedIds]);

  return {
    subject: vivaData || subject,
    loading: subjectLoading || vivaLoading,
    error: error ? error.message : null,
    refetch,
    // Data
    allQuestions,
    filteredQuestions,
    experiments: allExperiments,
    sections,
    stats,
    // Filters State
    activeTab,
    setActiveTab,
    selectedSection,
    setSelectedSection,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    statusFilter,
    setStatusFilter,
    // Expanded State
    expandedQuestionIds,
    toggleQuestionExpanded,
    expandAll,
    collapseAll,
    // Bookmarks & Learning Progress
    bookmarkedIds,
    learnedIds,
    revisionIds,
    toggleBookmark,
    toggleLearned,
    toggleNeedRevision,
    clearFilters,
    getNextUnlearnedQuestion,
  };
}
