"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
    Bot,
    CheckCircle,
    Edit,
    FileCheck,
    FileText,
    Layout,
    MessageSquare,
    Plus,
    Search,
    Send,
    Settings,
    Sparkles,
    Target,
    TrendingUp,
    Upload,
    User,
    Zap,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { chatWithBot, executeQuickAction, uploadResume } from "./actions"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ResumeData {
  content: string
  filename: string
  uploadedAt: Date
}

const quickActions = [
  {
    id: "improve-summary",
    label: "Improve Summary",
    icon: Edit,
    description: "Rewrite summary to be strong and relevant",
  },
  { id: "optimize-ats", label: "Optimize for ATS", icon: CheckCircle, description: "Remove ATS-blocking elements" },
  {
    id: "fix-experience",
    label: "Fix Experience",
    icon: TrendingUp,
    description: "Enhance with metrics and action verbs",
  },
  { id: "add-keywords", label: "Add Keywords", icon: Search, description: "Inject missing role-specific terms" },
  { id: "job-match", label: "Job Match Check", icon: Target, description: "Compare with job description" },
  { id: "fix-skills", label: "Fix Skills Section", icon: Settings, description: "Structure and align skills" },
  { id: "rewrite-projects", label: "Rewrite Projects", icon: Sparkles, description: "Show project value and impact" },
  { id: "grammar-check", label: "Grammar Check", icon: FileCheck, description: "Fix tone and grammar errors" },
  { id: "layout-fix", label: "Layout Fix", icon: Layout, description: "Ensure ATS-compliant structure" },
  { id: "suggest-missing", label: "What's Missing?", icon: Plus, description: "Identify gaps for target job" },
]

export default function ResumeCraftBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `🎯 **Welcome to ResumeCraftBot!**

I'm your professional AI resume coach. I'll help you build, fix, and optimize your resume for any job role.

**📋 What I can do:**
• Rewrite resume sections (summary, experience, skills, projects)
• Match your resume to job descriptions
• Add missing keywords and optimize for ATS
• Fix grammar, tone, and formatting
• Provide step-by-step coaching

**🚀 Get Started:**
1. **Upload your resume** (PDF, DOCX, or text)
2. **Add your target job description**
3. **Use Quick Actions** or ask me anything!

Let's make your resume stand out! 💪`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadResume(formData)

      setResumeData({
        content: result.content,
        filename: file.name,
        uploadedAt: new Date(),
      })

      const botMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `✅ **Resume uploaded successfully!**

**📄 File:** ${file.name}
**📊 Size:** ${(file.size / 1024).toFixed(1)} KB
**⏰ Uploaded:** ${new Date().toLocaleTimeString()}

Your resume is now loaded and ready for optimization! 

**Next steps:**
• Add your target job description below
• Use the Quick Actions for instant improvements
• Ask me specific questions about your resume

What would you like to work on first?`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `❌ **Upload failed:** ${error instanceof Error ? error.message : "Unknown error"}

Please try again with a PDF, DOCX, or text file (max 5MB).`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleQuickAction = async (actionId: string) => {
    if (!resumeData?.content) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "❌ Please upload your resume first before using Quick Actions.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    const action = quickActions.find((a) => a.id === actionId)
    if (!action) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `🚀 **Quick Action:** ${action.label}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await executeQuickAction({
        actionId,
        resumeContent: resumeData.content,
        jobDescription,
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `❌ Action failed. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await chatWithBot({
        message: inputMessage,
        resumeContent: resumeData?.content || "",
        jobDescription,
        conversationHistory: messages.slice(-10),
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `❌ Sorry, I encountered an error. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs">$1</code>')
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResumeCraftBot
              </h1>
              <p className="text-sm text-gray-600">Professional AI Resume Coach & Optimizer</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {resumeData && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  {resumeData.filename}
                </Badge>
              )}
              {jobDescription && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Job Description Added
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {/* Upload Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.rtf"
                  className="hidden"
                  aria-label="Upload resume file"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {resumeData ? "Replace File" : "Choose File"}
                </Button>
                <p className="text-xs text-gray-500">PDF, DOCX, DOC, TXT, RTF (max 5MB)</p>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Target Job
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Paste job description or job title here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
                <p className="text-xs text-gray-500">Add job details for better optimization</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                {quickActions.map((action) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2 px-3"
                      onClick={() => handleQuickAction(action.id)}
                      disabled={isLoading}
                    >
                      <IconComponent className="h-3 w-3 mr-2 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-gray-500 text-xs">{action.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="xl:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Resume Coaching Chat
                  {isLoading && (
                    <div className="ml-auto flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span className="text-xs">Working...</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 py-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "bot" && (
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-lg px-4 py-3 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "bg-gray-50 text-gray-900 border"
                          }`}
                        >
                          <div
                            className="text-sm whitespace-pre-wrap leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: formatMessageContent(message.content),
                            }}
                          />
                          <div className={`text-xs mt-2 opacity-70`}>{message.timestamp.toLocaleTimeString()}</div>
                        </div>

                        {message.type === "user" && (
                          <div className="bg-gray-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading Animation */}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white animate-pulse" />
                        </div>
                        <div className="max-w-[85%] rounded-lg px-4 py-3 bg-gray-50 text-gray-900 border">
                          <div className="flex items-center gap-2">
                            <div className="typing-indicator">
                              <div className="typing-dot"></div>
                              <div className="typing-dot"></div>
                              <div className="typing-dot"></div>
                            </div>
                            <span className="text-sm text-gray-600 ml-2">ResumeCraftBot is analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Input Area */}
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your resume... (e.g., 'Improve my skills section', 'Add keywords for DevOps')"
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()} size="icon">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputMessage("Give me a complete resume review")}
                      className="text-xs"
                    >
                      Complete Review
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputMessage("What's the ATS score of my resume?")}
                      className="text-xs"
                    >
                      ATS Score
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputMessage("How well does my resume match the job?")}
                      className="text-xs"
                    >
                      Job Match
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
