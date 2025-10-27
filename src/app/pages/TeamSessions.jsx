import React, { useState, useEffect, useCallback } from "react";
import { Session, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Upload, Languages, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { UploadFile } from "@/api/integrations";

const categories = [
  { value: "body_confidence", label: "Body Confidence" },
  { value: "self_love", label: "Self-Love Collection" },
  { value: "emotional_healing", label: "Emotional Healing" },
  { value: "freedom_path", label: "Freedom Path" },
  { value: "restful_nights", label: "Restful Nights" },
  { value: "bright_minds", label: "Bright Minds" }
];

const languages = [
  { value: "english", label: "English" },
  { value: "indian_english", label: "Indian English" },
  { value: "hindi", label: "Hindi" },
  { value: "arabic", label: "Arabic" },
  { value: "tagalog", label: "Tagalog" },
  { value: "chinese", label: "Chinese" }
];

const plans = [
  { value: "basic", label: "Basic" },
  { value: "premium", label: "Premium" },
  { value: "vip", label: "VIP" }
];

export default function TeamSessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSubSessionForm, setShowSubSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedParentSession, setSelectedParentSession] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", title_en: "", description_en: "", title_ar: "", description_ar: "", title_hi: "", description_hi: "", category: "", duration: 25, languages: [], audio_urls: {}, video_urls: {}, preview_url: "", required_plan: "basic", image_url: "", price: 0, booking_enabled: true, is_sub_session: false, parent_session_id: "", session_order: 1, feedback_form_url: "", worksheet_url: "", how_to_use_pdf_url: ""
  });

  const loadSessions = useCallback(async () => {
    try {
      const sessionsData = await Session.list('-created_date');
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, []);

  const checkTeamAccess = useCallback(async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin' && userData.role !== 'team_member') {
        alert('Access denied. Team privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      await loadSessions();
    } catch (error) {
      console.error('Team access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  }, [loadSessions]);

  useEffect(() => {
    checkTeamAccess();
  }, [checkTeamAccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionDataToSubmit = { ...formData };

      if (editingSession) {
        // Preserve existing audio URLs
        sessionDataToSubmit.audio_urls = editingSession.audio_urls;
        await Session.update(editingSession.id, sessionDataToSubmit);
      } else {
        await Session.create(sessionDataToSubmit);
      }
      
      resetForm();
      await loadSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session');
    }
  };

  const handleAddSubSession = (parentSession) => {
    setSelectedParentSession(parentSession);
    setFormData({
      title: "", description: "", title_en: "", description_en: "", title_ar: "", description_ar: "", title_hi: "", description_hi: "", category: parentSession.category, duration: 25, languages: parentSession.languages || [], audio_urls: {}, video_urls: {}, preview_url: "", required_plan: parentSession.required_plan, image_url: "", price: 0, booking_enabled: true, is_sub_session: true, parent_session_id: parentSession.id, session_order: (sessions.filter(s => s.parent_session_id === parentSession.id).length + 1) || 1, feedback_form_url: "", worksheet_url: "", how_to_use_pdf_url: ""
    });
    setShowSubSessionForm(true);
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({ 
      ...session, 
      languages: session.languages || [],
      title_en: session.title_en || session.title || "",
      description_en: session.description_en || session.description || "",
      title_ar: session.title_ar || "",
      description_ar: session.description_ar || "",
      title_hi: session.title_hi || "",
      description_hi: session.description_hi || "",
    });
    if (session.is_sub_session) {
      setSelectedParentSession(sessions.find(s => s.id === session.parent_session_id));
      setShowSubSessionForm(true);
    } else {
      setShowForm(true);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await Session.delete(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Error deleting session');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", title_en: "", description_en: "", title_ar: "", description_ar: "", title_hi: "", description_hi: "", category: "", duration: 25, languages: [], audio_urls: {}, video_urls: {}, preview_url: "", required_plan: "basic", image_url: "", price: 0, booking_enabled: true, is_sub_session: false, parent_session_id: "", session_order: 1, feedback_form_url: "", worksheet_url: "", how_to_use_pdf_url: ""
    });
    setEditingSession(null);
    setSelectedParentSession(null);
    setShowForm(false);
    setShowSubSessionForm(false);
    setIsUploading(false);
  };

  const handleLanguageChange = (language, checked) => {
    if (checked) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, language] }));
    } else {
      setFormData(prev => ({ ...prev, languages: prev.languages.filter(lang => lang !== language) }));
    }
  };

  const handleFileUpload = async (fieldName, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, [fieldName]: file_url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const mainSessions = sessions.filter(s => !s.is_sub_session);
  const getSubSessions = useCallback((parentId) => sessions.filter(s => s.parent_session_id === parentId), [sessions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("TeamDashboard")}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Sessions</h1>
              <p className="text-slate-600">Add, edit, and organize hypnosis sessions (audio management disabled)</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Session
          </Button>
        </div>

        {(showForm || showSubSessionForm) && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {editingSession ? 'Edit Session' : showSubSessionForm ? `Add Sub-Session to: ${selectedParentSession?.title}` : 'Add New Session'}
                  <Button variant="ghost" size="sm" onClick={resetForm}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Translation Fields */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2"><Languages className="h-5 w-5 text-teal-600" /> Content Translations</h3>
                    <div className="space-y-4">
                      <div><Label>Content (English) *</Label><Input id="title_en" value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value, title: e.target.value})} placeholder="Session Title (EN)" required className="mt-1" /><Textarea id="description_en" value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value, description: e.target.value})} rows={2} placeholder="Session Description (EN)" className="mt-2" /></div>
                      <div><Label>Content (Arabic)</Label><Input id="title_ar" value={formData.title_ar} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} placeholder="Session Title (AR)" className="mt-1" dir="rtl" /><Textarea id="description_ar" value={formData.description_ar} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} rows={2} placeholder="Session Description (AR)" className="mt-2" dir="rtl" /></div>
                      <div><Label>Content (Hindi)</Label><Input id="title_hi" value={formData.title_hi} onChange={(e) => setFormData({...formData, title_hi: e.target.value})} placeholder="Session Title (HI)" className="mt-1" /><Textarea id="description_hi" value={formData.description_hi} onChange={(e) => setFormData({...formData, description_hi: e.target.value})} rows={2} placeholder="Session Description (HI)" className="mt-2" /></div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {!showSubSessionForm && (<div><Label htmlFor="category">Category *</Label><Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required><SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select></div>)}
                    <div><Label htmlFor="duration">Duration (minutes)</Label><Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} className="mt-1" /></div>
                    <div><Label htmlFor="price">Price ($)</Label><Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="mt-1" /></div>
                    {showSubSessionForm && (<div><Label htmlFor="session_order">Session Order</Label><Input id="session_order" type="number" value={formData.session_order} onChange={(e) => setFormData({...formData, session_order: parseInt(e.target.value)})} className="mt-1" /></div>)}
                    <div>
                      <Label className="text-sm font-medium">Session Image</Label>
                      <div className="mt-2 space-y-3">
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4"><div className="text-center"><Upload className="mx-auto h-6 w-6 text-slate-400" /><Label htmlFor="session-image-upload" className="cursor-pointer mt-2 block"><span className="text-xs font-medium text-slate-900">Upload Image</span><span className="block text-xs text-slate-500">JPG, PNG, GIF up to 5MB</span></Label><Input id="session-image-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload('image_url', e)} className="sr-only" disabled={isUploading} /></div></div>
                        {formData.image_url && (<div className="bg-emerald-50 p-2 rounded text-xs text-emerald-800 flex items-center">✓ Image uploaded or linked<img src={formData.image_url} alt="Preview" className="w-8 h-8 object-cover ml-2 rounded-sm" /></div>)}
                        <div className="text-center text-slate-500 text-xs">OR</div>
                        <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="Image URL" className="text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2"><Checkbox id="booking_enabled" checked={formData.booking_enabled} onCheckedChange={(checked) => setFormData({...formData, booking_enabled: checked})} /><Label htmlFor="booking_enabled" className="text-sm">Enable Booking</Label></div>
                    <div><Label htmlFor="required_plan">Required Plan</Label><Select value={formData.required_plan} onValueChange={(value) => setFormData({...formData, required_plan: value})}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{plans.map((plan) => (<SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>))}</SelectContent></Select></div>
                  </div>
                  
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-r-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-medium text-sm">Audio management is disabled for team members. An administrator must upload and manage audio files.</p>
                    </div>
                  </div>

                  <div><Label htmlFor="preview_url">Preview Audio URL (for non-members)</Label><Input id="preview_url" value={formData.preview_url} onChange={(e) => setFormData({...formData, preview_url: e.target.value})} className="mt-1" placeholder="https://..." /></div>

                  {/* Downloadable Files Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Downloadable Files (Post-Purchase)</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div><Label className="text-sm font-medium">Feedback Form</Label><div className="mt-2 space-y-3"><div className="border-2 border-dashed border-slate-200 rounded-lg p-4"><div className="text-center"><Upload className="mx-auto h-6 w-6 text-slate-400" /><Label htmlFor="feedback-form-upload" className="cursor-pointer mt-2 block"><span className="text-xs font-medium text-slate-900">Upload Feedback Form</span><span className="block text-xs text-slate-500">PDF, DOC up to 10MB</span></Label><Input id="feedback-form-upload" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload('feedback_form_url', e)} className="sr-only" disabled={isUploading} /></div></div>{formData.feedback_form_url && (<div className="bg-emerald-50 p-2 rounded text-xs text-emerald-800">✓ Feedback form uploaded</div>)}<div className="text-center text-slate-500 text-xs">OR</div><Input value={formData.feedback_form_url} onChange={(e) => setFormData({...formData, feedback_form_url: e.target.value})} placeholder="File URL" className="text-xs" /></div></div>
                      <div><Label className="text-sm font-medium">Worksheet</Label><div className="mt-2 space-y-3"><div className="border-2 border-dashed border-slate-200 rounded-lg p-4"><div className="text-center"><Upload className="mx-auto h-6 w-6 text-slate-400" /><Label htmlFor="worksheet-upload" className="cursor-pointer mt-2 block"><span className="text-xs font-medium text-slate-900">Upload Worksheet</span><span className="block text-xs text-slate-500">PDF, DOC up to 10MB</span></Label><Input id="worksheet-upload" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload('worksheet_url', e)} className="sr-only" disabled={isUploading} /></div></div>{formData.worksheet_url && (<div className="bg-emerald-50 p-2 rounded text-xs text-emerald-800">✓ Worksheet uploaded</div>)}<div className="text-center text-slate-500 text-xs">OR</div><Input value={formData.worksheet_url} onChange={(e) => setFormData({...formData, worksheet_url: e.target.value})} placeholder="File URL" className="text-xs" /></div></div>
                      <div><Label className="text-sm font-medium">How to Use Guide</Label><div className="mt-2 space-y-3"><div className="border-2 border-dashed border-slate-200 rounded-lg p-4"><div className="text-center"><Upload className="mx-auto h-6 w-6 text-slate-400" /><Label htmlFor="howto-upload" className="cursor-pointer mt-2 block"><span className="text-xs font-medium text-slate-900">Upload How-to Guide</span><span className="block text-xs text-slate-500">PDF up to 10MB</span></Label><Input id="howto-upload" type="file" accept=".pdf" onChange={(e) => handleFileUpload('how_to_use_pdf_url', e)} className="sr-only" disabled={isUploading} /></div></div>{formData.how_to_use_pdf_url && (<div className="bg-emerald-50 p-2 rounded text-xs text-emerald-800">✓ Guide uploaded</div>)}<div className="text-center text-slate-500 text-xs">OR</div><Input value={formData.how_to_use_pdf_url} onChange={(e) => setFormData({...formData, how_to_use_pdf_url: e.target.value})} placeholder="File URL" className="text-xs" /></div></div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isUploading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                      {isUploading ? (<div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Uploading...</div>) : (<><Save className="h-4 w-4 mr-2" />{editingSession ? 'Update Session' : 'Create Session'}</>)}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-6">
          {mainSessions.map((session, index) => {
            const subSessions = getSubSessions(session.id);
            return (
              <motion.div key={session.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {session.image_url && (<div className="aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg mb-4 overflow-hidden w-48 float-right ml-4"><img src={session.image_url} alt={session.title} className="w-full h-full object-cover"/></div>)}
                        <CardTitle className="text-xl leading-tight">{session.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-2">{session.description || "No description available"}</p>
                        <div className="flex flex-wrap gap-2 mt-4"><Badge className="bg-teal-100 text-teal-800">{categories.find(c => c.value === session.category)?.label}</Badge><Badge className="bg-amber-100 text-amber-800">{session.required_plan}</Badge><Badge variant="outline">${session.price || 0}</Badge><Badge variant="outline">{session.duration}min</Badge><Badge className={session.booking_enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{session.booking_enabled ? "Bookable" : "Not Bookable"}</Badge></div>
                      </div>
                      <div className="flex gap-2 ml-4 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleAddSubSession(session)} className="text-blue-600 hover:text-blue-700"><Plus className="h-4 w-4 mr-1" />Add Sub-Session</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(session)} className="text-teal-600 hover:text-teal-700"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(session.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  {subSessions.length > 0 && (<CardContent><h4 className="font-semibold text-slate-800 mb-3">Sub-Sessions ({subSessions.length})</h4><div className="grid md::grid-cols-2 gap-4">{subSessions.sort((a, b) => a.session_order - b.session_order).map((subSession) => (<div key={subSession.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50"><div className="flex justify-between items-start"><div className="flex-1"><h5 className="font-medium text-slate-800">{subSession.session_order}. {subSession.title}</h5><p className="text-sm text-slate-600 mt-1 line-clamp-2">{subSession.description}</p><div className="flex gap-2 mt-2"><Badge variant="outline" className="text-xs">{subSession.duration}min</Badge><Badge variant="outline" className="text-xs">${subSession.price || 0}</Badge></div></div><div className="flex gap-1 ml-2"><Button size="sm" variant="ghost" onClick={() => handleEdit(subSession)} className="text-teal-600 hover:text-teal-700 p-1"><Edit className="h-3 w-3" /></Button><Button size="sm" variant="ghost" onClick={() => handleDelete(subSession.id)} className="text-red-600 hover:text-red-700 p-1"><Trash2 className="h-3 w-3" /></Button></div></div></div>))}</div></CardContent>)}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {mainSessions.length === 0 && (<div className="text-center py-16"><p className="text-xl text-slate-600 mb-4">No sessions found</p><Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Create Your First Session</Button></div>)}
      </div>
    </div>
  );
}