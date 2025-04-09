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
    // Handle print attempts - unified handler
    const handlePrintAttempt = () => {
      console.log("Print attempt detected");
      setPrintAttempted(true);
      setSecurityNotice("Print attempt detected. Watermark applied.");
      
      // Override print functionality
      const originalPrint = window.print;
      window.print = () => {
        console.log("Print intercepted");
        // Do nothing or show watermark
      };
      
      // Schedule watermark removal and restore print function
      setTimeout(() => {
        setPrintAttempted(false);
        window.print = originalPrint;
      }, 1000);
      
      // Return false to prevent default print behavior
      return false;
    };
    
    // Use both beforeprint event and override window.print
    window.addEventListener('beforeprint', handlePrintAttempt);
    
    // Override print function directly
    const originalPrint = window.print;
    window.print = () => {
      handlePrintAttempt();
      // Don't call original print
    };
    
    // Block keyboard shortcuts
    const blockShortcuts = (e: KeyboardEvent) => {
      // Block print, save, and copy shortcuts
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 'p' || e.key === 's' || e.key === 'c')) {
        e.preventDefault();
        
        // If it's a print shortcut (Ctrl+P), show watermark
        if (e.key === 'p') {
          handlePrintAttempt();
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
    
    // Prevent iframe access for added security
    const preventIframeAccess = () => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.contentWindow) {
          try {
            // Add CSS to prevent selection
            const style = document.createElement('style');
            style.textContent = `
              * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
              }
            `;
            iframe.contentDocument?.head.appendChild(style);
            
            // Block print in iframe
            if (iframe.contentWindow.print) {
              iframe.contentWindow.print = function() {
                console.log("Print attempt in iframe blocked");
                return false;
              };
            }
          } catch (e) {
            // Cross-origin restrictions may prevent this
            console.log("Cannot access iframe content due to security restrictions");
          }
        }
      });
    };
    
    // Add MutationObserver to handle dynamically added iframes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          preventIframeAccess();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Add event listeners
    window.addEventListener('beforeprint', handlePrintAttempt);
    window.addEventListener('keydown', blockShortcuts);
    document.addEventListener('contextmenu', blockContextMenu);
    
    // Initial iframe security
    preventIframeAccess();
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeprint', handlePrintAttempt);
      window.removeEventListener('keydown', blockShortcuts);
      document.removeEventListener('contextmenu', blockContextMenu);
      window.print = originalPrint;
      observer.disconnect();
    };
  }, []);

  // PDF Viewer Component with watermark protection
  const PDFViewer = () => {
    return (
      <div className="space-y-4">
        <div 
          ref={pdfContainerRef}
          className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md border border-gray-200"
        >
          {/* PDF container with CSS print protection */}
          <div className="w-full h-full relative">
            {/* Original PDF iframe - will be visible in normal view */}
            <iframe
              className={`w-full h-full ${printAttempted ? 'invisible' : 'visible'}`}
              src="/sample.pdf#toolbar=0&navpanes=0&scrollbar=0"
              title="PDF document"
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
              }}
            ></iframe>
            
            {/* Always present overlay (invisible normally, appears when printing) */}
            <div 
              className="absolute inset-0 bg-black flex flex-col items-center justify-center overscroll-auto"
              style={{
                opacity: printAttempted ? 1 : 0,
                transition: 'opacity 0.3s ease',
                // Special CSS that only appears when printing
                '@media print': {
                  display: 'flex !important',
                  opacity: '1 !important',
                  zIndex: 9999,
                  backgroundColor: 'black !important',
                  color: 'white !important',
                }
              }}
            >
              <Printer className="w-16 h-16 mx-auto mb-4 text-white" />
              <div className="text-4xl font-bold text-white mb-4">
                PRINTING BLOCKED
              </div>
              <div className="text-xl text-white text-center max-w-lg px-6">
                This document is protected against unauthorized printing or downloading.
              </div>
            </div>
          </div>
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
          
          {/* Test button */}
          <button 
            onClick={() => {
              setPrintAttempted(true);
              setSecurityNotice("Print attempt detected. Watermark applied.");
              setTimeout(() => setPrintAttempted(false), 3000);
            }}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Test Print Protection
          </button>
        </div>
        
        {/* Add print CSS for additional protection */}
        <style>{`
          @media print {
            /* Hide actual content when printing */
            iframe { 
              display: none !important; 
            }
            
            /* Show watermark */
            .print-watermark {
              display: block !important;
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: black;
              color: white;
              z-index: 9999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          }
        `}</style>
        
        {/* Hidden div that appears only when printing */}
        <div className="print-watermark" style={{ display: 'none' }}>
          <Printer className="w-16 h-16 mb-4" />
          <div className="text-4xl font-bold mb-4">PRINTING BLOCKED</div>
          <div className="text-xl text-center max-w-lg px-6">
            This document is protected against unauthorized printing or downloading.
          </div>
        </div>
      </div>
    );
  };

  // Rest of your code remains the same...
  
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
      </div>
    </div>
  );
}

export default App;