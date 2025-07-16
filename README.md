# 🤖 ResumeCraftbot - AI Resume Assistant

A powerful AI-powered chatbot application built with Next.js 15 and modern web technologies. This intelligent assistant specializes in resume analysis, improvement suggestions, and career guidance.

## ✨ Features

- **🔍 Resume Analysis**: Upload and analyze resumes with AI-powered insights
- **💡 Smart Suggestions**: Get intelligent recommendations for resume improvements
- **🎯 Quick Actions**: Pre-built actions for common resume tasks
- **💬 Interactive Chat**: Natural conversation interface with the AI assistant
- **📊 Real-time Feedback**: Instant analysis and suggestions
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **🔄 File Upload**: Support for various resume formats
- **📱 Mobile-friendly**: Responsive design that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kovendhan5/chatbot.git
   cd chatbot
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Add your AI API keys here
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI Integration**: AI SDK with Google Generative AI
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Package Manager**: pnpm

## 📁 Project Structure

```
chatbot/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main chatbot interface
│   ├── actions.ts          # Server actions for AI integration
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # Reusable UI components
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── package.json            # Project dependencies
└── README.md              # This file
```

## 🎯 Key Features Explained

### Resume Analysis

- Upload resume files in various formats
- AI-powered content analysis
- Skill gap identification
- Industry-specific suggestions

### Quick Actions

- **Improve Summary**: Enhance your professional summary
- **Optimize Keywords**: SEO-friendly resume optimization
- **Format Review**: Structure and layout improvements
- **Skill Enhancement**: Identify missing skills for your target role

### Interactive Chat

- Natural language conversation
- Context-aware responses
- Personalized career advice
- Real-time feedback

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🌟 Usage Examples

### Basic Chat

1. Open the application
2. Type your question about resume improvement
3. Get instant AI-powered suggestions

### Resume Upload

1. Click the upload button
2. Select your resume file
3. Wait for AI analysis
4. Review suggestions and improvements

### Quick Actions

1. Choose from pre-built actions
2. Apply suggestions to your resume
3. Get immediate feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kovendhan**

- GitHub: [@kovendhan5](https://github.com/kovendhan5)
- Project: [Chatbot](https://github.com/kovendhan5/chatbot)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI integration powered by [AI SDK](https://sdk.vercel.ai/)
- Icons by [Lucide](https://lucide.dev/)

## 📱 Screenshots

_Coming soon - Add screenshots of your chatbot interface_

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with job boards
- [ ] PDF generation of improved resumes
- [ ] User authentication and history
- [ ] Mobile app version

---

**⚡ Ready to improve your resume with AI? Get started now!**
