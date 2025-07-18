"use server"

import { google } from "@ai-sdk/google"
import { generateText } from "ai"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatRequest {
  message: string
  resumeContent: string
  jobDescription: string
  conversationHistory: Message[]
}

interface QuickActionRequest {
  actionId: string
  resumeContent: string
  jobDescription: string
}

export async function uploadResume(formData: FormData) {
  const file = formData.get("file") as File

  if (!file) {
    throw new Error("No file provided")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size too large. Please upload a file smaller than 5MB.")
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword", // .doc files
    "text/plain",
    "text/rtf", // Rich Text Format
  ]
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload a PDF, DOCX, DOC, RTF, or TXT file.")
  }

  try {
    let content = ""

    if (file.type === "text/plain") {
      content = await file.text()
    } else if (file.type === "application/pdf") {
      // Handle PDF files - provide helpful guidance for now
      // In production, you can use server-side PDF parsing services
      
      content = `[PDF File: ${file.name}]

📄 **PDF file received successfully!**

**To analyze your resume, I need the text content. Here are your options:**

**🚀 Option 1 - Copy & Paste (Recommended):**
1. Open your PDF file
2. Select all text (Ctrl+A)
3. Copy (Ctrl+C) and paste it here

**🔄 Option 2 - Convert to Text:**
• Use Google Drive (upload PDF, right-click → Open with Google Docs)
• Use online converters: ilovepdf.com, smallpdf.com
• Export as .txt from your PDF reader

**📝 Option 3 - Upload as Word Doc:**
• Save your resume as .docx format
• Upload the Word document instead

**💡 Why this helps:**
• ATS systems prefer text-searchable formats
• Enables better keyword analysis
• Allows for comprehensive resume optimization

**Once you provide the text, I can:**
✅ Calculate ATS compatibility score
✅ Identify missing keywords
✅ Suggest improvements
✅ Optimize for your target job

Please paste your resume content below! 🎯`
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") {
      // Handle DOCX and DOC files - for now, show a helpful message
      content = `[Word Document: ${file.name}]

For Word documents (.docx/.doc), please convert to PDF or plain text format for optimal processing. 

Alternatively, you can:
1. Open your Word document
2. Copy the text content
3. Paste it directly in the chat

This will allow me to provide the best resume analysis and suggestions.`
    } else if (file.type === "text/rtf") {
      // Handle RTF files
      const text = await file.text()
      content = text.replace(/\\[^\\{}]+/g, '').replace(/[{}]/g, '').trim()
    } else {
      content = await file.text() // Fallback
    }

    if (!content.trim()) {
      throw new Error("No text content found in the file. Please ensure your file contains readable text.")
    }

    return {
      content,
      filename: file.name,
      size: file.size,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to process file. Please try again.")
  }
}

export async function executeQuickAction({ actionId, resumeContent, jobDescription }: QuickActionRequest) {
  const actionPrompts = {
    "improve-summary": `Analyze and rewrite the professional summary/objective section of this resume to be more compelling, specific, and aligned with the target job. Make it strong, clear, and relevant.

FOCUS ON:
- Clear value proposition
- Relevant skills and experience
- Quantifiable achievements
- Professional tone
- 2-3 sentences maximum

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "General professional role"}

Provide the improved summary and explain what changes were made.`,

    "optimize-ats": `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide specific fixes to improve parsing and keyword recognition.

CHECK FOR:
- Standard section headings
- Simple formatting
- Keyword optimization
- File format compatibility
- Contact information placement
- Bullet point structure

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "General professional role"}

Provide ATS optimization suggestions and a compatibility score (0-100).`,

    "fix-experience": `Enhance the work experience section with stronger action verbs, quantifiable metrics, and clearer impact statements.

IMPROVE:
- Action verbs (led, managed, implemented, etc.)
- Quantifiable results (%, $, numbers)
- Clear responsibilities and achievements
- Professional formatting
- Relevance to target role

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "General professional role"}

Rewrite the experience section with improvements and explain changes.`,

    "add-keywords": `Compare this resume with the target job description and identify missing keywords and skills that should be added.

ANALYZE:
- Technical skills mentioned in job description
- Industry-specific terms
- Required qualifications
- Soft skills
- Tools and technologies

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "Please provide a job description for better keyword analysis"}

List missing keywords and suggest where to incorporate them.`,

    "job-match": `Compare this resume against the target job description and provide a detailed match analysis with a score and improvement suggestions.

EVALUATE:
- Skills alignment
- Experience relevance
- Keyword coverage
- Qualification match
- Overall fit

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "Please provide a job description for accurate matching"}

Provide a match score (0-100) and specific suggestions to improve alignment.`,

    "fix-skills": `Restructure and optimize the skills section to be more organized, relevant, and aligned with the target job.

ORGANIZE:
- Technical skills
- Soft skills
- Tools and technologies
- Certifications
- Industry-specific skills

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "General professional role"}

Provide an improved skills section with better organization and relevance.`,

    "rewrite-projects": `Rewrite the projects section to better showcase value, impact, and technical skills relevant to the target role.

ENHANCE:
- Project descriptions
- Technologies used
- Quantifiable outcomes
- Business impact
- Technical complexity

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "General professional role"}

Rewrite project entries with stronger impact and technical detail.`,

    "grammar-check": `Review this resume for grammar, spelling, punctuation, and tone issues. Provide corrections and improvements.

CHECK FOR:
- Grammar errors
- Spelling mistakes
- Punctuation issues
- Consistency in tense
- Professional tone
- Clarity and readability

Resume Content:
${resumeContent}

Provide specific corrections and an overall tone assessment.`,

    "layout-fix": `Analyze and improve the resume structure and formatting to ensure it follows industry standards and is ATS-compliant.

REVIEW:
- Section order and headings
- Formatting consistency
- White space usage
- Font and styling
- Contact information placement
- Overall readability

Resume Content:
${resumeContent}

Provide layout improvement suggestions and a restructured format.`,

    "suggest-missing": `Analyze this resume against the target job and identify what sections, skills, or information is missing or weak.

IDENTIFY:
- Missing sections (certifications, projects, etc.)
- Weak areas that need strengthening
- Additional skills to highlight
- Experience gaps to address
- Information that would improve candidacy

Resume Content:
${resumeContent}

Target Job/Description:
${jobDescription || "General professional role"}

List specific missing elements and suggestions for improvement.`,
  }

  const prompt = actionPrompts[actionId as keyof typeof actionPrompts]
  if (!prompt) {
    throw new Error("Invalid action ID")
  }

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt,
      temperature: 0.3,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error("Quick action error:", error)
    throw new Error("Failed to execute action. Please try again.")
  }
}

export async function chatWithBot({ message, resumeContent, jobDescription, conversationHistory }: ChatRequest) {
  const contextHistory = conversationHistory
    .slice(-8)
    .map((msg) => `${msg.type === "user" ? "User" : "Bot"}: ${msg.content}`)
    .join("\n")

  const systemPrompt = `You are ResumeCraftBot, a professional AI resume coach and optimizer. You help users build, fix, and optimize their resumes for specific job roles.

CAPABILITIES:
- Rewrite resume sections (summary, experience, skills, education, projects)
- Match resumes to job descriptions with scoring
- Add missing domain-specific keywords
- Optimize for ATS (Applicant Tracking System)
- Fix grammar, clarity, and tone
- Provide step-by-step coaching
- Suggest powerful action verbs and quantifiable impact
- Identify weak or missing sections

RESPONSE STYLE:
- Professional but friendly tone
- Use bullet points and formatting for clarity
- Provide specific, actionable advice
- Include examples when helpful
- Use emojis sparingly for emphasis
- Format output in clean Markdown

CURRENT CONTEXT:
- Resume Available: ${resumeContent ? "Yes" : "No"}
- Resume Length: ${resumeContent.length} characters
- Job Description: ${jobDescription ? "Provided" : "Not provided"}

RECENT CONVERSATION:
${contextHistory}

Always be specific and practical in your advice. If the user hasn't uploaded a resume or provided a job description, guide them to do so for better assistance.`

  const userPrompt = `User Message: ${message}

${resumeContent ? `RESUME CONTENT:\n${resumeContent}` : "No resume uploaded yet."}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : "No job description provided."}

Please provide helpful, specific advice based on the user's request.`

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1200,
    })

    return text
  } catch (error) {
    console.error("Chat error:", error)
    throw new Error("Failed to process your request. Please try again.")
  }
}
