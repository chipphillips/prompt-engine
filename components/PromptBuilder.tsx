// PromptBuilder.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { renderTemplate } from "@/lib/renderTemplate"
import { PromptVariables, StyleProfile } from "@/lib/types"
import TemplateSelect from "./TemplateSelect"
import DynamicFields from "./DynamicFields"
import PromptPreview from "./PromptPreview"
import { usePlaceholders } from "@/lib/usePlaceholders"
import PromptLogs from "./PromptLogs"

// Import shadcn UI components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PlusIcon } from "lucide-react"

export default function PromptBuilder() {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [templateObj, setTemplateObj] = useState<any>(null)
  const [profiles, setProfiles] = useState<StyleProfile[]>([])
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [generating, setGenerating] = useState<boolean>(false)
  const [aiResponse, setAiResponse] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState<boolean>(false)

  const placeholders = usePlaceholders(templateObj?.template || "")

  useEffect(() => {
    async function loadData() {
      try {
        // Load style profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("style_profiles")
          .select("*")

        if (profilesError) throw profilesError
        setProfiles(profilesData || [])

        // Load templates
        const { data: templatesData, error: templatesError } = await supabase
          .from("prompt_templates")
          .select("*")

        if (templatesError) throw templatesError
        setTemplates(templatesData || [])

        setLoading(false)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load data. Using sample data instead.")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedTemplate && templates.length > 0) {
      const selected = templates.find(t => t.id === selectedTemplate)
      setTemplateObj(selected)
    }
  }, [selectedTemplate, templates])

  useEffect(() => {
    if (templateObj?.template) {
      try {
        const rendered = renderTemplate(templateObj.template, {
          ...formValues,
          content_style_profile: profiles.find(p => p.id === formValues.content_style_profile_id)
        })
        setPreview(rendered)
      } catch (error) {
        console.error("Error rendering template:", error)
      }
    }
  }, [templateObj, formValues, profiles])

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }))
    setAiResponse("") // Clear previous AI response when inputs change
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Reset form values when template changes
    setFormValues({})
    setAiResponse("")
  }

  const generateAiResponse = async () => {
    if (!templateObj) return

    // Check if all required fields are filled
    const missingFields = placeholders.filter(p => !formValues[p])
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: templateObj.template,
          variables: {
            ...formValues,
            content_style_profile: profiles.find(p => p.id === formValues.content_style_profile_id)
          }
        }),
      })

      const data = await response.json()
      setAiResponse(data.content)
    } catch (err) {
      console.error("Error generating response:", err)
      setError("Failed to generate AI response.")
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-fluid py-12">
          <Card className="flex items-center justify-center h-64 border-none">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="h-12 w-12 border-4 border-t-blue-500 border-r-blue-100 border-b-blue-100 border-l-blue-100 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your workspace...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Sticky */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container-fluid py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-blue flex items-center justify-center text-white font-bold text-xl mr-3">
                P
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Prompt Builder</h1>
                <p className="text-sm text-gray-500">Constructiv AI</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <Button
                onClick={() => setShowLogs(!showLogs)}
                variant={showLogs ? "outline" : "default"}
                size="sm"
              >
                {showLogs ? 'Hide Logs' : 'Show Prompt Logs'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Prompt Logs Popover */}
      {showLogs && (
        <div className="fixed top-20 right-4 z-50">
          <Card className="p-4 w-80 md:w-96 max-h-[80vh] overflow-auto">
            <CardHeader className="p-0 pb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Recent Prompts</h3>
                <Button
                  onClick={() => setShowLogs(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <PromptLogs embedded={true} />
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container-fluid py-6 md:py-8">
        <Card className="mb-6 border-none shadow-md">
          <CardHeader className="pb-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">AI Prompt Workspace</h2>
            <p className="text-gray-600">Create AI-optimized prompts for construction industry tasks</p>
          </CardHeader>
          <CardContent>
            {/* Workflow Steps - Mobile Friendly */}
            <div className="bg-gray-50 -mx-6 px-4 sm:px-6 py-4 border-y border-gray-100 mb-6 overflow-x-auto">
              <div className="flex items-center text-sm font-medium text-gray-500 min-w-[500px]">
                <div className="flex items-center">
                  <span className="flex h-6 w-6 rounded-full bg-blue-500 text-white items-center justify-center text-xs mr-2">1</span>
                  <span className="text-gray-900">Select Template</span>
                </div>
                <svg className="w-4 h-4 mx-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <div className="flex items-center">
                  <span className={`flex h-6 w-6 rounded-full ${templateObj ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} items-center justify-center text-xs mr-2`}>2</span>
                  <span className={templateObj ? 'text-gray-900' : 'text-gray-500'}>Fill Variables</span>
                </div>
                <svg className="w-4 h-4 mx-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <div className="flex items-center">
                  <span className={`flex h-6 w-6 rounded-full ${aiResponse ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} items-center justify-center text-xs mr-2`}>3</span>
                  <span className={aiResponse ? 'text-gray-900' : 'text-gray-500'}>View Result</span>
                </div>
              </div>
            </div>

            {/* Template Selection Section */}
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                <TemplateSelect
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onChange={handleTemplateChange}
                />
              </div>

              <div className="md:col-span-8">
                {templateObj ? (
                  <div>
                    <DynamicFields
                      placeholders={placeholders}
                      formValues={formValues}
                      onChange={handleInputChange}
                      styleProfiles={profiles}
                    />

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Prompt Preview</h3>
                        <div className="text-xs text-gray-500">
                          Estimated tokens: {Math.ceil(preview.length / 4)}
                        </div>
                      </div>
                      <PromptPreview prompt={preview} />
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={generateAiResponse}
                        disabled={generating}
                        className={generating ? "opacity-70" : ""}
                      >
                        {generating ? (
                          <>
                            <div className="h-4 w-4 border-2 border-r-transparent border-white rounded-full animate-spin mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>Generate AI Response</>
                        )}
                      </Button>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    {aiResponse && (
                      <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Response</h3>
                        <Card>
                          <CardContent className="p-4 whitespace-pre-wrap">
                            {aiResponse}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <p className="text-gray-500 text-center">Select a template from the left panel to get started</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
