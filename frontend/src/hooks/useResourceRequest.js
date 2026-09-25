import { useState, useCallback } from 'react';
import { submitResourceRequest, submitOpportunity, submitResourceUpload } from '../services/requests/requestsApi';

/**
 * Hook: manage resource request form state and submission.
 *
 * @returns {Object} Form state, handlers, and submission function
 */
export function useResourceRequest() {
  const [formData, setFormData] = useState({
    subjectCode: '',
    resourceType: 'Notes',
    message: '',
    requesterEmail: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    const { success, error } = await submitResourceRequest(formData);

    if (success) {
      setStatus('success');
      setFormData({ subjectCode: '', resourceType: 'Notes', message: '', requesterEmail: '' });
    } else {
      setStatus('error');
      setErrorMessage(error);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  return { formData, handleChange, handleSubmit, status, errorMessage, reset };
}

/**
 * Hook: manage opportunity submission form.
 */
export function useOpportunitySubmit() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Internships',
    link: '',
    deadline: '',
    submitterEmail: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    const { success, error } = await submitOpportunity(formData);

    if (success) {
      setStatus('success');
      setFormData({ title: '', description: '', category: 'Internships', link: '', deadline: '', submitterEmail: '' });
    } else {
      setStatus('error');
      setErrorMessage(error);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  return { formData, handleChange, handleSubmit, status, errorMessage, reset };
}

/**
 * Hook: manage resource upload submission.
 */
export function useResourceUpload() {
  const [formData, setFormData] = useState({
    subjectCode: '',
    resourceType: 'Notes',
    title: '',
    description: '',
    url: '',
    contributorEmail: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    const { success, error } = await submitResourceUpload(formData);

    if (success) {
      setStatus('success');
      setFormData({
        subjectCode: '',
        resourceType: 'Notes',
        title: '',
        description: '',
        url: '',
        contributorEmail: '',
      });
    } else {
      setStatus('error');
      setErrorMessage(error);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  return { formData, handleChange, handleSubmit, status, errorMessage, reset };
}
