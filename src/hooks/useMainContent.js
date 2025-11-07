import { useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";
import { useJDCreator } from "./useJDCreator";
import { useProfileMatcher } from "./useProfileMatcher";
import { uploadResumes, generateJd } from "@/utils/api"; // ✅ Import from correct path

export const useMainContent = () => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    messages,
    setMessages,
    handleSend: handleWebSocketSend
  } = useWebSocket();

  const {
    jdAnswers,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    handleJdProcess,
    handleJdSend
  } = useJDCreator(setMessages, setIsLoading);

  const {
    fetchProfileMatches
  } = useProfileMatcher(setMessages, setIsLoading);

  const handleFeatureClick = useCallback((feature) => {
    setSelectedFeature(feature);
    setMessages([]);
  }, [setMessages]);

  const handleTaskSelect = useCallback((task) => {
    setSelectedTask(task);
    if (task === "JD Creator") {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Let's create a job description! What is the job title/role?" 
      }]);
    }
  }, [setMessages]);

  const handleRefresh = useCallback(() => {
    setIsLoading(false);
    setMessages([]);
    setSelectedFeature("");
    setSelectedTask("");
  }, [setMessages]);

  const handleSend = useCallback((message) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    if (selectedTask === "JD Creator") {
      handleJdProcess(message);
    } else if (selectedTask === "Profile Matcher") {
      fetchProfileMatches(message);
    } else {
      handleWebSocketSend(message, selectedTask);
    }
  }, [selectedTask, handleJdProcess, fetchProfileMatches, handleWebSocketSend, setMessages]);

  const uploadResumesHandler = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    
    try {
      const result = await uploadResumes(files);
      setMessages(prev => [
        ...prev,
        { role: "assistant", type: "resume_table", data: result.uploaded_files }
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "❌ Failed to upload resumes. Try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [setMessages]);

  return {
    messages,
    selectedFeature,
    selectedTask,
    isLoading,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    handleFeatureClick,
    handleTaskSelect,
    handleRefresh,
    handleSend,
    handleJdSend,
    uploadResumes: uploadResumesHandler
  };
};