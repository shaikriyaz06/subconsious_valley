"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackPopup({ isOpen, onClose, onSubmit, sessionTitle }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    happiness: "",
    calmness: "",
    mindState: "",
    didSleep: "",
    improvement: "",
    listenAgain: "",
    comments: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['happiness', 'calmness', 'mindState', 'didSleep', 'improvement', 'listenAgain'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'feedback', 
          sessionTitle, 
          userEmail: session?.user?.email,
          ...formData 
        })
      });
      
      if (response.ok) {
        onSubmit?.(formData);
        clearForm();
        onClose();
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user selects an option
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const clearForm = () => {
    setFormData({
      happiness: "",
      calmness: "",
      mindState: "",
      didSleep: "",
      improvement: "",
      listenAgain: "",
      comments: ""
    });
    setErrors({});
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-2xl rounded-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="relative bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <CardTitle className="text-xl font-bold text-center pr-8 text-white">
                Post-Audio Session Feedback
              </CardTitle>
              <p className="text-sm text-white/90 text-center">
                Scale note: For 1–5 questions, use 1 = very positive and 5 = very negative/indifferent
              </p>
            </CardHeader>

            <CardContent className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-8 border border-slate-200 rounded-lg p-6 bg-slate-50/50">
                {/* Question 1 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    1. How happy or peaceful did you feel after listening to the audio? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "1", label: "1 — Very happy/peaceful" },
                      { value: "2", label: "2 — Happy" },
                      { value: "3", label: "3 — Neutral" },
                      { value: "4", label: "4 — Slightly negative" },
                      { value: "5", label: "5 — Indifferent" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="happiness"
                          value={option.value}
                          checked={formData.happiness === option.value}
                          onChange={(e) => handleInputChange("happiness", e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.happiness && (
                    <p className="text-red-500 text-sm mt-1">{errors.happiness}</p>
                  )}
                </div>

                {/* Question 2 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    2. How calm and relaxed did you feel after the session? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "1", label: "1 — Extremely calm/relaxed" },
                      { value: "2", label: "2 — Very calm/relaxed" },
                      { value: "3", label: "3 — Moderately calm/relaxed" },
                      { value: "4", label: "4 — Slightly calm/relaxed" },
                      { value: "5", label: "5 — Not calm/relaxed (indifferent)" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="calmness"
                          value={option.value}
                          checked={formData.calmness === option.value}
                          onChange={(e) => handleInputChange("calmness", e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.calmness && (
                    <p className="text-red-500 text-sm mt-1">{errors.calmness}</p>
                  )}
                </div>

                {/* Question 3 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    3. What's your state of mind after completing the audio? (pick one) <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      "Very Pleasant",
                      "Happy",
                      "Calm",
                      "Indifferent",
                      "Stressed"
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="mindState"
                          value={option}
                          checked={formData.mindState === option}
                          onChange={(e) => handleInputChange("mindState", e.target.value)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.mindState && (
                    <p className="text-red-500 text-sm mt-1">{errors.mindState}</p>
                  )}
                </div>

                {/* Question 4 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    4. Did you sleep during the session? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="didSleep"
                          value={option}
                          checked={formData.didSleep === option}
                          onChange={(e) => handleInputChange("didSleep", e.target.value)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.didSleep && (
                    <p className="text-red-500 text-sm mt-1">{errors.didSleep}</p>
                  )}
                </div>

                {/* Question 5 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    5. Overall, how much did this audio improve your emotional state? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "1", label: "1 — Improved a lot" },
                      { value: "2", label: "2 — Improved" },
                      { value: "3", label: "3 — Slightly improved" },
                      { value: "4", label: "4 — No change" },
                      { value: "5", label: "5 — Got worse/indifferent" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="improvement"
                          value={option.value}
                          checked={formData.improvement === option.value}
                          onChange={(e) => handleInputChange("improvement", e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.improvement && (
                    <p className="text-red-500 text-sm mt-1">{errors.improvement}</p>
                  )}
                </div>

                {/* Question 6 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    6. Would you like to listen to this session again? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "1", label: "1 — Definitely" },
                      { value: "2", label: "2 — Probably" },
                      { value: "3", label: "3 — Not sure" },
                      { value: "4", label: "4 — Probably not" },
                      { value: "5", label: "5 — No" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="listenAgain"
                          value={option.value}
                          checked={formData.listenAgain === option.value}
                          onChange={(e) => handleInputChange("listenAgain", e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.listenAgain && (
                    <p className="text-red-500 text-sm mt-1">{errors.listenAgain}</p>
                  )}
                </div>

                {/* Question 7 */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    7. Any suggestions or comments? (optional)
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => handleInputChange("comments", e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-md resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    rows="4"
                    placeholder="Share your thoughts..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}