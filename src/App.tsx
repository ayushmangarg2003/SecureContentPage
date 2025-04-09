import React, { useState, useEffect, useRef } from 'react';
import { Shield, Youtube, CheckCircle, XCircle, Lock, FileText, BookOpen, AlertTriangle, Printer } from 'lucide-react';

function App() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [printAttempted, setPrintAttempted] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  // Sample MCQ questions
  const questions = [
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 'Paris'
    },
    {
      id: '2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correct: 'Mars'
    }
  ];

  // Enhanced security measures
  useEffect(() => {
    // Handle print attempts
    const handleBeforePrint = () => {
      setPrintAttempted(true);
      setSecurityNotice("Print attempt detected. Watermark applied.");
      
      // Schedule watermark removal after print dialog closes
      setTimeout(() => {
        setPrintAttempted(false);
      }, 1000);
    };
    
    // Block keyboard shortcuts
    const blockShortcuts = (e: KeyboardEvent) => {
      // Block print, save, and copy shortcuts
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 'p' || e.key === 's' || e.key === 'c')) {
        e.preventDefault();
        
        // If it's a print shortcut (Ctrl+P), show watermark
        if (e.key === 'p') {
          handleBeforePrint();
        } else {
          setSecurityNotice("Keyboard shortcuts are disabled for this content.");
        }
      }
    };
    
    // Block right-click
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSecurityNotice("Right-click is disabled for this content.");
    };
    
    // Add event listeners
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('keydown', blockShortcuts);
    document.addEventListener('contextmenu', blockContextMenu);
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('keydown', blockShortcuts);
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, []);

  // Auto-dismiss security notice
  useEffect(() => {
    if (securityNotice) {
      const timer = setTimeout(() => {
        setSecurityNotice(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [securityNotice]);

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Calculate score
  const getScore = () => {
    return questions.reduce((score, question) => {
      return score + (selectedAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
  };

  // Check if an answer is correct
  const isCorrect = (questionId: string, option: string) => {
    const question = questions.find(q => q.id === questionId);
    return question?.correct === option;
  };

  // Simulate print to test watermark
  const simulatePrint = () => {
    handlePrintAttempt();
  };

  // Handle print attempt
  const handlePrintAttempt = () => {
    setPrintAttempted(true);
    setSecurityNotice("Print attempt detected. Watermark applied.");
    
    // Schedule watermark removal after a short delay
    setTimeout(() => {
      setPrintAttempted(false);
    }, 3000);
  };

  // PDF Viewer Component with watermark protection
  const PDFViewer = () => {
    return (
      <div className="space-y-4">
        <div 
          ref={pdfContainerRef}
          className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md border border-gray-200"
        >
          {/* Original PDF iframe - will be visible in normal view */}
          <iframe
            className={`w-full h-full ${printAttempted ? 'hidden' : 'block'}`}
            src="/sample.pdf#toolbar=0"
            title="PDF document"
          ></iframe>
          
          {/* Watermark that appears when printing is attempted */}
          {printAttempted && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
              <div className="text-4xl font-bold text-white mb-4">
                <Printer className="w-16 h-16 mx-auto mb-4" />
                PRINTING BLOCKED
              </div>
              <div className="text-xl text-white text-center max-w-lg px-6">
                This document is protected against unauthorized printing or downloading.
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-800 flex-1">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Print Protection Active</p>
                <p className="mt-1">If you attempt to print this document, a watermark will be applied.</p>
              </div>
            </div>
          </div>
          
          {/* Test button - for demonstration purposes */}
          <button 
            onClick={simulatePrint}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Test Print Protection
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Security Notice Toast */}
        {securityNotice && (
          <div className="fixed top-6 right-6 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{securityNotice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-600">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Secure Content Viewer
          </h1>
          <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
            <Lock className="w-4 h-4 mr-1 text-blue-600" />
            Protected Content
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'video' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Youtube className="w-5 h-5 inline mr-2" />
              Video Content
            </button>
            <button 
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'pdf' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              PDF Document
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'quiz' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Quiz
            </button>
          </div>

          <div className="p-6">
            {/* YouTube Video Section */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <p className="font-medium">Note: This video content is protected and cannot be downloaded or shared.</p>
                </div>
              </div>
            )}

            {/* PDF Viewer Section with watermark protection */}
            {activeTab === 'pdf' && <PDFViewer />}

            {/* MCQ Section */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Answer all questions to test your knowledge</h3>
                </div>
                
                <div className="space-y-8">
                  {questions.map((q) => (
                    <div key={q.id} className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-800 text-lg">{q.question}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((option) => (
                          <label
                            key={option}
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                              ${
                                selectedAnswers[q.id] === option
                                  ? submitted
                                    ? isCorrect(q.id, option)
                                      ? 'bg-green-50 border-green-500 ring-2 ring-green-200'
                                      : 'bg-red-50 border-red-500 ring-2 ring-red-200'
                                    : 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:bg-gray-100'
                              }
                              ${submitted ? 'cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option}
                              checked={selectedAnswers[q.id] === option}
                              onChange={() => !submitted && handleAnswerSelect(q.id, option)}
                              disabled={submitted}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 flex items-center gap-2 font-medium">
                              {option}
                              {submitted && isCorrect(q.id, option) && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                              {submitted && selectedAnswers[q.id] === option && !isCorrect(q.id, option) && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                      {submitted && selectedAnswers[q.id] !== q.correct && (
                        <div className="text-sm text-green-600 font-medium pl-4 mt-2">
                          Correct answer: {q.correct}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Button and Score */}
                <div className="mt-8">
                  {!submitted ? (
                    <button
                      onClick={handleSubmit}
                      disabled={Object.keys(selectedAnswers).length !== questions.length}
                      className={`w-full py-4 px-4 rounded-lg font-medium text-white transition-colors shadow-md
                        ${
                          Object.keys(selectedAnswers).length === questions.length
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="text-center bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
                      <p className="text-2xl font-bold mb-2">
                        Your Score: {getScore()} out of {questions.length}
                      </p>
                      <p className="text-gray-600 mb-4">
                        {getScore() === questions.length 
                          ? "Perfect score! Well done!" 
                          : "Keep practicing to improve your score."}
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setSelectedAnswers({});
                        }}
                        className="py-2 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          <p>© {new Date().getFullYear()} Secure Content Viewer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default App;